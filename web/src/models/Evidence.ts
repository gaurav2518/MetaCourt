import mongoose, { Schema, Document } from "mongoose";
import { IEvidence } from "../types/evidence";

const EvidenceSchema = new Schema<IEvidence>({
    complaintId:  { type: Schema.Types.ObjectId, ref: "Complaint", required: true },

    uploadedBy:   { type: Schema.Types.ObjectId, ref: "User", required: true },

    uploadedByRole: { type: String, enum: ["complainant","opposite_party"], required:true },

    fileUrl:      { type: String, required: true },  // Cloudinary URL

    publicId:     { type: String, required: true },  // Cloudinary public_id

    fileType:     { type: String, enum: ["image","pdf","document","video"] },

    fileName:     { type: String },

    fileSize:     { type: Number },  // bytes

    ipfsHash:     { type: String, default: null },
}, { timestamps: true });

export default mongoose.models.Evidence || mongoose.model<IEvidence>("Evidence", EvidenceSchema);