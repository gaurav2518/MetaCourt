import { cookies } from "next/headers";
import { verifyToken, TokenPayload } from "@/lib/auth";

export interface AuthenticatedUser extends TokenPayload {}

export async function requireAuth(): Promise<AuthenticatedUser> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    throw new Error("UNAUTHORIZED");
  }

  try {
    return verifyToken(token) as AuthenticatedUser;
  } catch {
    throw new Error("UNAUTHORIZED");
  }
}