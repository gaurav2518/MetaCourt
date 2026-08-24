import { createHash } from "crypto";

type ComplaintHashInput = {
  caseId: string;
  title: string;
  description: string;
  category: string;
  complainantId: unknown;
  createdAt: Date | string;
};

export function generateComplaintHash(complaint: ComplaintHashInput) {
  const deterministicPayload = {
    caseId: complaint.caseId,
    title: complaint.title,
    description: complaint.description,
    category: complaint.category,
    complainantId: String(complaint.complainantId),
    createdAt:
      complaint.createdAt instanceof Date
        ? complaint.createdAt.toISOString()
        : new Date(complaint.createdAt).toISOString(),
  };

  return createHash("sha256")
    .update(JSON.stringify(deterministicPayload))
    .digest("hex");
}