"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { QRCodeCanvas } from "qrcode.react";

import ComplaintStatus from "@/components/complaint/ComplaintStatus";
import HashProof from "@/components/blockchain/HashProof";
import NetworkBackground from "@/components/layout/NetworkBackground";

export default function PublicCasePage() {
  const { caseId } = useParams();
  const [complaint, setComplaint] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const publicUrl =
    typeof window !== "undefined"
      ? window.location.href
      : "";

  useEffect(() => {
    async function loadCase() {
      const res = await fetch(`/api/complaints/${caseId}`);
      const data = await res.json();

      if (res.ok) {
        setComplaint(data.complaint);
      }

      setLoading(false);
    }

    if (caseId) loadCase();
  }, [caseId]);

  if (loading) {
    return <div className="bg-[var(--color-bg-primary)] p-8 text-sm text-[var(--color-text-secondary)]">Loading public case...</div>;
  }

  if (!complaint) {
    return <div className="bg-[var(--color-bg-primary)] p-8 text-sm text-[var(--color-danger)]">Case not found.</div>;
  }

  const etherscanUrl = complaint.blockchainTxHash
    ? `https://sepolia.etherscan.io/tx/${complaint.blockchainTxHash}`
    : null;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[var(--color-bg-primary)] px-4 py-10 text-[var(--color-text-primary)]">
      <NetworkBackground />

      <div className="relative z-10 mx-auto max-w-4xl space-y-6">
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/90 p-6 backdrop-blur-xl">
          <p className="text-xs font-medium uppercase tracking-wider text-[var(--color-gold)]">
            Public Blockchain Verification
          </p>

          <h1 className="mt-4 font-display text-3xl font-bold">{complaint.title}</h1>

          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
            Case ID: {complaint.caseId}
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <ComplaintStatus status={complaint.status} />

            <span className="rounded-full bg-[rgba(92,90,122,0.15)] px-3 py-1 text-sm capitalize text-[var(--color-text-secondary)]">
              {complaint.category}
            </span>
          </div>

          {complaint.status === "decided" && (
            <div className="mt-5 rounded-lg bg-[rgba(16,185,129,0.15)] p-4">
              <p className="text-sm text-[var(--color-success)]">Final Decision</p>
              <p className="mt-1 font-display text-xl font-semibold capitalize text-[var(--color-text-primary)]">
                {complaint.decision?.replace("_", " ")}
              </p>
            </div>
          )}
        </div>

        <HashProof
          caseId={complaint.caseId}
          complaintHash={complaint.complaintHash}
          blockchainTxHash={complaint.blockchainTxHash}
        />

        {etherscanUrl && (
          <a
            href={etherscanUrl}
            target="_blank"
            rel="noreferrer"
            className="block rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/90 p-4 text-sm text-[var(--color-accent-primary)] underline"
          >
            View transaction on Sepolia Etherscan
          </a>
        )}

        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/90 p-6">
          <h2 className="font-display text-lg font-semibold">Share public verification</h2>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            Anyone can scan this QR code to verify this case publicly.
          </p>

          <div className="mt-5 inline-block rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-primary)] p-4">
            <QRCodeCanvas value={publicUrl} size={180} />
          </div>
        </div>

        <div className="rounded-lg bg-[rgba(16,185,129,0.15)] p-5 text-[var(--color-success)]">
          This case is publicly verifiable on the blockchain.
        </div>
      </div>
    </main>
  );
}
