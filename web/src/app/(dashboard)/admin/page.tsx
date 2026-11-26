"use client";

import { API_BASE_URL } from "@/config/api";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import StatsOverview from "@/components/admin/StatsOverview";
import CasesChart from "@/components/admin/CasesChart";
import { STATUS } from "@/constants";
import {
  ShieldCheck,
  FolderKanban,
  Users,
  UserCheck,
  BarChart3,
  ExternalLink,
  ArrowRight,
  Activity,
  Cpu,
} from "lucide-react";

type CountItem = {
  _id: string;
  count: number;
};

type AdminStats = {
  casesByStatus: CountItem[];
  casesByCategory: CountItem[];
  casesPerDay: CountItem[];
  usersByRole: CountItem[];
  pendingJurorApplications: number;
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadStats() {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(`${API_BASE_URL}/api/admin/stats`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch stats");
      }

      setStats(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStats();
  }, []);

  const totalCases = useMemo(() => {
    return stats?.casesByStatus.reduce((sum, item) => sum + item.count, 0) ?? 0;
  }, [stats]);

  const totalUsers = useMemo(() => {
    return stats?.usersByRole.reduce((sum, item) => sum + item.count, 0) ?? 0;
  }, [stats]);

  const getStatusCount = (status: string) => {
    return stats?.casesByStatus.find((item) => item._id === status)?.count ?? 0;
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center space-y-3">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--color-accent-primary)] border-t-transparent" />
        <p className="text-sm text-[var(--color-text-secondary)]">Loading protocol telemetry...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-[rgba(239,68,68,0.3)] bg-[rgba(239,68,68,0.1)] p-6 text-sm text-[var(--color-danger)]">
        {error}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-8 text-center text-sm text-[var(--color-text-muted)]">
        No platform statistics available.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/90 p-6 backdrop-blur-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-[var(--color-accent-primary)] animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-gold)]">
              System Administration
            </span>
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">
            Platform Operations & Telemetry
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Monitor incoming complaints, review juror applications, allocate cases, and oversee blockchain verification.
          </p>
        </div>

        {/* Quick Shortcut Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/admin/complaints"
            className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] px-3.5 py-2 text-xs font-semibold text-[var(--color-text-primary)] transition hover:bg-[var(--color-bg-elevated)]"
          >
            <FolderKanban className="h-3.5 w-3.5 text-[var(--color-accent-primary)]" />
            <span>Manage Disputes</span>
          </Link>

          <Link
            href="/admin/jurors"
            className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] px-3.5 py-2 text-xs font-semibold text-[var(--color-text-primary)] transition hover:bg-[var(--color-bg-elevated)]"
          >
            <UserCheck className="h-3.5 w-3.5 text-[var(--color-gold)]" />
            <span>Juror Applications ({stats.pendingJurorApplications})</span>
          </Link>
        </div>
      </div>

      {/* 5-Card Stats Overview */}
      <StatsOverview
        totalCases={totalCases}
        pendingReview={getStatusCount(STATUS.UNDER_REVIEW)}
        activeVoting={getStatusCount(STATUS.VOTING)}
        decided={getStatusCount(STATUS.DECIDED)}
        totalUsers={totalUsers}
      />

      {/* Analytics Visualization Charts */}
      <CasesChart
        casesByCategory={stats.casesByCategory}
        casesPerDay={stats.casesPerDay}
      />

      {/* Lower Dual Operational Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Pending Juror Applications Callout Card */}
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/90 p-6 backdrop-blur-xl flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-gold)] flex items-center gap-1.5">
                <UserCheck className="h-4 w-4" />
                Community Juror Vetting
              </span>
              <span className="rounded-full bg-[var(--color-gold-subtle)] px-2.5 py-0.5 text-xs font-bold text-[var(--color-gold)]">
                {stats.pendingJurorApplications} Pending
              </span>
            </div>
            <h3 className="font-display text-xl font-bold text-[var(--color-text-primary)]">
              Pending Juror Applications
            </h3>
            <p className="text-xs leading-5 text-[var(--color-text-secondary)]">
              Registered users have requested community juror standing. Review applicant statements, qualifications, and approve credible jurors.
            </p>
          </div>

          <Link
            href="/admin/jurors"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--color-accent-primary)] px-5 py-2.5 text-xs font-semibold text-white shadow-md transition hover:bg-[var(--color-accent-hover)] w-full sm:w-auto"
          >
            <span>Review Applications Queue</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Blockchain Node & Smart Contract Status Card */}
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/90 p-6 backdrop-blur-xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-success)] flex items-center gap-1.5">
              <Cpu className="h-4 w-4" />
              Infrastructure Telemetry
            </span>
            <span className="flex items-center gap-1.5 text-xs font-mono text-[var(--color-success)]">
              <span className="h-2 w-2 rounded-full bg-[var(--color-success)] animate-pulse" />
              Sepolia Live
            </span>
          </div>

          <h3 className="font-display text-xl font-bold text-[var(--color-text-primary)]">
            Ethereum Smart Contract Status
          </h3>

          <div className="space-y-2 text-xs font-mono">
            <div className="flex items-center justify-between rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg-primary)] p-2.5">
              <span className="text-[var(--color-text-muted)]">Proof Hashing Standard:</span>
              <span className="text-[var(--color-text-primary)] font-semibold">SHA-256 Deterministic</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg-primary)] p-2.5">
              <span className="text-[var(--color-text-muted)]">Consensus Mechanism:</span>
              <span className="text-[var(--color-gold)] font-semibold">Weighted Multi-Juror Schelling</span>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg-primary)] p-2.5">
              <span className="text-[var(--color-text-muted)]">Dispute Security:</span>
              <span className="text-[var(--color-success)] font-semibold">Zero-Knowledge Protected</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
