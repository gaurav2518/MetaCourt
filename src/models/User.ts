import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "../types/user";

const UserSchema = new Schema<IUser>({
  name:             { type: String, required: true, trim: true },
  email:            { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash:     { type: String, required: true },
  role:             { type: String, enum: ["user","juror","admin"], default: "user" },
  walletAddress:    { type: String, default: null },
  reputationScore:  { type: Number, default: 100, min: 0, max: 200 },
  isVerifiedJuror:  { type: Boolean, default: false },
  jurorLevel:       { type: String, enum: ["junior","senior","master"], default: "junior" },
  totalVotes:       { type: Number, default: 0 },
  correctVotes:     { type: Number, default: 0 },
  isBanned:         { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);