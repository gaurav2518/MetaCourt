import { NextResponse } from "next/server";
import { z } from "zod";

import connectDB from "@/lib/mongodb";
import { requireAuth } from "@/middleware/auth";
import { requireRole } from "@/middleware/roleGuard";
import { getContract } from "@/lib/web3";

import Complaint from "@/models/Complaint";
import Vote from "@/models/Vote";
import User from "@/models/User";

import { ROLES, STATUS, VOTE_TYPES } from "@/constants";

const voteSchema = z.object({
  caseId: z.string().min(1, "Case ID is required"),
  vote: z.enum([VOTE_TYPES.INVALID, VOTE_TYPES.VALID, VOTE_TYPES.NEEDS_EVIDENCE]),
});

export async function POST(req: Request) {
  let savedVote: any = null;

  try {
    await connectDB();

    const authUser = await requireAuth();
    requireRole(authUser, [ROLES.JUROR]);

    const body = await req.json();
    const { caseId, vote } = voteSchema.parse(body);

    const juror = await User.findById(authUser.userId);

    if (!juror) {
      return NextResponse.json({ message: "Juror not found" }, { status: 404 });
    }

    if (!juror.isVerifiedJuror || juror.role !== ROLES.JUROR) {
      return NextResponse.json(
        { message: "Only verified jurors can vote" },
        { status: 403 }
      );
    }

    const complaint = await Complaint.findOne({ caseId });

    if (!complaint) {
      return NextResponse.json(
        { message: "Complaint not found" },
        { status: 404 }
      );
    }

    if (complaint.status !== STATUS.VOTING) {
      return NextResponse.json(
        { message: "Complaint is not currently in voting status" },
        { status: 400 }
      );
    }

    if (
      complaint.votingDeadline &&
      new Date() > new Date(complaint.votingDeadline)
    ) {
      return NextResponse.json(
        { message: "Voting deadline has passed" },
        { status: 400 }
      );
    }

    const isAssignedJuror = complaint.assignedJurors.some(
      (jurorId: unknown) => String(jurorId) === authUser.userId
    );

    if (!isAssignedJuror) {
      return NextResponse.json(
        { message: "You are not assigned as juror for this case" },
        { status: 403 }
      );
    }

    const existingVote = await Vote.findOne({
      complaintId: complaint._id,
      jurorId: authUser.userId,
    });

    if (existingVote) {
      return NextResponse.json(
        { message: "You have already voted on this case" },
        { status: 409 }
      );
    }

    const reputation = juror.reputationScore ?? 0;
    const weight = reputation >= 150 ? 2 : 1;

    savedVote = await Vote.create({
      complaintId: complaint._id,
      jurorId: authUser.userId,
      vote,
      blockchainTxHash: null,
      isAnonymous: true,
    });

    try {
      const contract = getContract();
      let finalTxHash = "";

      for (let i = 0; i < weight; i++) {
        const tx = await contract.castVote(caseId, vote);
        await tx.wait();
        finalTxHash = tx.hash;
      }

      savedVote.blockchainTxHash = finalTxHash;
      await savedVote.save();

      return NextResponse.json(
        {
          success: true,
          message: "Vote cast successfully",
          txHash: finalTxHash,
          weight,
        },
        { status: 201 }
      );
    } catch (blockchainError) {
      console.error("Blockchain vote failed:", blockchainError);

      return NextResponse.json(
        {
          success: false,
          message:
            "Vote saved in database, but blockchain vote failed. Admin can retry.",
          vote: savedVote,
        },
        { status: 202 }
      );
    }
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
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(
      { message: "Failed to cast vote" },
      { status: 500 }
    );
  }
}