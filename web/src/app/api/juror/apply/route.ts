import { NextResponse } from "next/server";
import { z } from "zod";

import connectDB from "@/lib/mongodb";
import { requireAuth } from "@/middleware/auth";

import User from "@/models/User";
import JurorApplication from "@/models/JurorApplication";

import { ROLES, STATUS } from "@/constants";

const applicationSchema = z.object({
  reason: z
    .string()
    .min(20, "Reason must be at least 20 characters")
    .max(1000),

  experience: z
    .string()
    .max(2000)
    .optional()
    .or(z.literal("")),
});

export async function GET(req: Request) {
  try {
    await connectDB();
    const authUser = await requireAuth(req);

    const application = await JurorApplication.findOne({
      userId: authUser.userId,
    })
      .sort({ createdAt: -1 })
      .lean();

    const user = await User.findById(authUser.userId)
      .select("role isVerifiedJuror jurorLevel reputationScore")
      .lean();

    return NextResponse.json(
      {
        application: application || null,
        isVerifiedJuror: Boolean(user?.isVerifiedJuror),
        role: user?.role,
        jurorLevel: user?.jurorLevel,
        reputationScore: user?.reputationScore,
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { message: "Failed to fetch juror application status" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    await connectDB();
    const authUser = await requireAuth(req);

    const body = await req.json();
    const data = applicationSchema.parse(body);

    const application = await JurorApplication.findOne({
      userId: authUser.userId,
      status: STATUS.PENDING,
    });

    if (!application) {
      return NextResponse.json(
        { message: "No pending juror application found to update" },
        { status: 404 }
      );
    }

    application.reason = data.reason;
    if (data.experience !== undefined) {
      application.experience = data.experience;
    }

    await application.save();

    return NextResponse.json(
      {
        message: "Juror application updated successfully",
        application,
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

    return NextResponse.json(
      { message: "Failed to update juror application" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const authUser = await requireAuth(req);

    const body = await req.json();
    const data = applicationSchema.parse(body);

    const user = await User.findById(authUser.userId);

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    if (user.role !== ROLES.USER) {
      return NextResponse.json(
        {
          message: "Only users can apply to become jurors",
        },
        { status: 403 }
      );
    }

    if (user.isVerifiedJuror) {
      return NextResponse.json(
        {
          message: "You are already a verified juror",
        },
        { status: 409 }
      );
    }

    const existingPending = await JurorApplication.findOne({
      userId: user._id,
      status: STATUS.PENDING,
    });

    if (existingPending) {
      return NextResponse.json(
        {
          message: "You already have a pending application under review",
        },
        { status: 409 }
      );
    }

    // Re-use existing document if previously rejected to preserve unique userId constraint
    let application = await JurorApplication.findOne({ userId: user._id });
    if (application) {
      application.reason = data.reason;
      application.experience = data.experience || "";
      application.status = STATUS.PENDING;
      application.reviewNote = null;
      application.reviewedBy = null;
      application.reviewedAt = null;
      await application.save();
    } else {
      application = await JurorApplication.create({
        userId: user._id,
        reason: data.reason,
        experience: data.experience || "",
        status: STATUS.PENDING,
      });
    }

    return NextResponse.json(
      {
        message: "Juror application submitted successfully",
        application,
      },
      { status: 201 }
    );
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
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { message: "Failed to submit juror application" },
      { status: 500 }
    );
  }
}