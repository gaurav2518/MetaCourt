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

export async function POST(req: Request) {
  try {
    await connectDB();

    const authUser = await requireAuth();

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

    const existingApplication = await JurorApplication.findOne({
      userId: user._id,
      status: STATUS.PENDING,
    });

    if (existingApplication) {
      return NextResponse.json(
        {
          message: "You already have a pending application",
        },
        { status: 409 }
      );
    }

    const application = await JurorApplication.create({
      userId: user._id,
      reason: data.reason,
      experience: data.experience || "",
      status: STATUS.PENDING,
    });

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