import { NextResponse } from "next/server";

import connectDB from "@/lib/mongodb";
import { requireAuth } from "@/middleware/auth";
import { requireRole } from "@/middleware/roleGuard";

import JurorApplication from "@/models/JurorApplication";

import { ROLES } from "@/constants";

export async function GET(req: Request) {
  try {
    await connectDB();

    const user = await requireAuth();
    requireRole(user, [ROLES.ADMIN]);

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    const filter: Record<string, string> = {};

    if (status) {
      filter.status = status;
    }

    const applications = await JurorApplication.find(filter)
      .sort({ createdAt: -1 })
      .populate("userId", "name email role reputationScore isVerifiedJuror jurorLevel")
      .populate("reviewedBy", "name email")
      .lean();

    return NextResponse.json({ applications }, { status: 200 });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (error instanceof Error && error.message === "FORBIDDEN") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(
      { message: "Failed to fetch juror applications" },
      { status: 500 }
    );
  }
}