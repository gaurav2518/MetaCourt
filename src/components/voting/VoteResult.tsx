"use client";
import { DECISIONS } from "@/constants";

type VoteResultProps = {
  decision: (typeof DECISIONS)[keyof typeof DECISIONS];
  valid: number;
  invalid: number;
  needsEvidence: number;
  txHash?: string | null;
};

const DECISION_STYLES = {
  [DECISIONS.VALID]: "bg-green-100 text-green-700",
  [DECISIONS.INVALID]: "bg-red-100 text-red-700",
  [DECISIONS.NEEDS_EVIDENCE]: "bg-yellow-100 text-yellow-700",
  [DECISIONS.TIED]: "bg-slate-100 text-slate-700",
  [DECISIONS.PENDING]: "bg-slate-100 text-slate-700",
};

export default function VoteResult({
  decision,
  valid,
  invalid,
  needsEvidence,
  txHash,
}: VoteResultProps) {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <p className="text-sm text-slate-500">Final Decision</p>

      <div
        className={`mt-3 inline-flex rounded-full px-4 py-2 text-lg font-bold capitalize ${
          DECISION_STYLES[decision]
        }`}
      >
        {decision.replace("_", " ")}
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-3">
        <div className="rounded-xl bg-green-50 p-4 text-green-700">
          Valid: {valid}
        </div>

        <div className="rounded-xl bg-red-50 p-4 text-red-700">
          Invalid: {invalid}
        </div>

        <div className="rounded-xl bg-yellow-50 p-4 text-yellow-700">
          Needs Evidence: {needsEvidence}
        </div>
      </div>

      {txHash && (
        <a
          href={`https://sepolia.etherscan.io/tx/${txHash}`}
          target="_blank"
          rel="noreferrer"
          className="mt-5 block break-all font-mono text-xs text-cyan-700 underline"
        >
          {txHash}
        </a>
      )}
    </div>
  );
}