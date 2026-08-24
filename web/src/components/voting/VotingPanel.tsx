"use client";

import { useState } from "react";
import { AlertTriangle, CheckCircle2, FileQuestion, XCircle } from "lucide-react";

import EvidenceViewer from "@/components/complaint/EvidenceViewer";
import Button from "@/components/ui/Button";
import { useVoting } from "@/hooks/useVoting";
import { VOTE_TYPES } from "@/constants";

type VotingPanelProps = {
  complaint: any;
  alreadyVoted?: boolean;
};

type VoteValue = (typeof VOTE_TYPES)[keyof typeof VOTE_TYPES];

const voteOptions = [
  {
    title: "Valid Complaint",
    description: "Evidence supports the complaint and should proceed.",
    value: VOTE_TYPES.VALID,
    icon: CheckCircle2,
    selectedClass: "border-[var(--color-success)] bg-[rgba(16,185,129,0.12)]",
    iconClass: "text-[var(--color-success)]",
  },
  {
    title: "Invalid Complaint",
    description: "The claim is unsupported or outside MetaCourt scope.",
    value: VOTE_TYPES.INVALID,
    icon: XCircle,
    selectedClass: "border-[var(--color-danger)] bg-[rgba(239,68,68,0.12)]",
    iconClass: "text-[var(--color-danger)]",
  },
  {
    title: "Need More Evidence",
    description: "The record is incomplete and needs more proof.",
    value: VOTE_TYPES.NEEDS_EVIDENCE,
    icon: FileQuestion,
    selectedClass: "border-[var(--color-warning)] bg-[rgba(245,158,11,0.12)]",
    iconClass: "text-[var(--color-warning)]",
  },
];

export default function VotingPanel({
  complaint,
  alreadyVoted = false,
}: VotingPanelProps) {
  const { castVote, loading } = useVoting();

  const [activeTab, setActiveTab] = useState("complaint");
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
      <div className="rounded-xl bg-[rgba(16,185,129,0.15)] p-6 text-[var(--color-success)]">
        <h2 className="font-display text-lg font-semibold">Vote Submitted</h2>
        <p className="mt-2 text-sm">Your anonymous vote has been recorded.</p>

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

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(320px,2fr)]">
      <section className="min-w-0">
        <div className="border-b border-[var(--color-border)]">
          {["complaint", "evidence", "response"].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`mr-6 border-b-2 px-1 py-3 text-sm font-medium capitalize transition duration-150 ${
                activeTab === tab
                  ? "border-[var(--color-accent-primary)] text-[var(--color-text-primary)]"
                  : "border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]"
              }`}
            >
              {tab === "complaint"
                ? "Complaint"
                : tab === "evidence"
                ? "Evidence"
                : "Defense Response"}
            </button>
          ))}
        </div>

        <div className="py-6">
          {activeTab === "complaint" && (
            <div className="mc-card p-6">
              <h3 className="font-display text-2xl font-bold">{complaint.title}</h3>
              <p className="mt-4 text-sm leading-7 text-[var(--color-text-secondary)]">
                {complaint.description}
              </p>
            </div>
          )}

          {activeTab === "evidence" && (
            <div className="grid gap-4 md:grid-cols-2">
              <EvidenceViewer files={complaint.evidence || []} title="Complainant Evidence" />
              <EvidenceViewer files={complaint.defenseEvidence || []} title="Defense Evidence" />
            </div>
          )}

          {activeTab === "response" && (
            <div className="mc-card p-6 text-sm leading-7 text-[var(--color-text-secondary)]">
              {complaint.defenseStatement || "No response submitted yet."}
            </div>
          )}
        </div>
      </section>

      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="mc-card p-7">
          <h2 className="font-display text-2xl font-bold">Cast Your Vote</h2>
          <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
            Choose the outcome that best matches the record.
          </p>

          <div className="mt-6 space-y-3">
            {voteOptions.map((option) => {
              const Icon = option.icon;
              const selected = selectedVote === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setSelectedVote(option.value)}
                  className={`flex w-full items-start gap-3 rounded-lg border p-4 text-left transition duration-150 ${
                    selected
                      ? option.selectedClass
                      : "border-[var(--color-border)] bg-[var(--color-bg-elevated)] hover:border-[var(--color-accent-primary)]"
                  }`}
                >
                  <Icon className={`mt-0.5 h-5 w-5 ${option.iconClass}`} />
                  <span>
                    <span className="block text-sm font-semibold text-[var(--color-text-primary)]">
                      {option.title}
                    </span>
                    <span className="mt-1 block text-xs leading-5 text-[var(--color-text-secondary)]">
                      {option.description}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-5 flex gap-3 rounded-lg bg-[var(--color-gold-subtle)] p-4 text-sm leading-6 text-[var(--color-gold)]">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            Your vote is anonymous and recorded through the case blockchain workflow.
          </div>

          {error && (
            <div className="mt-4 rounded-lg bg-[rgba(239,68,68,0.15)] px-4 py-3 text-sm text-[var(--color-danger)]">
              {error}
            </div>
          )}

          <Button
            type="button"
            onClick={handleSubmit}
            disabled={!selectedVote || loading}
            isLoading={loading}
            className="mt-5 w-full"
          >
            Submit Vote
          </Button>
        </div>
      </aside>
    </div>
  );
}
