"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import StatCard from "@/components/ui/StatCard";
import ComplaintTable from "@/components/complaint/ComplaintTable";
import ComplaintStatus from "@/components/complaint/ComplaintStatus";
import { STATUS } from "@/constants/status";
import { useComplaints } from "@/hooks/useComplaints";
import {
  FolderKanban,
  Clock,
  Vote,
  CheckCircle2,
  PlusCircle,
  FileQuestion,
  ShieldCheck,
  Scale,
  ArrowRight,
} from "lucide-react";

export default function ComplainantDashboardPage() {
  const { fetchComplaints, loading } = useComplaints();
  const [complaints, setComplaints] = useState<any[]>([]);

  useEffect(() => {
    let mounted = true;

    fetchComplaints({ as: "complainant" })
      .then((data) => {
        if (mounted) setComplaints(data || []);
      })
      .catch(() => {
        if (mounted) setComplaints([]);
      });

    return () => {
      mounted = false;
    };
  }, [fetchComplaints]);

  const stats = useMemo(() => {
    const total = complaints.length;
    const underReview = complaints.filter((c) => c.status === STATUS.UNDER_REVIEW).length;
    const inVoting = complaints.filter((c) => c.status === STATUS.VOTING).length;
    const decided = complaints.filter((c) => c.status === STATUS.DECIDED).length;

    return { total, underReview, inVoting, decided };
  }, [complaints]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/90 p-6 backdrop-blur-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-[var(--color-accent-primary)] animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-gold)]">
              Complainant Workspace
            </span>
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">
            My Dispute Cases
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Manage your filed disputes, attach evidence, and monitor anonymous juror consensus.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/complainant/file">
            <Button className="flex items-center gap-2 shadow-lg">
              <PlusCircle className="h-4 w-4" />
              <span>File New Complaint</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Modern Icon Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Filed"
          value={stats.total}
          icon={FolderKanban}
          iconColor="accent"
          description="Disputes submitted under your account"
        />

        <StatCard
          label="Under Review"
          value={stats.underReview}
          icon={Clock}
          iconColor="info"
          description="Awaiting respondent or initial check"
        />

        <StatCard
          label="In Voting"
          value={stats.inVoting}
          icon={Vote}
          iconColor="gold"
          description="Under active jury deliberation"
        />

        <StatCard
          label="Decided"
          value={stats.decided}
          icon={CheckCircle2}
          iconColor="success"
          description="Verdict finalized on-chain"
        />
      </div>

      {/* Quick Action & Protocol Guide */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/80 p-5 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-accent-glow)] text-[var(--color-accent-primary)]">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display text-sm font-bold text-[var(--color-text-primary)]">
                Cryptographic Anchor
              </h3>
              <p className="text-xs text-[var(--color-text-muted)]">SHA-256 fingerprint on Sepolia</p>
            </div>
          </div>
          <p className="mt-3 text-xs leading-5 text-[var(--color-text-secondary)]">
            Your dispute facts are hashed at creation. Neither party can retroactively change evidence.
          </p>
        </div>

        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/80 p-5 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-gold-subtle)] text-[var(--color-gold)]">
              <Scale className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display text-sm font-bold text-[var(--color-text-primary)]">
                Double-Blind Jury
              </h3>
              <p className="text-xs text-[var(--color-text-muted)]">Unbiased multi-juror review</p>
            </div>
          </div>
          <p className="mt-3 text-xs leading-5 text-[var(--color-text-secondary)]">
            Assigned jurors evaluate both claims and defense independently without knowing each other's votes.
          </p>
        </div>

        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/80 p-5 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[rgba(16,185,129,0.15)] text-[var(--color-success)]">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display text-sm font-bold text-[var(--color-text-primary)]">
                Public Verification
              </h3>
              <p className="text-xs text-[var(--color-text-muted)]">Shareable QR & Etherscan proof</p>
            </div>
          </div>
          <p className="mt-3 text-xs leading-5 text-[var(--color-text-secondary)]">
            Once decided, generate official verification QR certificates without revealing private dispute details.
          </p>
        </div>
      </div>

      {/* Complaints List Section */}
      <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/90 p-6 backdrop-blur-xl">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="font-display text-lg font-bold text-[var(--color-text-primary)]">
              Active & Historic Complaints
            </h2>
            <p className="text-xs text-[var(--color-text-secondary)]">
              Click "View" on any record to inspect hash proofs, add evidence, or download QR certificates.
            </p>
          </div>
          <span className="rounded-full bg-[var(--color-bg-elevated)] px-3 py-1 font-mono text-xs text-[var(--color-text-secondary)]">
            {complaints.length} Records
          </span>
        </div>

        <ComplaintTable complaints={complaints} isLoading={loading} />
      </section>
    </div>
  );
}
