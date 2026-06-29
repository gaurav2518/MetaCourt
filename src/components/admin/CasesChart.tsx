"use client";

import { useMemo, useState } from "react";
import {
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type CountItem = {
  _id: string;
  count: number;
};

type CasesChartProps = {
  casesByCategory: CountItem[];
  casesPerDay: CountItem[];
};

const COLORS = ["#7c3aed", "#d4af37", "#10b981", "#f59e0b", "#ef4444", "#64748b"];

export default function CasesChart({
  casesByCategory,
  casesPerDay,
}: CasesChartProps) {
  const [activeTab, setActiveTab] = useState<"category" | "daily">("category");

  const categoryData = useMemo(
    () =>
      casesByCategory.map((item) => ({
        name: item._id,
        value: item.count,
      })),
    [casesByCategory]
  );

  const dailyData = useMemo(
    () =>
      casesPerDay.map((item) => ({
        date: item._id,
        count: item.count,
      })),
    [casesPerDay]
  );

  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5 text-[var(--color-text-primary)]">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="font-display text-lg font-semibold text-[var(--color-text-primary)]">Cases Analytics</h2>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Category distribution and 30-day filing trend.
          </p>
        </div>

        <div className="rounded-lg bg-[var(--color-bg-secondary)] p-1">
          <button
            type="button"
            onClick={() => setActiveTab("category")}
            className={`rounded-lg px-3 py-1.5 text-sm ${
              activeTab === "category"
                ? "bg-[var(--color-accent-primary)] text-white"
                : "text-[var(--color-text-muted)]"
            }`}
          >
            Category
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("daily")}
            className={`rounded-lg px-3 py-1.5 text-sm ${
              activeTab === "daily"
                ? "bg-[var(--color-accent-primary)] text-white"
                : "text-[var(--color-text-muted)]"
            }`}
          >
            Last 30 days
          </button>
        </div>
      </div>

      <div className="h-80">
        {activeTab === "category" ? (
          categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={4}
                >
                  {categoryData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChart message="No category data available." />
          )
        ) : dailyData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dailyData}>
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#7c3aed"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <EmptyChart message="No daily case data available." />
        )}
      </div>
    </div>
  );
}

function EmptyChart({ message }: { message: string }) {
  return (
    <div className="flex h-full items-center justify-center rounded-lg bg-[var(--color-bg-secondary)] text-sm text-[var(--color-text-muted)]">
      {message}
    </div>
  );
}
