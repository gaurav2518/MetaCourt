import mongoose, { Document } from "mongoose";

export interface IVote extends Document {
    complaintId: mongoose.Types.ObjectId;
    jurorId: mongoose.Types.ObjectId;
    vote: "valid" | "invalid" | "needs_evidence";
    blockchainTxHash?: string;
    isAnonymous: boolean;
    createdAt: Date;
    updatedAt: Date;

}