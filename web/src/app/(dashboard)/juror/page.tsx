"use client";

import { API_BASE_URL } from "@/config/api";

import { useEffect, useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import ReputationCard from "@/components/juror/ReputationCard";
import CaseQueue from "@/components/juror/CaseQueue";
import StatCard from "@/components/ui/StatCard";
import { useAuth } from "@/context/AuthContext";
import {
  Gavel,
  Clock,
  CheckCircle2,
  Award,
  Scale,
  ShieldCheck,
  EyeOff,
  Sparkles,
} from "lucide-react";

export default function JurorDashboardPage() {
  const { user } = useAuth();
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCases() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/juror/cases`, {
          credentials: "include",
        });
        const data = await res.json();

        if (res.ok) {
          setCases(data.cases || []);
        }
      } finally {
        setLoading(false);
      }
    }

    loadCases();
  }, []);

  const assignedCases = cases.length;
  const pendingVotes = cases.filter((c) => !c.hasVoted).length;
  const completedVotes = cases.filter((c) => c.hasVoted).length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/90 p-6 backdrop-blur-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-[var(--color-accent-primary)] animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-gold)]">
              Community Juror Chamber
            </span>
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">
            Juror Deliberation Workspace
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Evaluate dispute evidence under double-blind protocol, cast anonymous votes, and maintain voting integrity.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-[var(--color-accent-primary)]/40 bg-[var(--color-accent-glow)] px-4 py-2 text-xs font-semibold text-[var(--color-accent-primary)]">
          <Award className="h-4 w-4" />
          <span className="capitalize">{user?.jurorLevel ?? "Junior"} Juror</span>
        </div>
      </div>

      {/* Modern Icon Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Assigned Disputes"
          value={assignedCases}
          icon={Gavel}
          iconColor="accent"
          description="Total cases allocated to your review"
        />

        <StatCard
          label="Pending Deliberation"
          value={pendingVotes}
          icon={Clock}
          iconColor="gold"
          description="Cases awaiting your anonymous vote"
        />

        <StatCard
          label="Votes Cast"
          value={completedVotes}
          icon={CheckCircle2}
          iconColor="success"
          description="Disputes where your vote is sealed"
        />

        <StatCard
          label="Reputation Score"
          value={user?.reputationScore ?? 100}
          icon={Award}
          iconColor="indigo"
          description="Weighted score driving vote power"
        />
      </div>

      {/* Juror Reputation Card */}
      <ReputationCard
        reputationScore={user?.reputationScore ?? 100}
        jurorLevel={user?.jurorLevel ?? "junior"}
        correctVotes={user?.correctVotes ?? 0}
        totalVotes={user?.totalVotes ?? 0}
      />

      {/* Integrity & Protocol Guarantees */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/80 p-5 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-accent-glow)] text-[var(--color-accent-primary)]">
              <EyeOff className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display text-sm font-bold text-[var(--color-text-primary)]">
                Anonymous Voting
              </h3>
              <p className="text-xs text-[var(--color-text-muted)]">Zero identity leakage</p>
            </div>
          </div>
          <p className="mt-3 text-xs leading-5 text-[var(--color-text-secondary)]">
            Neither the complainant nor the respondent can see which jurors were assigned to their case.
          </p>
        </div>

        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/80 p-5 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-gold-subtle)] text-[var(--color-gold)]">
              <Scale className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display text-sm font-bold text-[var(--color-text-primary)]">
                Consensus Alignment
              </h3>
              <p className="text-xs text-[var(--color-text-muted)]">Objective evidence review</p>
            </div>
          </div>
          <p className="mt-3 text-xs leading-5 text-[var(--color-text-secondary)]">
            Aligning with the supermajority earns +10 reputation points, advancing you towards Senior and Master juror tiers.
          </p>
        </div>

        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/80 p-5 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[rgba(16,185,129,0.15)] text-[var(--color-success)]">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display text-sm font-bold text-[var(--color-text-primary)]">
                Deadline Adherence
              </h3>
              <p className="text-xs text-[var(--color-text-muted)]">Active participation</p>
            </div>
          </div>
          <p className="mt-3 text-xs leading-5 text-[var(--color-text-secondary)]">
            Cases feature countdown deadlines. Timely voting maintains your active status and priority allocation.
          </p>
        </div>
      </div>

      {/* Case Queue Section */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-lg font-bold text-[var(--color-text-primary)]">
              Assigned Voting Docket
            </h2>
            <p className="text-xs text-[var(--color-text-secondary)]">
              Review claim details, examine documents from both sides, and cast your independent vote.
            </p>
          </div>
          <span className="rounded-full bg-[var(--color-bg-elevated)] px-3 py-1 font-mono text-xs text-[var(--color-text-secondary)]">
            {pendingVotes} Pending / {assignedCases} Total
          </span>
        </div>

        {loading ? (
          <div className="py-12 text-center text-sm text-[var(--color-text-muted)]">
            Loading assigned cases...
          </div>
        ) : (
          <CaseQueue cases={cases} />
        )}
      </section>
    </div>
  );
}
