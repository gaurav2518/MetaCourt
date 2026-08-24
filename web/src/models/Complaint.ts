import mongoose, { Schema, Document } from "mongoose";
import { IComplaint } from "../types/complaint";

const ComplaintSchema = new Schema<IComplaint>({
  caseId:        { type: String, required: true, unique: true }, // MC-2024-0001
  title:         { type: String, required: true, maxlength: 200 },
  description:   { type: String, required: true, maxlength: 5000 },
  category:      { type: String, enum: ["consumer","employment","service","government","academic","other"], required: true },
  status:        { type: String, enum: ["pending","under_review","voting","decided","closed","appealed","rejected"], default: "pending" },

  // Parties
  complainantId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  oppositeParty: {
    name:         String,
    email:        String,
    organization: String,
    description:  String,
    userId:       { type: Schema.Types.ObjectId, ref: "User" }, // if registered
  },

  // Evidence and response
  evidence:      [{ type: Schema.Types.ObjectId, ref: "Evidence" }],
  defenseStatement: { type: String, default: null },
  defenseEvidence:  [{ type: Schema.Types.ObjectId, ref: "Evidence" }],

  // Jurors
  assignedJurors: [{ type: Schema.Types.ObjectId, ref: "User" }],
  jurorCount:     { type: Number, default: 3 },  // 3 or 5
  votingDeadline: { type: Date, default: null },

  // Blockchain
  complaintHash:   { type: String, default: null }, // SHA-256 hash
  blockchainTxHash:{ type: String, default: null }, // Ethereum tx hash

  // Decision
  decision:       { type: String, enum: ["valid","invalid","needs_evidence","pending","tied"], default: "pending" },
  decisionTxHash: { type: String, default: null }, // On-chain decision tx
  decidedAt:      { type: Date, default: null },

  // Priority
  priority:       { type: String, enum: ["low","medium","high"], default: "medium" },

}, { timestamps: true });

export default mongoose.models.Complaint || mongoose.model<IComplaint>("Complaint", ComplaintSchema);