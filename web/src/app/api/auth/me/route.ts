import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { requireAuth } from "@/middleware/auth";

export async function GET(req: Request) {
  try {
    await connectDB();
    const authUser = await requireAuth(req);

    const user = await User.findById(authUser.userId).select("-passwordHash");

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    return NextResponse.json({ user });
  } catch (error: any) {
    console.error("GET /api/auth/me error:", error);
    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      {
        message: "Failed to fetch user",
        error: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    await connectDB();
    const authUser = await requireAuth(req);

    const body = await req.json().catch(() => ({}));
    const { name } = body;

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json(
        { message: "Name must be at least 2 characters long" },
        { status: 400 }
      );
    }

    const updatedUser = await User.findByIdAndUpdate(
      authUser.userId,
      { name: name.trim() },
      { new: true }
    ).select("-passwordHash");

    if (!updatedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      user: updatedUser,
      message: "Profile updated successfully",
    });
  } catch (error: any) {
    console.error("PATCH /api/auth/me error:", error);
    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      {
        message: "Failed to update profile",
        error: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
