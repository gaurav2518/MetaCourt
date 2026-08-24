import { NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";
import { requireAuth } from "@/middleware/auth";

import Complaint from "@/models/Complaint";
import Vote from "@/models/Vote";

import { ROLES } from "@/constants";

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

    const votes = await Vote.find({
      complaintId: complaint._id,
    }).lean();

    const counts = {
      valid: votes.filter((v) => v.vote === "valid").length,
      invalid: votes.filter((v) => v.vote === "invalid").length,
      needs_evidence: votes.filter((v) => v.vote === "needs_evidence").length,
    };

    const summary = {
      ...counts,
      total: votes.length,
      decided: complaint.status === "decided",
    };

    // -----------------------------
    // Admin -> Full vote details
    // -----------------------------
    if (user.role === ROLES.ADMIN) {
      const detailedVotes = await Vote.find({
        complaintId: complaint._id,
      })
        .populate("jurorId", "name email reputationScore jurorLevel")
        .lean();

      return NextResponse.json(
        {
          ...summary,
          votes: detailedVotes,
        },
        { status: 200 }
      );
    }

    // -----------------------------
    // Assigned Juror
    // -----------------------------
    if (user.role === ROLES.JUROR) {
      const assigned = complaint.assignedJurors.some(
        (id: any) => id.toString() === user.userId
      );

      if (!assigned) {
        return NextResponse.json(
          { message: "Forbidden" },
          { status: 403 }
        );
      }

      const hasVoted = await Vote.exists({
        complaintId: complaint._id,
        jurorId: user.userId,
      });

      return NextResponse.json(
        {
          ...summary,
          hasVoted: Boolean(hasVoted),
        },
        { status: 200 }
      );
    }

    // -----------------------------
    // Complainant / Opposite Party
    // -----------------------------
    const isComplainant =
      complaint.complainantId.toString() === user.userId;

    const isOppositeParty =
      complaint.oppositeParty?.userId?.toString() === user.userId;

    if (!isComplainant && !isOppositeParty) {
      return NextResponse.json(
        { message: "Forbidden" },
        { status: 403 }
      );
    }

    return NextResponse.json(summary, { status: 200 });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { message: "Failed to fetch votes" },
      { status: 500 }
    );
  }
}