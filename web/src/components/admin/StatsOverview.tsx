"use client";

import StatCard from "@/components/ui/StatCard";
import { FolderKanban, Clock, Vote, CheckCircle2, Users } from "lucide-react";

type StatsOverviewProps = {
  totalCases: number;
  pendingReview: number;
  activeVoting: number;
  decided: number;
  totalUsers: number;
};

export default function StatsOverview({
  totalCases,
  pendingReview,
  activeVoting,
  decided,
  totalUsers,
}: StatsOverviewProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      <StatCard
        label="Total Cases"
        value={totalCases}
        icon={FolderKanban}
        iconColor="accent"
        description="All filed disputes"
      />

      <StatCard
        label="Pending Review"
        value={pendingReview}
        icon={Clock}
        iconColor="info"
        description="Awaiting juror allocation"
      />

      <StatCard
        label="Active Voting"
        value={activeVoting}
        icon={Vote}
        iconColor="gold"
        description="In jury deliberation"
      />

      <StatCard
        label="Decided Cases"
        value={decided}
        icon={CheckCircle2}
        iconColor="success"
        description="Verdicts locked on-chain"
      />

      <StatCard
        label="Registered Users"
        value={totalUsers}
        icon={Users}
        iconColor="indigo"
        description="Complainants & Jurors"
      />
    </div>
  );
}
