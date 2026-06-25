import { NextResponse } from "next/server";

import { getContract } from "@/lib/web3";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const caseId = searchParams.get("caseId");

    if (!caseId) {
      return NextResponse.json(
        { message: "caseId query parameter is required" },
        { status: 400 }
      );
    }

    const contract = getContract();
    const blockchainCase = await contract.getCase(caseId);

    return NextResponse.json(
      {
        caseId: blockchainCase.caseId,
        storedHash: blockchainCase.complaintHash,
        validVotes: Number(blockchainCase.validVotes),
        invalidVotes: Number(blockchainCase.invalidVotes),
        needsEvidenceVotes: Number(blockchainCase.needsEvidenceVotes),
        isDecided: blockchainCase.isDecided,
        decision: blockchainCase.decision,
        filedAt: Number(blockchainCase.filedAt),
        decidedAt: Number(blockchainCase.decidedAt),
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to verify case on blockchain" },
      { status: 500 }
    );
  }
}