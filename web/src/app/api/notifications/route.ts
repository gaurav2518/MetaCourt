import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { requireAuth } from "@/middleware/auth";
import Complaint from "@/models/Complaint";
import User from "@/models/User";

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

    // Fetch complaints where this user is the opposite party
    const complaints = await Complaint.find({
      $or: [
        { "oppositeParty.userId": userId },
        { "oppositeParty.email": emailRegex },
      ],
    })
      .sort({ createdAt: -1 })
      .select("caseId title category status defenseStatement createdAt votingDeadline")
      .lean();

    const notifications = complaints.map((item: any) => {
      const needsResponse =
        !item.defenseStatement &&
        ["pending", "under_review", "voting"].includes(item.status);

      return {
        id: `notif-${item.caseId}`,
        caseId: item.caseId,
        title: item.title,
        category: item.category,
        status: item.status,
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

    const pendingDefenseCount = notifications.filter((n: any) => n.needsResponse).length;

    return NextResponse.json(
      {
        notifications,
        unreadCount: pendingDefenseCount,
        pendingDefenseCount,
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
