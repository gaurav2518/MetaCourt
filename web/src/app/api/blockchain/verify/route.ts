import { NextResponse } from "next/server";
import { getReadOnlyContract } from "@/lib/web3";

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

    const contract = getReadOnlyContract();

    try {
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
    } catch (contractError: any) {
      console.error(`Contract getCase failed for ${caseId}:`, contractError?.message);

      const errorMessage = contractError?.message || "";
      const isNotFound =
        errorMessage.includes("Case does not exist") ||
        contractError?.code === "CALL_EXCEPTION";

      if (isNotFound) {
        return NextResponse.json(
          {
            message: `Case ${caseId} does not exist on the blockchain ledger yet.`,
            exists: false,
          },
          { status: 404 }
        );
      }

      throw contractError;
    }
  } catch (error: any) {
    console.error("GET /api/blockchain/verify error:", error);
    return NextResponse.json(
      {
        message: "Failed to verify case on blockchain",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
