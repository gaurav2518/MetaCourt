"use client";

import { useEffect, useState } from "react";

import { useComplaints } from "@/hooks/useComplaints";
import PageHeader from "@/components/layout/PageHeader";
import ComplaintTable from "@/components/complaint/ComplaintTable";

export default function OppositePartyDashboardPage() {
  const { fetchComplaints, loading, error } = useComplaints();

  const [complaints, setComplaints] = useState<any[]>([]);

  useEffect(() => {
    async function loadComplaints() {
      const data = await fetchComplaints({ as: "opposite_party" });
      setComplaints(data);
    }

    loadComplaints();
  }, []);

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
