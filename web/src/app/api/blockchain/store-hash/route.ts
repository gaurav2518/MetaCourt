import { NextResponse } from "next/server";
import { z } from "zod";

import connectDB from "@/lib/mongodb";
import { requireAuth } from "@/middleware/auth";
import { ROLES } from "@/constants";
import { getContract } from "@/lib/web3";
import { generateComplaintHash } from "@/lib/hash";
import Complaint from "@/models/Complaint";

const storeHashSchema = z.object({
  caseId: z.string().min(1, "Case ID is required"),
  complaintHash: z.string().min(1, "Complaint hash is required").optional(),
});

export async function POST(req: Request) {
  try {
    await connectDB();

    const user = await requireAuth();

    if (user.role !== ROLES.ADMIN) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { caseId, complaintHash } = storeHashSchema.parse(body);

    const complaint = await Complaint.findOne({ caseId });

    if (!complaint) {
      return NextResponse.json(
        { message: "Complaint not found" },
        { status: 404 }
      );
    }

    if (complaint.blockchainTxHash) {
      return NextResponse.json(
        {
          message: "Complaint hash is already stored on blockchain",
          txHash: complaint.blockchainTxHash,
          complaint,
        },
        { status: 200 }
      );
    }

    const hashToStore =
      complaintHash ||
      complaint.complaintHash ||
      generateComplaintHash({
        caseId: complaint.caseId,
        title: complaint.title,
        description: complaint.description,
        category: complaint.category,
        complainantId: complaint.complainantId,
        createdAt: complaint.createdAt,
      });

    const contract = getContract();

    const tx = await contract.fileCase(caseId, hashToStore);
    await tx.wait();

    complaint.complaintHash = hashToStore;
    complaint.blockchainTxHash = tx.hash;

    await complaint.save();

    return NextResponse.json(
      {
        message: "Complaint hash stored on blockchain",
        txHash: tx.hash,
        complaint,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Validation failed", errors: error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json(
      { message: "Failed to store complaint hash" },
      { status: 500 }
    );
  }
}
