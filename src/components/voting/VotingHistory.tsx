"use client";

type VotingHistoryProps = {
  votes: any[];
};

export default function VotingHistory({ votes }: VotingHistoryProps) {
  if (votes.length === 0) {
    return (
      <div className="rounded-2xl border bg-white p-6 text-sm text-slate-500">
        No voting history available.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border bg-white text-slate-900 shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-slate-500">
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
              <tr key={item._id} className="border-t">
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
                    change >= 0 ? "text-green-600" : "text-red-600"
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
