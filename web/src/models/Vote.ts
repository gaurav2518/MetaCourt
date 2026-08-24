import mongoose, { Schema, Document } from "mongoose";
import { IVote } from "../types/vote";

const VoteSchema = new Schema<IVote>({

  complaintId:     { type: Schema.Types.ObjectId, ref: "Complaint", required: true },

  jurorId:         { type: Schema.Types.ObjectId, ref: "User", required: true },

  vote:            { type: String, enum: ["valid","invalid","needs_evidence"], required: true },

  blockchainTxHash:{ type: String, default: null },

  isAnonymous:     { type: Boolean, default: true },

}, { timestamps: true });

VoteSchema.index({ complaintId: 1, jurorId: 1 }, { unique: true });

export default mongoose.models.Vote || mongoose.model<IVote>("Vote", VoteSchema);