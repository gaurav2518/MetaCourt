"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { QRCodeCanvas } from "qrcode.react";

import ComplaintStatus from "@/components/complaint/ComplaintStatus";
import HashProof from "@/components/blockchain/HashProof";

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
    return <div className="p-8 text-sm text-slate-500">Loading public case...</div>;
  }

  if (!complaint) {
    return <div className="p-8 text-sm text-red-600">Case not found.</div>;
  }

  const etherscanUrl = complaint.blockchainTxHash
    ? `https://sepolia.etherscan.io/tx/${complaint.blockchainTxHash}`
    : null;

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">
            Public Blockchain Verification
          </p>

          <h1 className="mt-4 text-3xl font-bold">{complaint.title}</h1>

          <p className="mt-2 text-sm text-slate-400">
            Case ID: {complaint.caseId}
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <ComplaintStatus status={complaint.status} />

            <span className="rounded-full bg-white/10 px-3 py-1 text-sm capitalize">
              {complaint.category}
            </span>
          </div>

          {complaint.status === "decided" && (
            <div className="mt-5 rounded-2xl border border-green-400/20 bg-green-400/10 p-4">
              <p className="text-sm text-green-200">Final Decision</p>
              <p className="mt-1 text-xl font-semibold capitalize text-green-100">
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
            className="block rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4 text-sm text-cyan-200 underline"
          >
            View transaction on Sepolia Etherscan
          </a>
        )}

        <div className="rounded-3xl border border-white/10 bg-white p-6 text-slate-900">
          <h2 className="text-lg font-semibold">Share public verification</h2>
          <p className="mt-1 text-sm text-slate-500">
            Anyone can scan this QR code to verify this case publicly.
          </p>

          <div className="mt-5 inline-block rounded-2xl border p-4">
            <QRCodeCanvas value={publicUrl} size={180} />
          </div>
        </div>

        <div className="rounded-2xl border border-green-400/20 bg-green-400/10 p-5 text-green-100">
          This case is publicly verifiable on the blockchain.
        </div>
      </div>
    </main>
  );
}