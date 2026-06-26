"use client";

import { useState } from "react";
import EvidenceViewer from "@/components/complaint/EvidenceViewer";
import Button from "@/components/ui/Button";
import { useVoting } from "@/hooks/useVoting";
import { VOTE_TYPES } from "@/constants";

type VotingPanelProps = {
  complaint: any;
  alreadyVoted?: boolean;
};

type VoteValue = (typeof VOTE_TYPES)[keyof typeof VOTE_TYPES];

export default function VotingPanel({
  complaint,
  alreadyVoted = false,
}: VotingPanelProps) {
  const { castVote, loading } = useVoting();

  const [activeTab, setActiveTab] = useState("details");
  const [selectedVote, setSelectedVote] = useState<VoteValue | null>(null);
  const [submittedTxHash, setSubmittedTxHash] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function handleSubmit() {
    if (!selectedVote) return;

    try {
      setError("");

      const result = await castVote(complaint.caseId, selectedVote);

      setSubmittedTxHash(result.txHash || null);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to submit vote");
    }
  }

  if (alreadyVoted || submittedTxHash) {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-6 text-green-800">
        <h2 className="text-lg font-semibold">Vote Submitted</h2>
        <p className="mt-2 text-sm">
          Your anonymous vote has been recorded.
        </p>

        {submittedTxHash && (
          <a
            href={`https://sepolia.etherscan.io/tx/${submittedTxHash}`}
            target="_blank"
            rel="noreferrer"
            className="mt-3 block break-all font-mono text-xs underline"
          >
            {submittedTxHash}
          </a>
        )}
      </div>
    );
  }

  const voteButtons = [
    {
      label: "Valid Complaint",
      value: VOTE_TYPES.VALID,
      className: "border-green-300 bg-green-50 text-green-700",
    },
    {
      label: "Invalid Complaint",
      value: VOTE_TYPES.INVALID,
      className: "border-red-300 bg-red-50 text-red-700",
    },
    {
      label: "Need More Evidence",
      value: VOTE_TYPES.NEEDS_EVIDENCE,
      className: "border-yellow-300 bg-yellow-50 text-yellow-700",
    },
  ];

  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <div className="flex gap-2 border-b pb-3">
        {["details", "evidence", "response"].map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`rounded-xl px-4 py-2 text-sm capitalize ${
              activeTab === tab
                ? "bg-black text-white"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            {tab === "details"
              ? "Complaint Details"
              : tab === "evidence"
              ? "Evidence"
              : "Opposite Party Response"}
          </button>
        ))}
      </div>

      <div className="py-5">
        {activeTab === "details" && (
          <div>
            <h3 className="text-lg font-semibold">{complaint.title}</h3>
            <p className="mt-2 text-sm leading-7 text-slate-600">
              {complaint.description}
            </p>
          </div>
        )}

        {activeTab === "evidence" && (
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="mb-3 font-medium">Complainant Evidence</h4>
              <EvidenceViewer files={complaint.evidence || []} />
            </div>

            <div>
              <h4 className="mb-3 font-medium">Defense Evidence</h4>
              <EvidenceViewer files={complaint.defenseEvidence || []} />
            </div>
          </div>
        )}

        {activeTab === "response" && (
          <div className="rounded-xl bg-slate-50 p-4 text-sm leading-7 text-slate-700">
            {complaint.defenseStatement || "No response submitted yet."}
          </div>
        )}
      </div>

      <p className="mb-3 text-sm text-amber-700">
        Your vote is anonymous and will be permanently recorded on the blockchain.
      </p>

      <div className="grid gap-3 md:grid-cols-3">
        {voteButtons.map((button) => (
          <button
            key={button.value}
            type="button"
            onClick={() => setSelectedVote(button.value)}
            className={`rounded-2xl border p-4 text-sm font-semibold transition ${
              button.className
            } ${
              selectedVote === button.value
                ? "ring-2 ring-black"
                : "opacity-80"
            }`}
          >
            {button.label}
          </button>
        ))}
      </div>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      <div className="mt-5">
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={!selectedVote || loading}
          isLoading={loading}
        >
          Submit Vote
        </Button>
      </div>
    </div>
  );
}