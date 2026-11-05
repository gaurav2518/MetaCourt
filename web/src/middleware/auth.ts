import { cookies, headers } from "next/headers";
import { verifyToken, TokenPayload } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export interface AuthenticatedUser extends TokenPayload {
  id: string;
  name: string;
  email: string;
  isBanned: boolean;
  walletAddress?: string | null;
  reputationScore: number;
  isVerifiedJuror: boolean;
  jurorLevel: "junior" | "senior" | "master";
  totalVotes: number;
  correctVotes: number;
}

export async function requireAuth(req?: Request): Promise<AuthenticatedUser> {
  let token: string | undefined;

  // 1. Check cookies (standard Web browser flow)
  try {
    const cookieStore = await cookies();
    token = cookieStore.get("token")?.value;
  } catch {
    // cookieStore may not be available in some contexts
  }

  // 2. Check Authorization header via next/headers (Mobile / API flow)
  if (!token) {
    try {
      const headerStore = await headers();
      const authHeader = headerStore.get("authorization");
      if (authHeader?.startsWith("Bearer ")) {
        token = authHeader.substring(7).trim();
      }
    } catch {
      // headerStore may not be available
    }
  }

  // 3. Check direct Request object if passed
  if (!token && req) {
    const authHeader = req.headers.get("authorization");
    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.substring(7).trim();
    }
  }

  if (!token) {
    throw new Error("UNAUTHORIZED");
  }

  let payload: TokenPayload;

  try {
    payload = verifyToken(token);
  } catch (err) {
    throw new Error("UNAUTHORIZED");
  }

  try {
    await connectDB();

    const user = await User.findById(payload.userId)
      .select(
        "name email role isBanned walletAddress reputationScore isVerifiedJuror jurorLevel totalVotes correctVotes"
      )
      .lean();

    if (!user || user.isBanned === true) {
      throw new Error("UNAUTHORIZED");
    }

    const userId = user._id.toString();

    return {
      userId,
      id: userId,
      name: user.name,
      email: user.email,
      role: user.role,
      isBanned: user.isBanned,
      walletAddress: user.walletAddress,
      reputationScore: user.reputationScore,
      isVerifiedJuror: user.isVerifiedJuror,
      jurorLevel: user.jurorLevel,
      totalVotes: user.totalVotes,
      correctVotes: user.correctVotes,
    };
  } catch (err: any) {
    if (err.message === "UNAUTHORIZED") {
      throw err;
    }
    console.error("[requireAuth] Error verifying user from database:", err);
    throw err;
  }
}
