"use client";

import { API_BASE_URL } from "@/config/api";

import { useEffect, useState } from "react";
import { useComplaints } from "@/hooks/useComplaints";
import ComplaintTable from "@/components/complaint/ComplaintTable";
import StatCard from "@/components/ui/StatCard";
import Button from "@/components/ui/Button";
import {
  ShieldAlert,
  MessageSquareCheck,
  Clock,
  Link2,
  Scale,
  ShieldCheck,
  AlertCircle,
  FileQuestion,
  CheckCircle2,
} from "lucide-react";

export default function OppositePartyDashboardPage() {
  const { fetchComplaints, loading, error } = useComplaints();

  const [complaints, setComplaints] = useState<any[]>([]);
  const [claimCaseId, setClaimCaseId] = useState("");
  const [claiming, setClaiming] = useState(false);
  const [claimMessage, setClaimMessage] = useState("");
  const [claimError, setClaimError] = useState("");

  async function loadComplaints() {
    const data = await fetchComplaints({ as: "opposite_party" });
    setComplaints(data || []);
  }

  useEffect(() => {
    void loadComplaints();
  }, []);

  async function claimCase() {
    const normalizedCaseId = claimCaseId.trim();

    if (!normalizedCaseId) return;

    try {
      setClaiming(true);
      setClaimMessage("");
      setClaimError("");

      const res = await fetch(
        `${API_BASE_URL}/api/complaints/${normalizedCaseId}/link-opposite-party`,
        { method: "POST" }
      );
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to claim case");
      }

      setClaimCaseId("");
      setClaimMessage("Case successfully linked to your account.");
      await loadComplaints();
    } catch (err) {
      setClaimError(err instanceof Error ? err.message : "Failed to claim case");
    } finally {
      setClaiming(false);
    }
  }

  const totalCases = complaints.length;

  const responded = complaints.filter(
    (complaint) => complaint.defenseStatement
  ).length;

  const pendingResponse = complaints.filter(
    (complaint) => !complaint.defenseStatement
  ).length;

  const displayComplaints = complaints.map((complaint) => ({
    ...complaint,
    complainantId:
      complaint.status === "decided"
        ? complaint.complainantId
        : { name: "Anonymous Complainant" },
  }));

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/90 p-6 backdrop-blur-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-[var(--color-gold)] animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-gold)]">
              Respondent Portal
            </span>
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">
            Cases Filed Against Me
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Review formal disputes naming you or your organization, submit counter-evidence, and record your defense.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-[rgba(59,130,246,0.3)] bg-[rgba(59,130,246,0.1)] px-3.5 py-2 text-xs font-semibold text-[var(--color-info)]">
          <Scale className="h-4 w-4" />
          <span>Fair Hearing Guaranteed</span>
        </div>
      </div>

      {/* Modern Icon Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Total Cases Against Me"
          value={totalCases}
          icon={ShieldAlert}
          iconColor="accent"
          description="Active and past dispute claims"
        />

        <StatCard
          label="Defense Submitted"
          value={responded}
          icon={MessageSquareCheck}
          iconColor="success"
          description="Cases with your formal statement"
        />

        <StatCard
          label="Pending Your Response"
          value={pendingResponse}
          icon={Clock}
          iconColor="gold"
          description="Disputes awaiting your defense"
        />
      </div>

      {/* Claim a Case Panel */}
      <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/90 p-6 backdrop-blur-xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1 max-w-xl">
            <h2 className="font-display text-base font-bold text-[var(--color-text-primary)] flex items-center gap-2">
              <Link2 className="h-4 w-4 text-[var(--color-accent-primary)]" />
              Claim a Dispute by Case ID
            </h2>
            <p className="text-xs leading-5 text-[var(--color-text-secondary)]">
              If a complainant filed a case using your email before you registered, enter the Case ID (e.g. <span className="font-mono text-[var(--color-gold)]">MC-2024-0001</span>) to link it securely to your account.
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row lg:max-w-md">
            <input
              value={claimCaseId}
              onChange={(event) => setClaimCaseId(event.target.value)}
              placeholder="e.g. MC-2024-0001"
              className="mc-input min-w-0 flex-1 px-4 py-2.5 text-sm"
            />
            <Button
              type="button"
              onClick={claimCase}
              isLoading={claiming}
              disabled={claiming || !claimCaseId.trim()}
              className="px-5 py-2.5"
            >
              Link Case
            </Button>
          </div>
        </div>

        {claimMessage && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-[rgba(16,185,129,0.3)] bg-[rgba(16,185,129,0.1)] p-3 text-xs text-[var(--color-success)]">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{claimMessage}</span>
          </div>
        )}

        {claimError && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-[rgba(239,68,68,0.3)] bg-[rgba(239,68,68,0.1)] p-3 text-xs text-[var(--color-danger)]">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{claimError}</span>
          </div>
        )}
      </section>

      {/* Respondent Rights Info */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/80 p-5 backdrop-blur-sm">
          <h3 className="font-display text-sm font-bold text-[var(--color-text-primary)] flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-[var(--color-gold)]" />
            Equal Opportunity to Defend
          </h3>
          <p className="mt-2 text-xs leading-5 text-[var(--color-text-secondary)]">
            Community jurors are not permitted to finalize decisions until both parties have submitted their evidence or the response window has officially lapsed.
          </p>
        </div>

        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/80 p-5 backdrop-blur-sm">
          <h3 className="font-display text-sm font-bold text-[var(--color-text-primary)] flex items-center gap-2">
            <Scale className="h-4 w-4 text-[var(--color-accent-primary)]" />
            Independent Juror Deliberation
          </h3>
          <p className="mt-2 text-xs leading-5 text-[var(--color-text-secondary)]">
            Jurors evaluate your factual defense against complainant claims without bias. Submitting counter-evidence (receipts, logs, emails) directly impacts the verdict.
          </p>
        </div>
      </div>

      {/* Complaints Table Section */}
      <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/90 p-6 backdrop-blur-xl">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="font-display text-lg font-bold text-[var(--color-text-primary)]">
              Dispute Inquiries
            </h2>
            <p className="text-xs text-[var(--color-text-secondary)]">
              Click "View" to inspect the complainant's claims, review their uploaded files, and submit your response.
            </p>
          </div>
          <span className="rounded-full bg-[var(--color-bg-elevated)] px-3 py-1 font-mono text-xs text-[var(--color-text-secondary)]">
            {complaints.length} Records
          </span>
        </div>

        {loading ? (
          <div className="py-12 text-center text-sm text-[var(--color-text-muted)]">
            Loading disputes filed against your account...
          </div>
        ) : error ? (
          <div className="rounded-xl border border-[rgba(239,68,68,0.3)] bg-[rgba(239,68,68,0.1)] p-4 text-sm text-[var(--color-danger)]">
            {error}
          </div>
        ) : (
          <ComplaintTable
            complaints={displayComplaints}
            viewBasePath="/opposite-party/cases"
          />
        )}
      </section>
    </div>
  );
}
