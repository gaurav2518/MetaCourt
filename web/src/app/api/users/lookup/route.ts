import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { requireAuth } from "@/middleware/auth";
import User from "@/models/User";

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function GET(req: Request) {
  try {
    await connectDB();
    await requireAuth(req);

    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email")?.trim();

    if (!email) {
      return NextResponse.json(
        { message: "Email query parameter is required" },
        { status: 400 }
      );
    }

    const emailRegex = new RegExp(`^${escapeRegex(email)}$`, "i");
    const user = await User.findOne({ email: emailRegex })
      .select("name email role isVerifiedJuror")
      .lean();

    if (!user) {
      return NextResponse.json({ exists: false }, { status: 200 });
    }

    return NextResponse.json(
      {
        exists: true,
        user: {
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      { message: "Failed to lookup user" },
      { status: 500 }
    );
  }
}
