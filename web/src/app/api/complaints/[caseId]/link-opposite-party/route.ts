import { NextResponse } from "next/server";
import User from "@/models/User";

import connectDB from "@/lib/mongodb";
import { requireAuth } from "@/middleware/auth";

import Complaint from "@/models/Complaint";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ caseId: string }> }
) {
  try {
    await connectDB();

    const user = await requireAuth();

    const dbUser = await User.findById(user.userId);
    if(!dbUser) {
        return NextResponse.json(
            {message: "User not found"},
            {status: 404}
        );
    }

    const { caseId } = await params;

    const complaint = await Complaint.findOne({ caseId });

    if (!complaint) {
      return NextResponse.json(
        { message: "Complaint not found" },
        { status: 404 }
      );
    }

    if (complaint.oppositeParty.userId) {
      return NextResponse.json(
        { message: "Opposite party is already linked" },
        { status: 409 }
      );
    }

    if (
      complaint.oppositeParty.email.toLowerCase() !==
      dbUser.email.toLowerCase()
    ) {
      return NextResponse.json(
        {
          message:
            "Your account email does not match the opposite party email.",
        },
        { status: 403 }
      );
    }

    complaint.oppositeParty.userId = user.userId;

    await complaint.save();

    return NextResponse.json(
      {
        message: "Opposite party linked successfully.",
        complaint,
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
      {
        message: "Failed to link opposite party.",
      },
      { status: 500 }
    );
  }
}