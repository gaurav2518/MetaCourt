import type { AuthenticatedUser } from "./auth";
import Complaint from "@/models/Complaint";

export function requireRole(
	user: AuthenticatedUser,
	allowedRoles: string[]
): AuthenticatedUser {
	if (!allowedRoles.includes(user.role)) {
		throw new Error("FORBIDDEN");
	}

	return user;
}

export async function checkCaseRelationship(
	caseId: string,
	userId: string
): Promise<"complainant" | "opposite_party" | "juror" | "none"> {
	const complaint = await Complaint.findOne({ caseId }).lean();

	if (!complaint) return "none";

	if (complaint.complainantId?.toString() === userId) return "complainant";

	if (complaint.oppositeParty?.userId?.toString() === userId) return "opposite_party";

	const jurorIds = (complaint.assignedJurors || []).map((id: any) => id?.toString());
	if (jurorIds.includes(userId)) return "juror";

	return "none";
}
