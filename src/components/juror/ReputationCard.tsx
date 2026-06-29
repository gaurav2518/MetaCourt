"use client";
import {JUROR_LEVELS} from "@/constants";

type ReputationCardProps = {
  reputationScore: number;
  jurorLevel: typeof JUROR_LEVELS[keyof typeof JUROR_LEVELS];
  correctVotes: number;
  totalVotes: number;
};

const LEVEL_COLORS = {
  [JUROR_LEVELS.JUNIOR]: "bg-[rgba(59,130,246,0.15)] text-[var(--color-info)]",
  [JUROR_LEVELS.SENIOR]: "bg-[var(--color-gold-subtle)] text-[var(--color-gold)]",
  [JUROR_LEVELS.MASTER]: "bg-[var(--color-accent-glow)] text-[var(--color-accent-primary)]",
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
    <div className="mc-card p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="mc-label">Reputation Score</p>

          <h2 className="mt-2 font-display text-5xl font-bold text-[var(--color-text-primary)]">
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
          <span className="text-[var(--color-text-secondary)]">
            Progress to {nextLevel}
          </span>

          <span className="font-medium text-[var(--color-text-primary)]">
            {Math.round(progress)}%
          </span>
        </div>

        <div className="h-3 overflow-hidden rounded-full bg-[var(--color-bg-elevated)]">
          <div
            className="h-full rounded-full bg-[var(--color-accent-primary)] transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4">
        <div className="rounded-lg bg-[var(--color-bg-primary)] p-4">
          <p className="text-sm text-[var(--color-text-muted)]">Correct Votes</p>
          <p className="mt-1 font-display text-2xl font-semibold text-[var(--color-text-primary)]">
            {correctVotes}
          </p>
        </div>

        <div className="rounded-lg bg-[var(--color-bg-primary)] p-4">
          <p className="text-sm text-[var(--color-text-muted)]">Accuracy</p>
          <p className="mt-1 font-display text-2xl font-semibold text-[var(--color-text-primary)]">
            {accuracy}%
          </p>
        </div>
      </div>
    </div>
  );
}
