import { NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";
import { requireAuth } from "@/middleware/auth";
import { requireRole } from "@/middleware/roleGuard";

import Vote from "@/models/Vote";

import { ROLES, STATUS } from "@/constants";

export async function GET() {
  try {
    await connectDB();

    const user = await requireAuth();
    requireRole(user, [ROLES.JUROR]);

    const votes = await Vote.find({ jurorId: user.userId })
      .sort({ createdAt: -1 })
      .populate("complaintId", "caseId category decision status decidedAt title")
      .lean();

    const history = votes.map((vote: any) => {
      const complaint = vote.complaintId;
      const isDecided = complaint?.status === STATUS.DECIDED;
      const finalDecision = complaint?.decision ?? "pending";
      const matchedDecision = isDecided && vote.vote === finalDecision;

      return {
        _id: vote._id?.toString(),
        caseId: complaint?.caseId ?? "Unknown",
        category: complaint?.category ?? "unknown",
        title: complaint?.title ?? "Unknown case",
        vote: vote.vote,
        finalDecision,
        reputationChange: isDecided ? (matchedDecision ? 5 : -3) : 0,
        txHash: vote.blockchainTxHash,
        createdAt: vote.createdAt,
      };
    });

    return NextResponse.json({ votes: history }, { status: 200 });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(
      { message: "Failed to fetch juror voting history" },
      { status: 500 }
    );
  }
}
