"use client";

import { useMemo, useState } from "react";

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

      const response = await fetch(
        `/api/complaints/${caseId}/assign-jurors`,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-5">
      <div className="w-full max-w-3xl rounded-2xl bg-white text-slate-900 shadow-xl">
        <div className="border-b p-6">
          <h2 className="text-xl font-semibold">
            Assign Jurors
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Select either 3 or 5 verified jurors.
          </p>
        </div>

        <div className="max-h-[420px] overflow-y-auto p-6">
          <div className="space-y-3">
            {sortedJurors.length === 0 && (
              <div className="rounded-xl border border-dashed p-5 text-sm text-slate-500">
                No verified jurors are available. Approve juror applications before assigning this case.
              </div>
            )}

            {sortedJurors.map((juror) => (
              <label
                key={juror._id}
                className="flex cursor-pointer items-center justify-between rounded-xl border p-4 hover:bg-slate-50"
              >
                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    checked={selectedJurors.includes(juror._id)}
                    onChange={() => toggleJuror(juror._id)}
                  />

                  <div>
                    <p className="font-medium">
                      {juror.name}
                    </p>

                    <p className="text-sm text-slate-500">
                      {juror.email}
                    </p>
                  </div>
                </div>

                <div className="text-right text-sm">
                  <p>
                    Reputation:{" "}
                    <strong>
                      {juror.reputationScore}
                    </strong>
                  </p>

                  <p className="text-slate-500">
                    Active Cases:{" "}
                    {juror.activeCaseCount}
                  </p>
                </div>
              </label>
            ))}
          </div>

          <div className="mt-6">
            <label
              htmlFor="deadline"
              className="mb-2 block text-sm font-medium"
            >
              Voting Deadline
            </label>

            <select
              id="deadline"
              value={deadline}
              onChange={(e) =>
                setDeadline(Number(e.target.value))
              }
              className="rounded-xl border px-4 py-2"
            >
              {DEADLINE_OPTIONS.map((day) => (
                <option key={day} value={day}>
                  {day} Days
                </option>
              ))}
            </select>
          </div>

          {error && (
            <p className="mt-4 text-sm text-red-600">
              {error}
            </p>
          )}
        </div>

        <div className="flex justify-end gap-3 border-t p-6">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border px-4 py-2"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={assignJurors}
            className="rounded-xl bg-black px-5 py-2 text-white disabled:opacity-60"
          >
            {loading ? "Assigning..." : "Assign Jurors"}
          </button>
        </div>
      </div>
    </div>
  );
}
