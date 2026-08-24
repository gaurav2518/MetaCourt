"use client";

type VotingHistoryProps = {
  votes: any[];
};

export default function VotingHistory({ votes }: VotingHistoryProps) {
  if (votes.length === 0) {
    return (
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6 text-sm text-[var(--color-text-secondary)]">
        No voting history available.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)]">
      <table className="w-full text-left text-sm">
        <thead className="bg-[var(--color-bg-secondary)] text-[var(--color-text-muted)]">
          <tr>
            <th className="p-4">Case ID</th>
            <th className="p-4">Category</th>
            <th className="p-4">My Vote</th>
            <th className="p-4">Final Decision</th>
            <th className="p-4">Reputation Change</th>
            <th className="p-4">Date</th>
          </tr>
        </thead>

        <tbody>
          {votes.map((item) => {
            const change = item.reputationChange ?? 0;

            return (
              <tr key={item._id} className="border-t border-[var(--color-border-subtle)]">
                <td className="p-4 font-medium">{item.caseId}</td>
                <td className="p-4 capitalize">{item.category}</td>
                <td className="p-4 capitalize">
                  {item.vote?.replace("_", " ")}
                </td>
                <td className="p-4 capitalize">
                  {item.finalDecision?.replace("_", " ")}
                </td>
                <td
                  className={`p-4 font-semibold ${
                    change >= 0 ? "text-[var(--color-success)]" : "text-[var(--color-danger)]"
                  }`}
                >
                  {change >= 0 ? `+${change}` : change}
                </td>
                <td className="p-4">
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
