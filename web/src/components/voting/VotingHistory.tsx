"use client";

import Link from "next/link";
import { History, Award, CheckCircle2, XCircle, FileQuestion, ArrowRight } from "lucide-react";

type VotingHistoryProps = {
  votes: any[];
};

export default function VotingHistory({ votes }: VotingHistoryProps) {
  if (votes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-accent-glow)] text-[var(--color-accent-primary)] mb-4">
          <History className="h-7 w-7" />
        </div>
        <h3 className="font-display text-base font-bold text-[var(--color-text-primary)]">
          No Voting History Recorded Yet
        </h3>
        <p className="mt-1.5 max-w-sm text-xs leading-5 text-[var(--color-text-secondary)]">
          Once you cast your vote on assigned disputes and those cases reach a finalized decision, your deliberation record will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-[var(--color-border-subtle)]">
      <table className="w-full text-left text-sm text-[var(--color-text-secondary)]">
        <thead className="bg-[var(--color-bg-elevated)] text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] border-b border-[var(--color-border-subtle)]">
          <tr>
            <th className="p-4">Case ID</th>
            <th className="p-4">Category</th>
            <th className="p-4">My Vote</th>
            <th className="p-4">Final Verdict</th>
            <th className="p-4">Reputation Delta</th>
            <th className="p-4">Date Recorded</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-[var(--color-border-subtle)]">
          {votes.map((item) => {
            const change = item.reputationChange ?? 0;
            const myVote = (item.vote || "").toLowerCase();
            const finalDec = (item.finalDecision || "").toLowerCase();

            return (
              <tr key={item._id} className="transition hover:bg-[var(--color-bg-elevated)]">
                <td className="p-4 font-mono font-bold text-[var(--color-gold)]">
                  <Link href={`/juror/cases/${item.caseId}`} className="hover:underline">
                    {item.caseId}
                  </Link>
                </td>
                <td className="p-4 capitalize text-[var(--color-text-primary)] font-medium">
                  {item.category?.replace("_", " ") || "Dispute"}
                </td>
                <td className="p-4">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${
                      myVote.includes("valid") && !myVote.includes("invalid")
                        ? "bg-[rgba(16,185,129,0.15)] text-[var(--color-success)]"
                        : myVote.includes("invalid")
                        ? "bg-[rgba(239,68,68,0.15)] text-[var(--color-danger)]"
                        : "bg-[rgba(245,158,11,0.15)] text-[var(--color-warning)]"
                    }`}
                  >
                    {item.vote?.replace("_", " ")}
                  </span>
                </td>
                <td className="p-4">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${
                      finalDec.includes("valid") && !finalDec.includes("invalid")
                        ? "bg-[rgba(16,185,129,0.15)] text-[var(--color-success)]"
                        : finalDec.includes("invalid")
                        ? "bg-[rgba(239,68,68,0.15)] text-[var(--color-danger)]"
                        : "bg-[rgba(245,158,11,0.15)] text-[var(--color-warning)]"
                    }`}
                  >
                    {item.finalDecision?.replace("_", " ") || "Pending"}
                  </span>
                </td>
                <td className="p-4 font-mono font-bold">
                  <span
                    className={
                      change > 0
                        ? "text-[var(--color-success)]"
                        : change < 0
                        ? "text-[var(--color-danger)]"
                        : "text-[var(--color-text-muted)]"
                    }
                  >
                    {change > 0 ? `+${change} pts` : change < 0 ? `${change} pts` : "0 pts"}
                  </span>
                </td>
                <td className="p-4 text-xs text-[var(--color-text-muted)]">
                  {new Date(item.createdAt).toLocaleDateString()}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
