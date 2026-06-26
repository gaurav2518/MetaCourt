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

const COLORS = ["#06b6d4", "#6366f1", "#22c55e", "#f59e0b", "#ef4444", "#64748b"];

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
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Cases Analytics</h2>
          <p className="text-sm text-slate-500">
            Category distribution and 30-day filing trend.
          </p>
        </div>

        <div className="rounded-xl bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => setActiveTab("category")}
            className={`rounded-lg px-3 py-1.5 text-sm ${
              activeTab === "category"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500"
            }`}
          >
            Category
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("daily")}
            className={`rounded-lg px-3 py-1.5 text-sm ${
              activeTab === "daily"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500"
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
                stroke="#06b6d4"
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
    <div className="flex h-full items-center justify-center rounded-xl bg-slate-50 text-sm text-slate-500">
      {message}
    </div>
  );
}