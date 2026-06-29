"use client";

import { useState } from "react";

type HashProofProps = {
  caseId: string;
  complaintHash?: string | null;
  blockchainTxHash?: string | null;
};

export default function HashProof({
  caseId,
  complaintHash,
  blockchainTxHash,
}: HashProofProps) {
  const [verifying, setVerifying] = useState(false);
  const [verifyStatus, setVerifyStatus] = useState<"success" | "failed" | null>(
    null
  );
  const [message, setMessage] = useState("");

  if (!blockchainTxHash || !complaintHash) {
    return (
      <div className="rounded-lg border border-[rgba(245,158,11,0.25)] bg-[rgba(245,158,11,0.12)] p-4 text-sm text-[var(--color-warning)]">
        Blockchain registration pending
      </div>
    );
  }

  const etherscanUrl = `https://sepolia.etherscan.io/tx/${blockchainTxHash}`;

  async function copyHash() {
    await navigator.clipboard.writeText(complaintHash || "");
  }

  async function verifyOnChain() {
    try {
      setVerifying(true);
      setVerifyStatus(null);
      setMessage("");

      const res = await fetch(`/api/blockchain/verify?caseId=${caseId}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Verification failed");
      }

      if (data.storedHash === complaintHash) {
        setVerifyStatus("success");
        setMessage("Hash verified - complaint unchanged since filing");
      } else {
        setVerifyStatus("failed");
        setMessage("Hash mismatch - complaint may have been altered");
      }
    } catch (error) {
      setVerifyStatus("failed");
      setMessage(
        error instanceof Error ? error.message : "Verification failed"
      );
    } finally {
      setVerifying(false);
    }
  }

  return (
    <div className="space-y-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-5 text-[var(--color-text-primary)]">
      <div>
        <p className="mc-label">SHA-256 Hash</p>

        <div className="mt-2 flex items-center gap-2 rounded-lg bg-[var(--color-bg-primary)] p-3">
          <code className="break-all font-mono text-xs text-[var(--color-text-secondary)]">
            {complaintHash}
          </code>

          <button
            type="button"
            onClick={copyHash}
            className="shrink-0 rounded-lg border border-[var(--color-border)] bg-transparent px-3 py-1.5 text-xs font-medium text-[var(--color-text-primary)] transition hover:bg-[var(--color-bg-elevated)]"
          >
            Copy
          </button>
        </div>
      </div>

      <div>
        <p className="mc-label">Blockchain Transaction</p>

        <a
          href={etherscanUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-2 block break-all font-mono text-xs text-[var(--color-accent-primary)] underline"
        >
          {blockchainTxHash}
        </a>
      </div>

      <button
        type="button"
        onClick={verifyOnChain}
        disabled={verifying}
        className="rounded-lg bg-[var(--color-accent-primary)] px-4 py-2 text-sm font-medium text-white transition hover:bg-[var(--color-accent-hover)] disabled:opacity-60"
      >
        {verifying ? "Verifying..." : "Verify on Chain"}
      </button>

      {message && (
        <div
          className={`rounded-lg p-3 text-sm ${
            verifyStatus === "success"
              ? "bg-[rgba(16,185,129,0.15)] text-[var(--color-success)]"
              : "bg-[rgba(239,68,68,0.15)] text-[var(--color-danger)]"
          }`}
        >
          {verifyStatus === "success" ? "Verified: " : "Warning: "}
          {message}
        </div>
      )}
    </div>
  );
}
