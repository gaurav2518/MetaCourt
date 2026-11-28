import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { requireAuth } from "@/middleware/auth";
import Complaint from "@/models/Complaint";
import User from "@/models/User";
import Vote from "@/models/Vote";

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function GET(req: Request) {
  try {
    await connectDB();

    const user = await requireAuth(req);
    const userId = user.userId;

    const dbUser = await User.findById(userId).select("email").lean();
    if (!dbUser?.email) {
      return NextResponse.json(
        { notifications: [], unreadCount: 0, pendingDefenseCount: 0 },
        { status: 200 }
      );
    }

    const emailRegex = new RegExp(`^${escapeRegex(dbUser.email)}$`, "i");

    // Automatically link any complaints matching user email to this user's ID
    await Complaint.updateMany(
      {
        "oppositeParty.email": emailRegex,
        $or: [
          { "oppositeParty.userId": null },
          { "oppositeParty.userId": { $exists: false } },
        ],
      },
      {
        $set: {
          "oppositeParty.userId": userId,
        },
      }
    );

    // 1. Fetch complaints where this user is the opposite party
    const complaints = await Complaint.find({
      $or: [
        { "oppositeParty.userId": userId },
        { "oppositeParty.email": emailRegex },
      ],
    })
      .sort({ createdAt: -1 })
      .select("caseId title category status defenseStatement createdAt votingDeadline")
      .lean();

    const respondentNotifs = complaints.map((item: any) => {
      const needsResponse =
        !item.defenseStatement &&
        ["pending", "under_review", "voting"].includes(item.status);

      return {
        id: `notif-resp-${item.caseId}`,
        caseId: item.caseId,
        title: item.title,
        category: item.category,
        status: item.status,
        type: "opposite_party",
        hasResponded: Boolean(item.defenseStatement),
        needsResponse,
        createdAt: item.createdAt,
        votingDeadline: item.votingDeadline,
        message: needsResponse
          ? "Dispute filed against you. Your defense statement is required."
          : `Dispute status: ${item.status.replace("_", " ")}`,
        actionUrl: `/opposite-party/cases/${item.caseId}`,
      };
    });

    // 2. Fetch active deliberation cases where user is an assigned juror
    let jurorNotifs: any[] = [];
    let pendingJurorVotesCount = 0;

    const assignedCases = await Complaint.find({
      assignedJurors: userId,
      status: "voting",
    })
      .sort({ votingDeadline: 1 })
      .select("caseId title category status createdAt votingDeadline")
      .lean();

    if (assignedCases.length > 0) {
      const caseIds = assignedCases.map((c) => c._id);
      const castVotes = await Vote.find({
        jurorId: userId,
        complaintId: { $in: caseIds },
      })
        .select("complaintId")
        .lean();

      const votedCaseIds = new Set(castVotes.map((v) => v.complaintId.toString()));

      jurorNotifs = assignedCases.map((item: any) => {
        const hasVoted = votedCaseIds.has(item._id.toString());
        return {
          id: `notif-juror-${item.caseId}`,
          caseId: item.caseId,
          title: item.title,
          category: item.category,
          status: item.status,
          type: "juror_vote",
          hasResponded: hasVoted,
          needsResponse: !hasVoted,
          createdAt: item.createdAt,
          votingDeadline: item.votingDeadline,
          message: !hasVoted
            ? "Active Jury Deliberation: Case waiting for your anonymous ballot."
            : "Your anonymous juror ballot has been sealed.",
          actionUrl: `/juror/cases/${item.caseId}`,
        };
      });

      pendingJurorVotesCount = jurorNotifs.filter((n) => n.needsResponse).length;
    }

    const allNotifications = [...jurorNotifs.filter((n) => n.needsResponse), ...respondentNotifs];
    const pendingDefenseCount = respondentNotifs.filter((n: any) => n.needsResponse).length;
    const totalUnread = pendingDefenseCount + pendingJurorVotesCount;

    return NextResponse.json(
      {
        notifications: allNotifications,
        unreadCount: totalUnread,
        pendingDefenseCount,
        pendingJurorVotesCount,
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      { message: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}
