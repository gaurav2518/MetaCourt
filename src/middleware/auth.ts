import { cookies } from "next/headers";
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

export async function requireAuth(): Promise<AuthenticatedUser> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    throw new Error("UNAUTHORIZED");
  }

  let payload: TokenPayload;

  try {
    payload = verifyToken(token);
  } catch {
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
  } catch {
    throw new Error("UNAUTHORIZED");
  }
}
