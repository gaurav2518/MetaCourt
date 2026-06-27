"use client";
import {JUROR_LEVELS} from "@/constants";

type ReputationCardProps = {
  reputationScore: number;
  jurorLevel: typeof JUROR_LEVELS[keyof typeof JUROR_LEVELS];
  correctVotes: number;
  totalVotes: number;
};

const LEVEL_COLORS = {
  [JUROR_LEVELS.JUNIOR]: "bg-blue-100 text-blue-700",
  [JUROR_LEVELS.SENIOR]: "bg-amber-100 text-amber-700",
  [JUROR_LEVELS.MASTER]: "bg-purple-100 text-purple-700",
};

export default function ReputationCard({
  reputationScore,
  jurorLevel,
  correctVotes,
  totalVotes,
}: ReputationCardProps) {
  const accuracy =
    totalVotes === 0 ? 0 : Math.round((correctVotes / totalVotes) * 100);

  let progress = 100;
  let nextLevel = "Maximum";

  if (jurorLevel === JUROR_LEVELS.JUNIOR) {
    progress = Math.min((reputationScore / 150) * 100, 100);
    nextLevel = JUROR_LEVELS.SENIOR;
  } else if (jurorLevel === JUROR_LEVELS.SENIOR ) {
    progress = Math.min(((reputationScore - 150) / 50) * 100, 100);
    nextLevel = JUROR_LEVELS.MASTER;
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-900 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500">Reputation Score</p>

          <h2 className="mt-2 text-5xl font-bold text-slate-900">
            {reputationScore}
          </h2>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-sm font-semibold capitalize ${
            LEVEL_COLORS[jurorLevel]
          }`}
        >
          {jurorLevel}
        </span>
      </div>

      <div className="mt-8">
        <div className="mb-2 flex justify-between text-sm">
          <span className="text-slate-600">
            Progress to {nextLevel}
          </span>

          <span className="font-medium text-slate-700">
            {Math.round(progress)}%
          </span>
        </div>

        <div className="h-3 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-cyan-600 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4">
        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-sm text-slate-500">Correct Votes</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">
            {correctVotes}
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-4">
          <p className="text-sm text-slate-500">Accuracy</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">
            {accuracy}%
          </p>
        </div>
      </div>
    </div>
  );
}
