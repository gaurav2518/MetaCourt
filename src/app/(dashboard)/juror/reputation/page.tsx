"use client";

import PageHeader from "@/components/layout/PageHeader";
import ReputationCard from "@/components/juror/ReputationCard";
import { useAuth } from "@/context/AuthContext";

export default function JurorReputationPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Juror Reputation"
        subtitle="Track your score, level, accuracy, and voting trust."
      />

      <ReputationCard
        reputationScore={user?.reputationScore ?? 100}
        jurorLevel={user?.jurorLevel ?? "junior"}
        correctVotes={user?.correctVotes ?? 0}
        totalVotes={user?.totalVotes ?? 0}
      />

      <div className="overflow-hidden rounded-2xl border bg-white text-slate-900 shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="p-4">Level</th>
              <th className="p-4">Score Range</th>
              <th className="p-4">Benefits</th>
              <th className="p-4">Vote Weight</th>
            </tr>
          </thead>

          <tbody>
            <tr className="border-t">
              <td className="p-4 font-medium">Junior</td>
              <td className="p-4">0 - 149</td>
              <td className="p-4">Can vote on assigned cases</td>
              <td className="p-4">1x</td>
            </tr>

            <tr className="border-t">
              <td className="p-4 font-medium">Senior</td>
              <td className="p-4">150 - 199</td>
              <td className="p-4">Trusted juror with stronger voting weight</td>
              <td className="p-4">2x</td>
            </tr>

            <tr className="border-t">
              <td className="p-4 font-medium">Master</td>
              <td className="p-4">200+</td>
              <td className="p-4">Highest trust level in MetaCourt</td>
              <td className="p-4">2x</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
