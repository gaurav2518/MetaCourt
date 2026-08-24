import { NextResponse } from "next/server";
import { z } from "zod";

import connectDB from "@/lib/mongodb";
import { requireAuth } from "@/middleware/auth";

import Complaint from "@/models/Complaint";
import Evidence from "@/models/Evidence";

import { ROLES } from "@/constants";

const evidenceSchema = z.object({
  evidence: z
    .array(
      z.object({
        url: z.string().url(),
        publicId: z.string().min(1),
        fileType: z.enum(["image", "pdf", "document", "video"]).optional(),
        fileName: z.string().optional(),
        fileSize: z.number().optional(),
      })
    )
    .min(1, "At least one evidence file is required"),
});

function hasComplaintAccess(complaint: any, userId: string, role: string) {
  if (role === ROLES.ADMIN) return true;
  if (complaint.complainantId?.toString() === userId) return true;
  if (complaint.oppositeParty?.userId?.toString() === userId) return true;

  return (complaint.assignedJurors || []).some(
    (jurorId: unknown) => String(jurorId) === userId
  );
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ caseId: string }> }
) {
  try {
    await connectDB();

    const user = await requireAuth();
    const { caseId } = await params;

    const complaint = await Complaint.findOne({ caseId });

    if (!complaint) {
      return NextResponse.json(
        { message: "Complaint not found" },
        { status: 404 }
      );
    }

    if (!hasComplaintAccess(complaint, user.userId, user.role)) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const evidence = await Evidence.find({ complaintId: complaint._id })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ evidence }, { status: 200 });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      { message: "Failed to fetch evidence" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ caseId: string }> }
) {
  try {
    await connectDB();

    const user = await requireAuth();
    const { caseId } = await params;
    const body = await req.json();
    const data = evidenceSchema.parse(body);

    const complaint = await Complaint.findOne({ caseId });

    if (!complaint) {
      return NextResponse.json(
        { message: "Complaint not found" },
        { status: 404 }
      );
    }

    const isComplainant = complaint.complainantId?.toString() === user.userId;
    const isOppositeParty =
      complaint.oppositeParty?.userId?.toString() === user.userId;

    if (!isComplainant && !isOppositeParty) {
      return NextResponse.json(
        { message: "Only case parties can upload evidence" },
        { status: 403 }
      );
    }

    const evidenceDocs = await Evidence.insertMany(
      data.evidence.map((file) => ({
        complaintId: complaint._id,
        uploadedBy: user.userId,
        uploadedByRole: isComplainant ? "complainant" : "opposite_party",
        fileUrl: file.url,
        publicId: file.publicId,
        fileType: file.fileType || "document",
        fileName: file.fileName || "uploaded-file",
        fileSize: file.fileSize || 0,
        ipfsHash: null,
      }))
    );

    if (isComplainant) {
      complaint.evidence.push(...evidenceDocs.map((evidence) => evidence._id));
    } else {
      complaint.defenseEvidence.push(
        ...evidenceDocs.map((evidence) => evidence._id)
      );
    }

    await complaint.save();

    return NextResponse.json(
      {
        message: "Evidence added successfully",
        evidence: evidenceDocs,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Validation failed", errors: error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      { message: "Failed to add evidence" },
      { status: 500 }
    );
  }
}
