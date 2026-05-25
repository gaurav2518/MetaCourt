import { Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: "user" | "juror" | "admin";
  walletAddress?: string;      
  reputationScore: number;     
  isVerifiedJuror: boolean;
  jurorLevel: "junior" | "senior" | "master";
  totalVotes: number;
  correctVotes: number;
  isBanned: boolean;
  createdAt: Date;
  updatedAt: Date;
}