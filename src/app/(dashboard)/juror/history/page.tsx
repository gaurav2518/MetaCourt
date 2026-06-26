"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import VotingHistory from "@/components/voting/VotingHistory";

export default function JurorHistoryPage() {
  const [votes, setVotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHistory() {
      try {
        const res = await fetch("/api/juror/history");
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
        <p className="text-sm text-slate-500">Loading voting history...</p>
      ) : (
        <VotingHistory votes={votes} />
      )}
    </div>
  );
}