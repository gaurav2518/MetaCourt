import { NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";
import { requireAuth } from "@/middleware/auth";
import { requireRole } from "@/middleware/roleGuard";

import Complaint from "@/models/Complaint";

import { ROLES } from "@/constants";

export async function GET(req: Request) {
  try {
    await connectDB();

    const admin = await requireAuth();
    requireRole(admin, [ROLES.ADMIN]);

    const { searchParams } = new URL(req.url);
    const jurorId = searchParams.get("jurorId");

    if (!jurorId) {
      return NextResponse.json(
        { message: "jurorId query parameter is required" },
        { status: 400 }
      );
    }

    const cases = await Complaint.find({ assignedJurors: jurorId })
      .sort({ createdAt: -1 })
      .select("caseId title status category decision votingDeadline createdAt")
      .lean();

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
