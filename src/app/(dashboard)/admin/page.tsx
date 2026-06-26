"use client";

import { useEffect, useMemo, useState } from "react";

import PageHeader from "@/components/layout/PageHeader";
import StatsOverview from "@/components/admin/StatsOverview";
import CasesChart from "@/components/admin/CasesChart";
import { STATUS } from "@/constants";

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

      const res = await fetch("/api/admin/stats");
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
    return <p className="text-sm text-slate-500">Loading admin dashboard...</p>;
  }

  if (error) {
    return <p className="text-sm text-red-600">{error}</p>;
  }

  if (!stats) {
    return <p className="text-sm text-slate-500">No statistics available.</p>;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin Dashboard"
        subtitle="Monitor complaints, users, jurors, and platform activity."
      />

      <StatsOverview
        totalCases={totalCases}
        pendingReview={getStatusCount(STATUS.UNDER_REVIEW)}
        activeVoting={getStatusCount(STATUS.VOTING)}
        decided={getStatusCount(STATUS.DECIDED)}
        totalUsers={totalUsers}
      />

      <CasesChart
        casesByCategory={stats.casesByCategory}
        casesPerDay={stats.casesPerDay}
      />

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm text-slate-500">Pending Juror Applications</p>
        <p className="mt-2 text-3xl font-semibold text-slate-900">
          {stats.pendingJurorApplications}
        </p>
      </div>
    </div>
  );
}