"use client";

import { useEffect, useState } from "react";

import { useComplaints } from "@/hooks/useComplaints";
import PageHeader from "@/components/layout/PageHeader";
import ComplaintTable from "@/components/complaint/ComplaintTable";
import Button from "@/components/ui/Button";

export default function OppositePartyDashboardPage() {
  const { fetchComplaints, loading, error } = useComplaints();

  const [complaints, setComplaints] = useState<any[]>([]);
  const [claimCaseId, setClaimCaseId] = useState("");
  const [claiming, setClaiming] = useState(false);
  const [claimMessage, setClaimMessage] = useState("");
  const [claimError, setClaimError] = useState("");

  async function loadComplaints() {
    const data = await fetchComplaints({ as: "opposite_party" });
    setComplaints(data);
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
        `/api/complaints/${normalizedCaseId}/link-opposite-party`,
        { method: "POST" }
      );
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to claim case");
      }

      setClaimCaseId("");
      setClaimMessage("Case linked to your account.");
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
        : { name: "Anonymous" },
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cases Against Me"
        subtitle="View complaints filed against you and submit your response."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border bg-white p-5 text-slate-900 shadow-sm">
          <p className="text-sm text-slate-500">Cases Against Me</p>
          <p className="mt-2 text-3xl font-semibold">{totalCases}</p>
        </div>

        <div className="rounded-2xl border bg-white p-5 text-slate-900 shadow-sm">
          <p className="text-sm text-slate-500">Responded</p>
          <p className="mt-2 text-3xl font-semibold">{responded}</p>
        </div>

        <div className="rounded-2xl border bg-white p-5 text-slate-900 shadow-sm">
          <p className="text-sm text-slate-500">Pending Response</p>
          <p className="mt-2 text-3xl font-semibold">{pendingResponse}</p>
        </div>
      </div>

      <section className="rounded-2xl border border-white/10 bg-white/5 p-5 text-white shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-base font-semibold">Claim a Case</h2>
            <p className="mt-1 text-sm text-slate-400">
              Enter a case ID if it was filed against your email but is not
              visible yet.
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row lg:max-w-xl">
            <input
              value={claimCaseId}
              onChange={(event) => setClaimCaseId(event.target.value)}
              placeholder="MC-2026-0001"
              className="min-w-0 flex-1 rounded-xl border border-white/10 bg-slate-950/60 px-4 py-2.5 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-400"
            />
            <Button
              type="button"
              onClick={claimCase}
              isLoading={claiming}
              disabled={claiming || !claimCaseId.trim()}
            >
              Claim
            </Button>
          </div>
        </div>

        {claimMessage && (
          <p className="mt-3 text-sm text-green-300">{claimMessage}</p>
        )}

        {claimError && (
          <p className="mt-3 text-sm text-rose-300">{claimError}</p>
        )}
      </section>

      {loading && <p className="text-sm text-slate-500">Loading complaints...</p>}

      {error && <p className="text-sm text-red-600">{error}</p>}

      {!loading && !error && (
        <ComplaintTable
          complaints={displayComplaints}
          viewBasePath="/opposite-party/cases"
        />
      )}
    </div>
  );
}
