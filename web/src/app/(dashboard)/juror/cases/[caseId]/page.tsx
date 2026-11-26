"use client";

import { API_BASE_URL } from "@/config/api";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import VotingPanel from "@/components/voting/VotingPanel";
import VoteResult from "@/components/voting/VoteResult";
import { ArrowLeft, Gavel, CheckCircle2, ShieldCheck, Scale, AlertCircle } from "lucide-react";

export default function JurorCasePage() {
  const params = useParams();
  const caseId = params.caseId as string;

  const [complaint, setComplaint] = useState<any>(null);
  const [votes, setVotes] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  async function loadData() {
    try {
      setLoading(true);

      const [complaintRes, votesRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/complaints/${caseId}`),
        fetch(`${API_BASE_URL}/api/votes/${caseId}`),
      ]);

      const complaintData = await complaintRes.json();
      const votesData = await votesRes.json();

      if (complaintRes.ok) {
        if (complaintData.relationship !== "juror" && complaintData.relationship !== "admin") {
          setComplaint(null);
        } else {
          setComplaint(complaintData.complaint);
        }
      }

      if (votesRes.ok) {
        setVotes(votesData);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (caseId) loadData();
  }, [caseId]);

  if (loading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center space-y-3">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--color-accent-primary)] border-t-transparent" />
        <p className="text-sm text-[var(--color-text-secondary)]">Loading dispute case file...</p>
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="rounded-2xl border border-[rgba(239,68,68,0.3)] bg-[rgba(239,68,68,0.08)] p-8 text-center space-y-4">
        <AlertCircle className="mx-auto h-10 w-10 text-[var(--color-danger)]" />
        <h2 className="font-display text-xl font-bold text-[var(--color-text-primary)]">Dispute Not Found</h2>
        <p className="text-sm text-[var(--color-text-secondary)]">The requested case could not be located in your assigned docket.</p>
        <Link href="/juror">
          <button type="button" className="rounded-xl bg-[var(--color-accent-primary)] px-5 py-2 text-xs font-semibold text-white">
            Back to Assigned Cases
          </button>
        </Link>
      </div>
    );
  }

  const hasVoted = Boolean(votes?.hasVoted);
  const isDecided = complaint.status === "decided";

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/90 p-6 backdrop-blur-xl">
        <div className="space-y-1">
          <Link
            href="/juror"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition mb-1"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Assigned Docket</span>
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-display text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">
              {complaint.title}
            </h1>
            <span className="font-mono text-xs font-bold text-[var(--color-gold)]">
              {complaint.caseId}
            </span>
          </div>
          <p className="text-xs text-[var(--color-text-secondary)]">
            Category: <span className="capitalize font-medium text-[var(--color-text-primary)]">{complaint.category?.replace("_", " ")}</span> • Deadline: <span className="font-mono text-[var(--color-gold)]">{new Date(complaint.votingDeadline).toLocaleDateString()}</span>
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-[var(--color-accent-primary)]/30 bg-[var(--color-accent-glow)] px-4 py-2 text-xs font-semibold text-[var(--color-accent-primary)]">
          <Gavel className="h-4 w-4" />
          <span>Active Jury Deliberation</span>
        </div>
      </div>

      {!hasVoted && <VotingPanel complaint={complaint} />}

      {hasVoted && !isDecided && (
        <div className="rounded-2xl border border-[rgba(16,185,129,0.3)] bg-[rgba(16,185,129,0.1)] p-8 text-center space-y-3 backdrop-blur-xl">
          <CheckCircle2 className="mx-auto h-12 w-12 text-[var(--color-success)]" />
          <h2 className="font-display text-xl font-bold text-[var(--color-text-primary)]">
            Your Anonymous Vote Has Been Sealed
          </h2>
          <p className="max-w-md mx-auto text-xs leading-5 text-[var(--color-text-secondary)]">
            Thank you for fulfilling your community juror duty. Once all allocated jurors cast their ballots or the deliberation window expires, the consensus verdict will be anchored on-chain.
          </p>
          <div className="pt-2">
            <Link
              href="/juror"
              className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-accent-primary)] px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[var(--color-accent-hover)]"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Return to Juror Chamber</span>
            </Link>
          </div>
        </div>
      )}

      {isDecided && (
        <VoteResult
          decision={complaint.decision}
          valid={votes?.valid ?? 0}
          invalid={votes?.invalid ?? 0}
          needsEvidence={votes?.needs_evidence ?? 0}
          txHash={complaint.decisionTxHash}
        />
      )}
    </div>
  );
}
