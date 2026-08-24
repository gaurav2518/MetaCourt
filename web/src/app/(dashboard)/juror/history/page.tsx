"use client";

import { API_BASE_URL } from "@/config/api";

import { useEffect, useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import VotingHistory from "@/components/voting/VotingHistory";

export default function JurorHistoryPage() {
  const [votes, setVotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHistory() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/juror/history`);
        const data = await res.json();

        if (res.ok) {
          setVotes(data.votes || []);
        }
      } finally {
        setLoading(false);
      }
    }

    loadHistory();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Voting History"
        subtitle="Review your past votes and reputation changes."
      />

      {loading ? (
        <p className="text-sm text-[var(--color-text-muted)]">Loading voting history...</p>
      ) : (
        <VotingHistory votes={votes} />
      )}
    </div>
  );
}
