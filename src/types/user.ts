import { Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: "complainant" | "opposite_party" | "juror" | "admin";
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