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
  const [verifyStatus, setVerifyStatus] = useState<
    "success" | "failed" | null
  >(null);
  const [message, setMessage] = useState("");

  if (!blockchainTxHash || !complaintHash) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
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
        setMessage("Hash verified — complaint unchanged since filing");
      } else {
        setVerifyStatus("failed");
        setMessage("Hash mismatch — complaint may have been altered");
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
    <div className="space-y-4 rounded-2xl border bg-white p-5 text-slate-900 shadow-sm">
      <div>
        <p className="text-sm font-medium text-slate-700">SHA-256 Hash</p>

        <div className="mt-2 flex items-center gap-2 rounded-xl bg-slate-50 p-3">
          <code className="break-all font-mono text-xs text-slate-700">
            {complaintHash}
          </code>

          <button
            type="button"
            onClick={copyHash}
            className="shrink-0 rounded-lg border bg-white px-3 py-1.5 text-xs font-medium text-slate-900"
          >
            Copy
          </button>
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-slate-700">
          Blockchain Transaction
        </p>

        <a
          href={etherscanUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-2 block break-all font-mono text-xs text-cyan-700 underline"
        >
          {blockchainTxHash}
        </a>
      </div>

      <button
        type="button"
        onClick={verifyOnChain}
        disabled={verifying}
        className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
      >
        {verifying ? "Verifying..." : "Verify on Chain"}
      </button>

      {message && (
        <div
          className={`rounded-xl p-3 text-sm ${
            verifyStatus === "success"
              ? "border border-green-200 bg-green-50 text-green-800"
              : "border border-red-200 bg-red-50 text-red-800"
          }`}
        >
          {verifyStatus === "success" ? "✅ " : "⚠️ "}
          {message}
        </div>
      )}
    </div>
  );
}
