"use client";

import { API_BASE_URL } from "@/config/api";

import { useMemo, useState } from "react";
import { CheckCircle2, Gavel, Users, Award, Clock } from "lucide-react";

type Juror = {
  _id: string;
  name: string;
  email: string;
  reputationScore: number;
  activeCaseCount: number;
};

type JurorAssignModalProps = {
  open: boolean;
  onClose: () => void;
  caseId: string;
  jurors: Juror[];
  onAssigned?: () => void;
};

const DEADLINE_OPTIONS = [3, 5, 7];

export default function JurorAssignModal({
  open,
  onClose,
  caseId,
  jurors,
  onAssigned,
}: JurorAssignModalProps) {
  const [selectedJurors, setSelectedJurors] = useState<string[]>([]);
  const [deadline, setDeadline] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const sortedJurors = useMemo(
    () =>
      [...jurors].sort(
        (a, b) => b.reputationScore - a.reputationScore
      ),
    [jurors]
  );

  const isValidSelection = selectedJurors.length === 3 || selectedJurors.length === 5;

  if (!open) return null;

  function toggleJuror(jurorId: string) {
    setSelectedJurors((previous) => {
      if (previous.includes(jurorId)) {
        return previous.filter((id) => id !== jurorId);
      }

      if (previous.length >= 5) {
        return previous;
      }

      return [...previous, jurorId];
    });
  }

  async function assignJurors() {
    if (
      selectedJurors.length !== 3 &&
      selectedJurors.length !== 5
    ) {
      setError("Select exactly 3 or 5 jurors.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_BASE_URL}/api/complaints/${caseId}/assign-jurors`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            jurorIds: selectedJurors,
            votingDeadlineDays: deadline,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Assignment failed");
      }

      onAssigned?.();
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Assignment failed"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-5 backdrop-blur-sm">
      <div className="w-full max-w-3xl rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)] shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[var(--color-border)] p-6">
          <div>
            <h2 className="font-display text-xl font-semibold flex items-center gap-2">
              <Gavel className="h-5 w-5 text-[var(--color-accent-primary)]" />
              <span>Assign Community Jurors</span>
            </h2>

            <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
              Select either 3 jurors (Standard Panel) or 5 jurors (Full Panel).
            </p>
          </div>

          <div className="flex items-center gap-2">
            {isValidSelection ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[rgba(16,185,129,0.15)] px-3 py-1.5 text-xs font-bold text-[var(--color-success)] border border-[rgba(16,185,129,0.3)] shadow-[0_0_15px_rgba(16,185,129,0.2)] animate-pulse">
                <CheckCircle2 className="h-4 w-4" />
                <span>{selectedJurors.length === 3 ? "Standard Panel Ready (3/3)" : "Full Panel Ready (5/5)"}</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-bg-primary)] px-3 py-1.5 text-xs font-medium text-[var(--color-text-muted)] border border-[var(--color-border)]">
                <Users className="h-3.5 w-3.5" />
                <span>
                  {selectedJurors.length < 3
                    ? `${selectedJurors.length}/3 selected (Need ${3 - selectedJurors.length} more)`
                    : `${selectedJurors.length}/5 selected (Need 1 more for 5)`}
                </span>
              </span>
            )}
          </div>
        </div>

        <div className="max-h-[420px] overflow-y-auto p-6">
          <div className="space-y-3">
            {sortedJurors.length === 0 && (
              <div className="rounded-lg border border-dashed border-[var(--color-border)] p-5 text-sm text-[var(--color-text-muted)]">
                No verified jurors are available. Approve juror applications before assigning this case.
              </div>
            )}

            {sortedJurors.map((juror) => {
              const isSelected = selectedJurors.includes(juror._id);

              return (
                <label
                  key={juror._id}
                  className={`flex cursor-pointer items-center justify-between rounded-xl border p-4 transition-all duration-150 ${
                    isSelected
                      ? "border-[var(--color-accent-primary)] bg-[var(--color-accent-glow)] ring-1 ring-[var(--color-accent-primary)] shadow-[0_0_15px_rgba(124,58,237,0.15)]"
                      : "border-[var(--color-border)] bg-[var(--color-bg-primary)]/70 hover:border-[var(--color-border-subtle)] hover:bg-[var(--color-bg-secondary)]"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleJuror(juror._id)}
                      className="h-4 w-4 rounded border-[var(--color-border)] text-[var(--color-accent-primary)] focus:ring-[var(--color-accent-primary)]"
                    />

                    <div>
                      <div className="flex items-center gap-2">
                        <p className={`font-semibold text-sm ${isSelected ? "text-[var(--color-accent-primary)]" : "text-[var(--color-text-primary)]"}`}>
                          {juror.name}
                        </p>
                        {isSelected && (
                          <span className="rounded bg-[var(--color-accent-primary)]/20 px-1.5 py-0.2 text-[10px] font-bold text-[var(--color-accent-primary)]">
                            Selected
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-[var(--color-text-muted)]">
                        {juror.email}
                      </p>
                    </div>
                  </div>

                  <div className="text-right text-xs space-y-0.5">
                    <p className="font-semibold text-[var(--color-gold)] flex items-center justify-end gap-1">
                      <Award className="h-3 w-3" />
                      <span>Reputation: {juror.reputationScore}</span>
                    </p>

                    <p className="text-[var(--color-text-muted)]">
                      Active Cases: {juror.activeCaseCount}
                    </p>
                  </div>
                </label>
              );
            })}
          </div>

          <div className="mt-6 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] p-4">
            <label
              htmlFor="deadline"
              className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]"
            >
              <Clock className="h-3.5 w-3.5 text-[var(--color-gold)]" />
              <span>Voting & Deliberation Deadline</span>
            </label>

            <select
              id="deadline"
              value={deadline}
              onChange={(e) =>
                setDeadline(Number(e.target.value))
              }
              className="mc-input text-sm"
            >
              {DEADLINE_OPTIONS.map((day) => (
                <option key={day} value={day}>
                  {day} Days (Deliberation Period)
                </option>
              ))}
            </select>
          </div>

          {error && (
            <p className="mt-4 text-sm text-[var(--color-danger)] font-medium">
              {error}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-[var(--color-border)] p-6">
          <p className="text-xs text-[var(--color-text-muted)]">
            {isValidSelection
              ? "Panel criteria satisfied. You may proceed with juror assignment."
              : "Panel requires either exactly 3 or 5 verified jurors to balance the voting bench."}
          </p>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-xs font-medium text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-secondary)] hover:text-[var(--color-text-primary)] transition"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={!isValidSelection || loading}
              onClick={assignJurors}
              className={`rounded-xl px-5 py-2.5 text-xs font-bold transition duration-200 ${
                isValidSelection
                  ? "bg-gradient-to-r from-[var(--color-accent-primary)] to-[#8b5cf6] text-white shadow-[0_0_20px_rgba(124,58,237,0.5)] hover:brightness-110 active:scale-95 cursor-pointer ring-1 ring-white/20"
                  : "bg-[var(--color-bg-primary)] border border-[var(--color-border)] text-[var(--color-text-muted)] opacity-50 cursor-not-allowed"
              }`}
            >
              {loading
                ? "Assigning..."
                : isValidSelection
                ? `Assign ${selectedJurors.length} Jurors (Panel Ready)`
                : `Select 3 or 5 Jurors (${selectedJurors.length} selected)`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
