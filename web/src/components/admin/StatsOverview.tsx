"use client";

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
  const stats = [
    { label: "Total Cases", value: totalCases },
    { label: "Pending Review", value: pendingReview },
    { label: "Active Voting", value: activeVoting },
    { label: "Decided", value: decided },
    { label: "Total Users", value: totalUsers },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5 text-[var(--color-text-primary)]"
        >
          <p className="text-sm text-[var(--color-text-secondary)]">{stat.label}</p>
          <p className="mt-2 font-display text-3xl font-semibold text-[var(--color-text-primary)]">
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
}
