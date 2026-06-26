import { NextResponse } from "next/server";
import { z } from "zod";

import connectDB from "@/lib/mongodb";
import { requireAuth } from "@/middleware/auth";
import { requireRole } from "@/middleware/roleGuard";

import User from "@/models/User";
import JurorApplication from "@/models/JurorApplication";

import { ROLES } from "@/constants";

const verifySchema = z.object({
  action: z.enum(["approve", "reject"]),
  note: z.string().max(1000).optional(),
});

export async function POST(
  req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    await connectDB();

    const admin = await requireAuth();
    requireRole(admin, [ROLES.ADMIN]);

    const { userId } = await params;

    const body = await req.json();
    const { action, note } = verifySchema.parse(body);

    const application = await JurorApplication.findOne({
      userId,
      status: "pending",
    });

    if (!application) {
      return NextResponse.json(
        { message: "Pending juror application not found" },
        { status: 404 }
      );
    }

    if (action === "approve") {
      await User.findByIdAndUpdate(userId, {
        role: ROLES.JUROR,
        isVerifiedJuror: true,
        jurorLevel: "junior",
      });

      application.status = "approved";
      application.reviewedBy = admin.userId;
      application.reviewNote = note || "Approved";
      application.reviewedAt = new Date();
    }

    if (action === "reject") {
      application.status = "rejected";
      application.reviewedBy = admin.userId;
      application.reviewNote = note || "Rejected";
      application.reviewedAt = new Date();
    }

    await application.save();

    const updatedApplication = await JurorApplication.findById(application._id)
      .populate("userId", "name email role reputationScore isVerifiedJuror jurorLevel")
      .populate("reviewedBy", "name email")
      .lean();

    return NextResponse.json(
      {
        message:
          action === "approve"
            ? "Juror application approved"
            : "Juror application rejected",
        application: updatedApplication,
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Validation failed", errors: error.flatten().fieldErrors },
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
      { message: "Failed to verify juror application" },
      { status: 500 }
    );
  }
}