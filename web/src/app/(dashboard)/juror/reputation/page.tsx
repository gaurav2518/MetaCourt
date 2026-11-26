"use client";

import ReputationCard from "@/components/juror/ReputationCard";
import { useAuth } from "@/context/AuthContext";
import {
  Award,
  TrendingUp,
  ShieldAlert,
  Scale,
  CheckCircle2,
  AlertTriangle,
  Zap,
} from "lucide-react";

export default function JurorReputationPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/90 p-6 backdrop-blur-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-[var(--color-accent-primary)] animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-gold)]">
              Credibility Engine
            </span>
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">
            Juror Reputation & Ranking
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Understand how your voting accuracy drives reputation score, tier progression, and voting weight multiplier.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-[var(--color-gold)]/30 bg-[var(--color-gold-subtle)] px-4 py-2 text-xs font-semibold text-[var(--color-gold)]">
          <Award className="h-4 w-4" />
          <span className="capitalize">{user?.jurorLevel ?? "Junior"} Tier</span>
        </div>
      </div>

      {/* Primary Reputation Card */}
      <ReputationCard
        reputationScore={user?.reputationScore ?? 100}
        jurorLevel={user?.jurorLevel ?? "junior"}
        correctVotes={user?.correctVotes ?? 0}
        totalVotes={user?.totalVotes ?? 0}
      />

      {/* Tier Matrix Table */}
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/90 p-6 backdrop-blur-xl space-y-4">
        <div>
          <h2 className="font-display text-lg font-bold text-[var(--color-text-primary)]">
            Juror Tier Progression Matrix
          </h2>
          <p className="text-xs text-[var(--color-text-secondary)]">
            Higher tier jurors hold greater voting authority in contentious dispute resolutions.
          </p>
        </div>

        <div className="overflow-x-auto rounded-xl border border-[var(--color-border-subtle)]">
          <table className="w-full text-left text-sm text-[var(--color-text-secondary)]">
            <thead className="bg-[var(--color-bg-elevated)] text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] border-b border-[var(--color-border-subtle)]">
              <tr>
                <th className="p-4">Rank / Tier</th>
                <th className="p-4">Reputation Range</th>
                <th className="p-4">Voting Power</th>
                <th className="p-4">Privileges & Allocations</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[var(--color-border-subtle)]">
              <tr className="transition hover:bg-[var(--color-bg-elevated)]">
                <td className="p-4">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[rgba(59,130,246,0.15)] px-3 py-1 text-xs font-semibold text-[var(--color-info)]">
                    Junior Juror
                  </span>
                </td>
                <td className="p-4 font-mono font-medium">0 - 149 pts</td>
                <td className="p-4 font-bold text-[var(--color-text-primary)]">1.0x Weight</td>
                <td className="p-4 text-xs">Assigned standard commercial and consumer dispute claims</td>
              </tr>

              <tr className="transition hover:bg-[var(--color-bg-elevated)]">
                <td className="p-4">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-gold-subtle)] px-3 py-1 text-xs font-semibold text-[var(--color-gold)]">
                    Senior Juror
                  </span>
                </td>
                <td className="p-4 font-mono font-medium">150 - 199 pts</td>
                <td className="p-4 font-bold text-[var(--color-gold)]">2.0x Weight</td>
                <td className="p-4 text-xs">Eligible for high-priority appeals and complex contract disputes</td>
              </tr>

              <tr className="transition hover:bg-[var(--color-bg-elevated)]">
                <td className="p-4">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-accent-glow)] px-3 py-1 text-xs font-semibold text-[var(--color-accent-primary)]">
                    Master Juror
                  </span>
                </td>
                <td className="p-4 font-mono font-medium">200+ pts</td>
                <td className="p-4 font-bold text-[var(--color-accent-primary)]">2.0x Weight + Tiebreaker</td>
                <td className="p-4 text-xs">Highest credibility standing; priority allocation across all high-value cases</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Scoring Mechanics & Code of Conduct */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/90 p-6 backdrop-blur-xl space-y-3">
          <h3 className="font-display text-base font-bold text-[var(--color-text-primary)] flex items-center gap-2">
            <Zap className="h-4 w-4 text-[var(--color-gold)]" />
            Reputation Scoring Mechanics
          </h3>
          <p className="text-xs leading-6 text-[var(--color-text-secondary)]">
            MetaCourt enforces automated Schelling point game-theoretic incentives:
          </p>
          <ul className="space-y-2 text-xs text-[var(--color-text-secondary)]">
            <li className="flex items-center gap-2">
              <span className="font-mono font-bold text-[var(--color-success)]">+10 Points:</span>
              <span>Vote matches the final jury consensus verdict.</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="font-mono font-bold text-[var(--color-danger)]">-5 Points:</span>
              <span>Vote directly contradicts the final supermajority decision.</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="font-mono font-bold text-[var(--color-warning)]">-2 Points:</span>
              <span>Failure to cast vote before the assigned case deadline.</span>
            </li>
          </ul>
        </div>

        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/90 p-6 backdrop-blur-xl space-y-3">
          <h3 className="font-display text-base font-bold text-[var(--color-text-primary)] flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-[var(--color-danger)]" />
            Integrity & Slashing Rules
          </h3>
          <p className="text-xs leading-6 text-[var(--color-text-secondary)]">
            To preserve decentralized court validity, accounts violating standards face immediate suspension:
          </p>
          <ul className="space-y-2 text-xs text-[var(--color-text-secondary)]">
            <li className="flex items-start gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-danger)] mt-1.5 shrink-0" />
              <span>Collusion, bribery, or coordinated voting results in permanent expulsion.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-danger)] mt-1.5 shrink-0" />
              <span>Jurors falling below 50 reputation points lose case voting privileges.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-danger)] mt-1.5 shrink-0" />
              <span>All deliberation logs are permanently archived on the immutable ledger.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
