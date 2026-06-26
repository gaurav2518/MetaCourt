import { NextResponse } from "next/server";
import { z } from "zod";

import connectDB from "@/lib/mongodb";
import { requireRole } from "@/middleware/roleGuard";
import { requireAuth } from "@/middleware/auth";

import Complaint from "@/models/Complaint";

import { ROLES, STATUS, PRIORITY } from "@/constants";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ caseId: string }> }
) {
  try {
    await connectDB();

    const user = await requireAuth();

    const { caseId } = await params;

    const complaint = await Complaint.findOne({ caseId })
      .populate("evidence")
      .populate("defenseEvidence")
      .populate("complainantId", "name email")
      .populate("oppositeParty.userId", "name email")
      .populate("assignedJurors", "name reputationScore jurorLevel")
      .lean();

    if (!complaint) {
      return NextResponse.json(
        { message: "Complaint not found" },
        { status: 404 }
      );
    }

    const isComplainant =
      complaint.complainantId?._id?.toString() === user.userId ||
      complaint.complainantId?.toString() === user.userId;

    const isOppositeParty =
      complaint.oppositeParty?.userId?._id?.toString() === user.userId ||
      complaint.oppositeParty?.userId?.toString() === user.userId;

    const isJuror = complaint.assignedJurors?.some(
      (juror: any) =>
        juror?._id?.toString() === user.userId ||
        juror?.toString() === user.userId
    );

    const hasAccess =
      isComplainant ||
      isOppositeParty ||
      isJuror ||
      user.role === ROLES.ADMIN;

    if (!hasAccess) {
      return NextResponse.json(
        { message: "Forbidden" },
        { status: 403 }
      );
    }

    return NextResponse.json(
      {
        complaint,
        relationship: isComplainant
          ? "complainant"
          : isOppositeParty
          ? "opposite_party"
          : isJuror
          ? "juror"
          : "admin",
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { message: "Failed to fetch complaint" },
      { status: 500 }
    );
  }
}

const updateComplaintSchema = z.object({
  status: z
    .enum([
      STATUS.PENDING,
      STATUS.UNDER_REVIEW,
      STATUS.VOTING,
      STATUS.DECIDED,
      STATUS.CLOSED,
      STATUS.APPEALED,
      STATUS.REJECTED,
    ])
    .optional(),

  priority: z
    .enum([
      PRIORITY.LOW,
      PRIORITY.MEDIUM,
      PRIORITY.HIGH,
    ])
    .optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ caseId: string }> }
) {
  try {
    await connectDB();

    const admin = await requireAuth();
    requireRole(admin, [ROLES.ADMIN]);

    const { caseId } = await params;

    const body = await req.json();
    const { status, priority } = updateComplaintSchema.parse(body);

    if (!status && !priority) {
      return NextResponse.json(
        { message: "Status or priority is required" },
        { status: 400 }
      );
    }

    const complaint = await Complaint.findOne({ caseId });

    if (!complaint) {
      return NextResponse.json(
        { message: "Complaint not found" },
        { status: 404 }
      );
    }

    if (status) complaint.status = status;
    if (priority) complaint.priority = priority;

    await complaint.save();

    const updatedComplaint = await Complaint.findOne({ caseId })
      .populate("evidence")
      .populate("defenseEvidence")
      .populate("complainantId", "name email")
      .populate("oppositeParty.userId", "name email")
      .populate("assignedJurors", "name email reputationScore jurorLevel")
      .lean();

    return NextResponse.json(
      {
        message: "Complaint updated successfully",
        complaint: updatedComplaint,
      },
      { status: 200 }
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

    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(
      { message: "Failed to update complaint" },
      { status: 500 }
    );
  }
}