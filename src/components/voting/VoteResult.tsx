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
  [DECISIONS.VALID]: "bg-[rgba(16,185,129,0.12)] text-[var(--color-success)]",
  [DECISIONS.INVALID]: "bg-[rgba(239,68,68,0.12)] text-[var(--color-danger)]",
  [DECISIONS.NEEDS_EVIDENCE]: "bg-[rgba(245,158,11,0.12)] text-[var(--color-warning)]",
  [DECISIONS.TIED]: "bg-[rgba(124,58,237,0.12)] text-[var(--color-accent-primary)]",
  [DECISIONS.PENDING]: "bg-[rgba(148,163,184,0.12)] text-[var(--color-text-secondary)]",
};

export default function VoteResult({
  decision,
  valid,
  invalid,
  needsEvidence,
  txHash,
}: VoteResultProps) {
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6 text-[var(--color-text-primary)]">
      <p className="text-sm text-[var(--color-text-secondary)]">Final Decision</p>

      <div
        className={`mt-3 inline-flex rounded-full px-4 py-2 text-lg font-bold capitalize ${
          DECISION_STYLES[decision]
        }`}
      >
        {decision.replace("_", " ")}
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-3">
        <div className="rounded-lg border border-[rgba(16,185,129,0.18)] bg-[rgba(16,185,129,0.08)] p-4 text-[var(--color-success)]">
          Valid: {valid}
        </div>

        <div className="rounded-lg border border-[rgba(239,68,68,0.18)] bg-[rgba(239,68,68,0.08)] p-4 text-[var(--color-danger)]">
          Invalid: {invalid}
        </div>

        <div className="rounded-lg border border-[rgba(245,158,11,0.18)] bg-[rgba(245,158,11,0.08)] p-4 text-[var(--color-warning)]">
          Needs Evidence: {needsEvidence}
        </div>
      </div>

      {txHash && (
        <a
          href={`https://sepolia.etherscan.io/tx/${txHash}`}
          target="_blank"
          rel="noreferrer"
          className="mt-5 block break-all font-mono text-xs text-[var(--color-accent-primary)] underline"
        >
          {txHash}
        </a>
      )}
    </div>
  );
}
