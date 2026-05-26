import { NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";
import { requireAuth } from "@/middleware/auth";

import Complaint from "@/models/Complaint";

import { ROLES } from "@/constants";

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