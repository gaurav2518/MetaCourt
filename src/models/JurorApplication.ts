import mongoose, { Schema, Document } from "mongoose";
import { IJurorApplication } from "../types/jurorApplication";

const JurorApplicationSchema = new Schema<IJurorApplication>({
    userId:      { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },

    reason:      { type: String, required: true, maxlength: 1000 },

    experience:  { type: String },  

    status:      { type: String, enum: ["pending","approved","rejected"], default: "pending" },

    reviewedBy:  { type: Schema.Types.ObjectId, ref: "User", default: null },

    reviewNote:  { type: String, default: null },

    reviewedAt:  { type: Date, default: null },

}, { timestamps: true });

export default mongoose.models.JurorApplication || mongoose.model<IJurorApplication>("JurorApplication", JurorApplicationSchema);