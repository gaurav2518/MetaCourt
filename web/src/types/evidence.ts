import mongoose, { Document } from "mongoose";

export interface IEvidence extends Document {
    complaintId: mongoose.Types.ObjectId;
    uploadedBy: mongoose.Types.ObjectId;
    uploadedByRole: "complainant" | "opposite_party";
    fileUrl: string;
    publicId: string;
    fileType: "image" | "pdf" | "document" | "video";
    fileName: string;
    fileSize: number;     // bytes
    ipfsHash?: string;   
    createdAt: Date;
    updatedAt: Date;
}
