"use client";

import { API_BASE_URL } from "@/config/api";

import { useEffect, useMemo, useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import VotingHistory from "@/components/voting/VotingHistory";
import StatCard from "@/components/ui/StatCard";
import { History, Award, CheckCircle2, TrendingUp, Scale } from "lucide-react";

export default function JurorHistoryPage() {
  const [votes, setVotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHistory() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/juror/history`, {
          credentials: "include",
        });
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

  const stats = useMemo(() => {
    const totalVotes = votes.length;
    const correctVotes = votes.filter((v) => (v.reputationChange ?? 0) > 0).length;
    const accuracy = totalVotes > 0 ? Math.round((correctVotes / totalVotes) * 100) : 100;
    const netReputation = votes.reduce((acc, v) => acc + (v.reputationChange ?? 0), 0);

    return { totalVotes, accuracy, netReputation };
  }, [votes]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/90 p-6 backdrop-blur-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-[var(--color-accent-primary)] animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-gold)]">
              Deliberation Audit Record
            </span>
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">
            My Voting History & Track Record
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Inspect your historic votes, consensus outcomes, and reputation delta across all resolved disputes.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] px-4 py-2 text-xs font-mono text-[var(--color-gold)]">
          <History className="h-4 w-4" />
          <span>Immutable Ledger Log</span>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Total Votes Cast"
          value={stats.totalVotes}
          icon={CheckCircle2}
          iconColor="accent"
          description="Resolved disputes you participated in"
        />

        <StatCard
          label="Consensus Alignment"
          value={`${stats.accuracy}%`}
          icon={Scale}
          iconColor="success"
          description="Rate of alignment with supermajority"
        />

        <StatCard
          label="Net Reputation Earned"
          value={stats.netReputation >= 0 ? `+${stats.netReputation}` : stats.netReputation}
          icon={TrendingUp}
          iconColor="gold"
          description="Lifetime points gained through consensus"
        />
      </div>

      {/* Voting History Table */}
      <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/90 p-6 backdrop-blur-xl">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="font-display text-lg font-bold text-[var(--color-text-primary)]">
              Historic Case Decisions
            </h2>
            <p className="text-xs text-[var(--color-text-secondary)]">
              All votes remain cryptographically attributed to your juror public key.
            </p>
          </div>
          <span className="rounded-full bg-[var(--color-bg-elevated)] px-3 py-1 font-mono text-xs text-[var(--color-text-secondary)]">
            {votes.length} Entries
          </span>
        </div>

        {loading ? (
          <div className="py-12 text-center text-sm text-[var(--color-text-muted)]">
            Loading voting history log...
          </div>
        ) : (
          <VotingHistory votes={votes} />
        )}
      </section>
    </div>
  );
}
