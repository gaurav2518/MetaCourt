import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { comparePassword, signToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    if(!email || !password) {
      return NextResponse.json({ message: "Email and password are required" }, { status: 400 });
    }
    const user = await User.findOne({email});

    if(!user) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
    }

    const isMatch = await comparePassword(password, user.passwordHash);
    if(!isMatch) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
    }

    if(user.isBanned) {
      return NextResponse.json({ message: "Your account has been banned. Please contact support." }, { status: 403 });
    }

    const token = signToken({
      userId: user._id.toString(),
      role: user.role,
    })

    const response = NextResponse.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  }catch(error) {
    return NextResponse.json({ message: "Login failed" }, { status: 500 });
  }
}