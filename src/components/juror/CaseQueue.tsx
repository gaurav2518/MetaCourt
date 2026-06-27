"use client";

import Link from "next/link";
import ComplaintStatus from "@/components/complaint/ComplaintStatus";

type CaseQueueProps = {
  cases: any[];
};

function daysRemaining(deadline?: string | Date) {
  if (!deadline) return "No deadline";

  const diff = new Date(deadline).getTime() - Date.now();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

  if (days < 0) return "Expired";
  if (days === 0) return "Due today";
  return `${days} day${days > 1 ? "s" : ""} remaining`;
}

export default function CaseQueue({ cases }: CaseQueueProps) {
  const sortedCases = [...cases].sort(
    (a, b) =>
      new Date(a.votingDeadline).getTime() -
      new Date(b.votingDeadline).getTime()
  );

  if (sortedCases.length === 0) {
    return (
      <div className="rounded-2xl border bg-white p-6 text-sm text-slate-500">
        No assigned voting cases right now.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border bg-white text-slate-900 shadow-sm">
      {sortedCases.map((item) => (
        <div
          key={item.caseId}
          className="grid gap-4 border-b p-4 last:border-b-0 md:grid-cols-6 md:items-center"
        >
          <div>
            <p className="text-xs text-slate-500">Case ID</p>
            <p className="font-medium">{item.caseId}</p>
          </div>

          <div>
            <p className="text-xs text-slate-500">Category</p>
            <p className="capitalize">{item.category}</p>
          </div>

          <div>
            <p className="text-xs text-slate-500">Deadline</p>
            <p>{daysRemaining(item.votingDeadline)}</p>
          </div>

          <div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium capitalize">
              {item.priority}
            </span>
          </div>

          <div>
            <ComplaintStatus status={item.hasVoted ? "decided" : "voting"} />
          </div>

          <Link
            href={`/juror/cases/${item.caseId}`}
            className="rounded-xl bg-black px-4 py-2 text-center text-sm font-medium text-white"
          >
            Review
          </Link>
        </div>
      ))}
    </div>
  );
}
