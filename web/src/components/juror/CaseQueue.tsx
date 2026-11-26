"use client";

import Link from "next/link";
import ComplaintStatus from "@/components/complaint/ComplaintStatus";
import { Gavel, Clock, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";

type CaseQueueProps = {
  cases: any[];
};

function daysRemaining(deadline?: string | Date) {
  if (!deadline) return "No deadline";

  const diff = new Date(deadline).getTime() - Date.now();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

  if (days < 0) return "Voting Expired";
  if (days === 0) return "Expires Today";
  return `${days} day${days > 1 ? "s" : ""} left`;
}

export default function CaseQueue({ cases }: CaseQueueProps) {
  const sortedCases = [...cases].sort(
    (a, b) =>
      new Date(a.votingDeadline).getTime() -
      new Date(b.votingDeadline).getTime()
  );

  if (sortedCases.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/90 p-12 text-center backdrop-blur-xl">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-accent-glow)] text-[var(--color-accent-primary)] mb-4 shadow-inner">
          <Gavel className="h-7 w-7" />
        </div>
        <h3 className="font-display text-lg font-bold text-[var(--color-text-primary)]">
          Your Voting Docket is Clear
        </h3>
        <p className="mt-2 max-w-md text-xs leading-5 text-[var(--color-text-secondary)]">
          There are currently no dispute cases assigned to your juror queue. When new cases are filed and reach the voting phase, they will appear here automatically.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/90 backdrop-blur-xl divide-y divide-[var(--color-border-subtle)]">
      {sortedCases.map((item) => {
        const isExpiringSoon = daysRemaining(item.votingDeadline).includes("Today");

        return (
          <div
            key={item.caseId}
            className="grid gap-4 p-5 transition duration-150 hover:bg-[var(--color-bg-elevated)] md:grid-cols-6 md:items-center"
          >
            <div>
              <p className="mc-label">Case Identifier</p>
              <p className="font-mono text-sm font-bold text-[var(--color-gold)] mt-0.5">
                {item.caseId}
              </p>
            </div>

            <div className="md:col-span-2">
              <p className="mc-label">Dispute Title / Category</p>
              <p className="text-sm font-semibold text-[var(--color-text-primary)] truncate mt-0.5">
                {item.title || "Dispute Case"}
              </p>
              <span className="text-xs text-[var(--color-text-muted)] capitalize">
                {item.category?.replace("_", " ")}
              </span>
            </div>

            <div>
              <p className="mc-label">Deliberation Window</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Clock className={`h-3.5 w-3.5 ${isExpiringSoon ? "text-[var(--color-warning)]" : "text-[var(--color-text-muted)]"}`} />
                <span className={`text-xs font-medium ${isExpiringSoon ? "text-[var(--color-warning)]" : "text-[var(--color-text-secondary)]"}`}>
                  {daysRemaining(item.votingDeadline)}
                </span>
              </div>
            </div>

            <div>
              <p className="mc-label">Status</p>
              <div className="mt-1">
                {item.hasVoted ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[rgba(16,185,129,0.15)] px-2.5 py-0.5 text-xs font-semibold text-[var(--color-success)]">
                    <CheckCircle2 className="h-3 w-3" />
                    Vote Cast
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-accent-glow)] px-2.5 py-0.5 text-xs font-semibold text-[var(--color-accent-primary)]">
                    Voting Open
                  </span>
                )}
              </div>
            </div>

            <div className="flex justify-end">
              <Link
                href={`/juror/cases/${item.caseId}`}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--color-accent-primary)] px-4 py-2 text-xs font-semibold text-white shadow-md transition hover:bg-[var(--color-accent-hover)]"
              >
                <span>{item.hasVoted ? "Review Verdict" : "Deliberate & Vote"}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
