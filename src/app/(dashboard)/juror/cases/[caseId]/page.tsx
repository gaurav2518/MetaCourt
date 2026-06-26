"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import PageHeader from "@/components/layout/PageHeader";
import VotingPanel from "@/components/voting/VotingPanel";
import VoteResult from "@/components/voting/VoteResult";

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
        fetch(`/api/complaints/${caseId}`),
        fetch(`/api/votes/${caseId}`),
      ]);

      const complaintData = await complaintRes.json();
      const votesData = await votesRes.json();

      if (complaintRes.ok) {
        setComplaint(complaintData.complaint);
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
    return <p className="text-sm text-slate-500">Loading case...</p>;
  }

  if (!complaint) {
    return <p className="text-sm text-red-600">Complaint not found.</p>;
  }

  const hasVoted = Boolean(votes?.hasVoted);
  const isDecided = complaint.status === "decided";

  return (
    <div className="space-y-6">
      <PageHeader
        title={complaint.title}
        subtitle={`Case ID: ${complaint.caseId}`}
      />

      {!hasVoted && <VotingPanel complaint={complaint} />}

      {hasVoted && !isDecided && (
        <div className="rounded-2xl border border-green-200 bg-green-50 p-6 text-green-800">
          <h2 className="text-lg font-semibold">Vote Submitted</h2>
          <p className="mt-2 text-sm">
            Your vote has been recorded. Final decision is pending.
          </p>
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