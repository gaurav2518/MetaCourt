import type { AuthenticatedUser } from "./auth";

export function requireRole(
	user: AuthenticatedUser,
	allowedRoles: string[]
): AuthenticatedUser {
	if (!allowedRoles.includes(user.role)) {
		throw new Error("FORBIDDEN");
	}

	return user;
}
