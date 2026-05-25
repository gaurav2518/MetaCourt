import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { requireAuth } from "@/middleware/auth";

export async function GET() {
  try {
    await connectDB();
    const authUser = await requireAuth();

    const user = await User.findById(authUser.userId).select("-passwordHash");

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    return NextResponse.json({ user});
  }catch(error: any) {
    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }  
    return NextResponse.json({ message: "Failed to fetch user" }, { status: 500 });
  }
}