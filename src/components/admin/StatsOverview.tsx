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
          className="rounded-2xl border border-slate-200 bg-white p-5 text-slate-900 shadow-sm"
        >
          <p className="text-sm text-slate-500">{stat.label}</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
}
