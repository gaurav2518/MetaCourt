import {NextResponse} from "next/server";
import {z} from "zod";

import { requireAuth } from "@/middleware/auth";
import { ROLES } from "@/constants";
import { getContract } from "@/lib/web3";

const storeHashSchema = z.object({
  caseId: z.string().min(1, "Case ID is required"),
  complaintHash: z.string().min(1, "Complaint hash is required"),
});

export async function POST(req: Request) {
  try {
    const user = await requireAuth();

    if (user.role !== ROLES.ADMIN) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { caseId, complaintHash } = storeHashSchema.parse(body);

    const contract = getContract();

    const tx = await contract.fileCase(caseId, complaintHash);
    await tx.wait();

    return NextResponse.json(
      {
        message: "Complaint hash stored on blockchain",
        txHash: tx.hash,
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