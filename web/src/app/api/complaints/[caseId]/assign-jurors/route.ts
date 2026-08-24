import { NextResponse } from "next/server";
import { z } from "zod";

import connectDB from "@/lib/mongodb";
import { requireAuth } from "@/middleware/auth";
import { requireRole } from "@/middleware/roleGuard";

import Complaint from "@/models/Complaint";
import User from "@/models/User";

import { ROLES, STATUS } from "@/constants";

const assignJurorsSchema = z.object({
  jurorIds: z
    .array(z.string().min(1))
    .refine((ids) => ids.length === 3 || ids.length === 5, {
      message: "Juror count must be either 3 or 5",
    })
    .refine((ids) => new Set(ids).size === ids.length, {
      message: "Duplicate juror IDs are not allowed",
    }),

  votingDeadlineDays: z.number().int().min(1).max(30),
});

export async function POST(
  req: Request,
  { params }: { params: Promise<{ caseId: string }> }
) {
  try {
    await connectDB();

    const admin = await requireAuth();
    requireRole(admin, [ROLES.ADMIN]);

    const { caseId } = await params;

    const body = await req.json();
    const { jurorIds, votingDeadlineDays } = assignJurorsSchema.parse(body);

    const complaint = await Complaint.findOne({ caseId });

    if (!complaint) {
      return NextResponse.json(
        { message: "Complaint not found" },
        { status: 404 }
      );
    }

    const verifiedJurors = await User.find({
      _id: { $in: jurorIds },
      role: ROLES.JUROR,
      isVerifiedJuror: true,
      isBanned: false,
    }).select("_id name email role isVerifiedJuror");

    if (verifiedJurors.length !== jurorIds.length) {
      return NextResponse.json(
        {
          message:
            "All selected users must be verified, active jurors",
        },
        { status: 400 }
      );
    }

    const complainantId = complaint.complainantId?.toString();
    const oppositePartyUserId =
      complaint.oppositeParty?.userId?.toString() || null;

    const hasConflict = jurorIds.some(
      (jurorId) =>
        jurorId === complainantId ||
        jurorId === oppositePartyUserId
    );

    if (hasConflict) {
      return NextResponse.json(
        {
          message:
            "A complainant or opposite party cannot be assigned as juror for the same case",
        },
        { status: 400 }
      );
    }

    const votingDeadline = new Date();
    votingDeadline.setDate(votingDeadline.getDate() + votingDeadlineDays);

    complaint.assignedJurors = jurorIds;
    complaint.jurorCount = jurorIds.length;
    complaint.votingDeadline = votingDeadline;
    complaint.status = STATUS.VOTING;

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
        message: "Jurors assigned successfully",
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

    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json(
        { message: "Forbidden" },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { message: "Failed to assign jurors" },
      { status: 500 }
    );
  }
}