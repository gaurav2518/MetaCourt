import mongoose, { Document } from "mongoose";

export interface IJurorApplication extends Document {
    userId: mongoose.Types.ObjectId;
    reason: string;       
    experience?: string;  
    status: "pending" | "approved" | "rejected";
    reviewedBy?: mongoose.Types.ObjectId;  
    reviewNote?: string;   
    reviewedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}