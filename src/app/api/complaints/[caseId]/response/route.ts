import {NextResponse} from 'next/server';
import {z} from 'zod';

import connectDB from '@/lib/mongodb';
import {requireAuth} from '@/middleware/auth';

import Complaint from '@/models/Complaint';
import Evidence from '@/models/Evidence';

const responseSchema = z.object({
    defenseStatement: z
    .string()
    .min(10, "Defense statement must be at least 10 characters long")
    .max(1000, "Defense statement must be at most 1000 characters long"),

    evidence: z
    .array(
        z.object({
            url:z.string().url(),
            publicId:z.string(),
            fileType: z.enum(["image", "pdf", "document"]).optional(),
            fileName: z.string().optional(),
            fileSize: z.number().optional(), 
        })
    )
    .optional()
    .default([]),
});

export async function POST(
  req: Request,
  { params }: { params: Promise<{ caseId: string }> }
) {
  try {
    await connectDB();

    const user = await requireAuth();
    const { caseId } = await params;

    const body = await req.json();
    const validatedData = responseSchema.parse(body);

    const complaint = await Complaint.findOne({ caseId });

    if (!complaint) {
      return NextResponse.json(
        { message: "Complaint not found" },
        { status: 404 }
      );
    }

    const oppositePartyUserId = complaint.oppositeParty?.userId?.toString();

    if (oppositePartyUserId !== user.userId) {
      return NextResponse.json(
        { message: "Only the opposite party can respond to this complaint" },
        { status: 403 }
      );
    }

    if (complaint.defenseStatement) {
      return NextResponse.json(
        { message: "Defense response already submitted and locked" },
        { status: 409 }
      );
    }

    const evidenceDocs = await Evidence.insertMany(
      validatedData.evidence.map((file) => ({
        complaintId: complaint._id,
        uploadedBy: user.userId,
        uploadedByRole: "opposite_party",
        fileUrl: file.url,
        publicId: file.publicId,
        fileType: file.fileType || "document",
        fileName: file.fileName || "uploaded-file",
        fileSize: file.fileSize || 0,
        ipfsHash: null,
      }))
    );

    complaint.defenseStatement = validatedData.defenseStatement;
    complaint.defenseEvidence = evidenceDocs.map((evidence) => evidence._id);

    await complaint.save();

    const updatedComplaint = await Complaint.findOne({ caseId })
      .populate("evidence")
      .populate("defenseEvidence")
      .populate("complainantId", "name email")
      .populate("oppositeParty.userId", "name email")
      .populate("assignedJurors", "name reputationScore jurorLevel")
      .lean();

    return NextResponse.json(
      {
        message: "Defense response submitted successfully",
        complaint: updatedComplaint,
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          message: "Validation failed",
          errors: error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { message: "Failed to submit defense response" },
      { status: 500 }
    );
  }
}