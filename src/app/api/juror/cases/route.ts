import { NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";
import { requireAuth } from "@/middleware/auth";
import { requireRole } from "@/middleware/roleGuard";

import Complaint from "@/models/Complaint";
import Vote from "@/models/Vote";

import { ROLES, STATUS } from "@/constants";

export async function GET() {
  try {
    await connectDB();

    const user = await requireAuth();
    requireRole(user, [ROLES.JUROR]);

    const complaints = await Complaint.find({
      assignedJurors: user.userId,
      status: STATUS.VOTING,
    })
      .sort({ votingDeadline: 1 })
      .populate("complainantId", "name")
      .populate("evidence")
      .lean();

    const complaintIds = complaints.map((complaint) => complaint._id);

    const votes = await Vote.find({
      complaintId: { $in: complaintIds },
      jurorId: user.userId,
    }).lean();

    const votedComplaintIds = new Set(
      votes.map((vote) => vote.complaintId.toString())
    );

    const cases = complaints.map((complaint) => ({
      ...complaint,
      hasVoted: votedComplaintIds.has(complaint._id.toString()),
      deadline: complaint.votingDeadline,
      priority: complaint.priority,
      category: complaint.category,
    }));

    return NextResponse.json({ cases }, { status: 200 });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(
      { message: "Failed to fetch juror cases" },
      { status: 500 }
    );
  }
}