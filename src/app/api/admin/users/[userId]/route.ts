import { NextResponse } from "next/server";
import { z } from "zod";

import connectDB from "@/lib/mongodb";
import { requireAuth } from "@/middleware/auth";
import { requireRole } from "@/middleware/roleGuard";

import User from "@/models/User";

import { ROLES } from "@/constants";

const updateUserSchema = z.object({
  action: z.enum(["ban", "unban", "changeRole"]),
  role: z.enum([ROLES.USER, ROLES.JUROR, ROLES.ADMIN]).optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    await connectDB();

    const admin = await requireAuth();
    requireRole(admin, [ROLES.ADMIN]);

    const { userId } = await params;

    const body = await req.json();
    const { action, role } = updateUserSchema.parse(body);

    const targetUser = await User.findById(userId);

    if (!targetUser) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    if (action === "ban" && targetUser.role === ROLES.ADMIN) {
      return NextResponse.json(
        { message: "You cannot ban another admin" },
        { status: 403 }
      );
    }

    if (
      action === "changeRole" &&
      admin.userId === userId &&
      role !== ROLES.ADMIN
    ) {
      return NextResponse.json(
        { message: "You cannot demote yourself" },
        { status: 403 }
      );
    }

    if (action === "ban") {
      targetUser.isBanned = true;
    }

    if (action === "unban") {
      targetUser.isBanned = false;
    }

    if (action === "changeRole") {
      if (!role) {
        return NextResponse.json(
          { message: "Role is required for changeRole action" },
          { status: 400 }
        );
      }

      targetUser.role = role;
      targetUser.isVerifiedJuror = role === ROLES.JUROR;

      if (role === ROLES.USER) {
        targetUser.isVerifiedJuror = false;
      }
    }

    await targetUser.save();

    const updatedUser = await User.findById(userId)
      .select("-passwordHash")
      .lean();

    return NextResponse.json(
      {
        message: "User updated successfully",
        user: updatedUser,
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
      { message: "Failed to update user" },
      { status: 500 }
    );
  }
}