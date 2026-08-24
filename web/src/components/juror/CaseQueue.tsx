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
      <div className="mc-card p-6 text-sm text-[var(--color-text-secondary)]">
        No assigned voting cases right now.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
      {sortedCases.map((item) => (
        <div
          key={item.caseId}
          className="grid gap-4 border-b border-[var(--color-border-subtle)] p-4 transition duration-100 last:border-b-0 hover:bg-[var(--color-bg-elevated)] md:grid-cols-6 md:items-center"
        >
          <div>
            <p className="mc-label">Case ID</p>
            <p className="font-medium text-[var(--color-text-primary)]">{item.caseId}</p>
          </div>

          <div>
            <p className="mc-label">Category</p>
            <p className="capitalize text-[var(--color-text-secondary)]">{item.category}</p>
          </div>

          <div>
            <p className="mc-label">Deadline</p>
            <p className="text-[var(--color-text-secondary)]">{daysRemaining(item.votingDeadline)}</p>
          </div>

          <div>
            <span className="rounded-full bg-[var(--color-gold-subtle)] px-3 py-1 text-xs font-medium capitalize text-[var(--color-gold)]">
              {item.priority}
            </span>
          </div>

          <div>
            <ComplaintStatus status={item.hasVoted ? "decided" : "voting"} />
          </div>

          <Link
            href={`/juror/cases/${item.caseId}`}
            className="rounded-lg bg-[var(--color-accent-primary)] px-4 py-2 text-center text-sm font-medium text-white transition hover:bg-[var(--color-accent-hover)]"
          >
            Review
          </Link>
        </div>
      ))}
    </div>
  );
}
