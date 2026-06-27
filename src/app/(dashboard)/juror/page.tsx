"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import ReputationCard from "@/components/juror/ReputationCard";
import CaseQueue from "@/components/juror/CaseQueue";
import { useAuth } from "@/context/AuthContext";

export default function JurorDashboardPage() {
  const { user } = useAuth();
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCases() {
      try {
        const res = await fetch("/api/juror/cases");
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
      <PageHeader
        title="Juror Dashboard"
        subtitle="Review assigned cases and cast anonymous votes."
      />

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard title="Assigned Cases" value={assignedCases} />
        <StatCard title="Pending Votes" value={pendingVotes} />
        <StatCard title="Completed Votes" value={completedVotes} />
        <StatCard title="Reputation Score" value={user?.reputationScore ?? 100} />
      </div>

      <ReputationCard
        reputationScore={user?.reputationScore ?? 100}
        jurorLevel={user?.jurorLevel ?? "junior"}
        correctVotes={user?.correctVotes ?? 0}
        totalVotes={user?.totalVotes ?? 0}
      />

      {loading ? (
        <p className="text-sm text-slate-500">Loading assigned cases...</p>
      ) : (
        <CaseQueue cases={cases} />
      )}
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="rounded-2xl border bg-white p-5 text-slate-900 shadow-sm">
      <p className="text-sm text-slate-500">{title}</p>
      <p className="mt-2 text-3xl font-semibold text-slate-900">{value}</p>
    </div>
  );
}
