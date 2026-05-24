import mongoose, { Document } from "mongoose";


export interface IComplaint extends Document {
  caseId: string;
  title: string;
  description: string;

  category:
    | "consumer"
    | "employment"
    | "service"
    | "government"
    | "academic"
    | "other";

  status:
    | "pending"
    | "under_review"
    | "voting"
    | "decided"
    | "closed"
    | "appealed"
    | "rejected";

  complainantId: mongoose.Types.ObjectId;

  oppositeParty: {
    name: string;
    email: string;
    organization: string;
    description: string;
    userId?: mongoose.Types.ObjectId;
  };

  evidence: mongoose.Types.ObjectId[];

  defenseStatement?: string;

  defenseEvidence: mongoose.Types.ObjectId[];

  assignedJurors: mongoose.Types.ObjectId[];

  jurorCount: number;

  votingDeadline?: Date;

  complaintHash?: string;

  blockchainTxHash?: string;

  decision:
    | "valid"
    | "invalid"
    | "needs_evidence"
    | "pending"
    | "tied";

  decisionTxHash?: string;

  decidedAt?: Date;

  priority: "low" | "medium" | "high";

  createdAt: Date;
  updatedAt: Date;
}