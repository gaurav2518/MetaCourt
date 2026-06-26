import { NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";
import { requireAuth } from "@/middleware/auth";
import { requireRole } from "@/middleware/roleGuard";
import { getContract } from "@/lib/web3";

import Complaint from "@/models/Complaint";
import Vote from "@/models/Vote";
import User from "@/models/User";

import { ROLES, STATUS, JUROR_LEVELS } from "@/constants";

function getJurorLevel(score: number) {
  if (score < 150) return JUROR_LEVELS.JUNIOR;
  if (score < 200) return JUROR_LEVELS.SENIOR;
  return JUROR_LEVELS.MASTER;
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ caseId: string }> }
) {
  try {
    await connectDB();

    const admin = await requireAuth();
    requireRole(admin, [ROLES.ADMIN]);

    const { caseId } = await params;

    const complaint = await Complaint.findOne({ caseId });

    if (!complaint) {
      return NextResponse.json(
        { message: "Complaint not found" },
        { status: 404 }
      );
    }

    if (complaint.status === STATUS.DECIDED) {
      return NextResponse.json(
        { message: "Complaint is already decided" },
        { status: 409 }
      );
    }

    if (!complaint.assignedJurors || complaint.assignedJurors.length === 0) {
      return NextResponse.json(
        { message: "No jurors assigned to this complaint" },
        { status: 400 }
      );
    }

    const votes = await Vote.find({
      complaintId: complaint._id,
    });

    const votedJurorIds = new Set(
      votes.map((vote) => vote.jurorId.toString())
    );

    const allJurorsVoted = complaint.assignedJurors.every((jurorId: any) =>
      votedJurorIds.has(jurorId.toString())
    );

    const deadlinePassed =
      complaint.votingDeadline &&
      new Date() > new Date(complaint.votingDeadline);

    if (!allJurorsVoted && !deadlinePassed) {
      return NextResponse.json(
        {
          message:
            "Cannot finalize yet. Either all jurors must vote or the voting deadline must pass.",
        },
        { status: 400 }
      );
    }

    const contract = getContract();

    const tx = await contract.finalizeDecision(caseId);
    await tx.wait();

    const blockchainCase = await contract.getCase(caseId);

    const finalDecision = blockchainCase.decision;

    complaint.decision = finalDecision;
    complaint.decisionTxHash = tx.hash;
    complaint.decidedAt = new Date();
    complaint.status = STATUS.DECIDED;

    await complaint.save();

    for (const jurorId of complaint.assignedJurors) {
      const jurorIdString = jurorId.toString();

      const jurorVote = votes.find(
        (vote) => vote.jurorId.toString() === jurorIdString
      );

      const juror = await User.findById(jurorIdString);

      if (!juror) continue;

      let newScore = juror.reputationScore ?? 100;

      if (jurorVote) {
        juror.totalVotes = (juror.totalVotes ?? 0) + 1;

        if (jurorVote.vote === finalDecision) {
          newScore += 2;
          juror.correctVotes = (juror.correctVotes ?? 0) + 1;
        } else {
          newScore -= 1;
        }
      } else {
        newScore -= 5;
      }

      if (newScore < 0) newScore = 0;
      if (newScore > 250) newScore = 250;

      juror.reputationScore = newScore;
      juror.jurorLevel = getJurorLevel(newScore);

      await juror.save();
    }

    return NextResponse.json(
      {
        success: true,
        message: "Complaint finalized successfully",
        decision: finalDecision,
        txHash: tx.hash,
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(
      { message: "Failed to finalize complaint" },
      { status: 500 }
    );
  }
}