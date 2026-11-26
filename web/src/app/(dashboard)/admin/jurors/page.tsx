"use client";

import { API_BASE_URL } from "@/config/api";

import { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import {
  UserCheck,
  ShieldCheck,
  Award,
  Clock,
  Check,
  X,
  FileText,
  AlertCircle,
  Briefcase,
} from "lucide-react";

type JurorCase = {
  _id: string;
  caseId: string;
  title: string;
  status: string;
  category: string;
  decision?: string;
  votingDeadline?: string;
  createdAt?: string;
};

export default function AdminJurorsPage() {
  const [activeTab, setActiveTab] = useState<"pending" | "active">("pending");
  const [applications, setApplications] = useState<any[]>([]);
  const [jurors, setJurors] = useState<any[]>([]);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedJuror, setSelectedJuror] = useState<any | null>(null);
  const [jurorCases, setJurorCases] = useState<JurorCase[]>([]);
  const [casesLoading, setCasesLoading] = useState(false);
  const [casesError, setCasesError] = useState("");

  async function loadApplications() {
    const res = await fetch(`${API_BASE_URL}/api/admin/jurors?status=pending`);
    const data = await res.json();

    if (res.ok) {
      setApplications(data.applications || []);
    }
  }

  async function loadJurors() {
    const res = await fetch(`${API_BASE_URL}/api/admin/users?role=juror&limit=100`);
    const data = await res.json();

    if (res.ok) {
      setJurors(data.users || []);
    }
  }

  async function loadData() {
    try {
      setLoading(true);
      await Promise.all([loadApplications(), loadJurors()]);
    } finally {
      setLoading(false);
    }
  }

  async function reviewApplication(userId: string, action: "approve" | "reject") {
    const res = await fetch(`${API_BASE_URL}/api/admin/jurors/${userId}/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action,
        note,
      }),
    });

    if (res.ok) {
      setNote("");
      loadData();
    }
  }

  async function openJurorCases(juror: any) {
    try {
      setSelectedJuror(juror);
      setJurorCases([]);
      setCasesError("");
      setCasesLoading(true);

      const jurorId = juror._id || juror.id;
      const res = await fetch(`${API_BASE_URL}/api/admin/jurors/cases?jurorId=${jurorId}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch juror cases");
      }

      setJurorCases(data.cases || []);
    } catch (error) {
      setCasesError(
        error instanceof Error ? error.message : "Failed to fetch juror cases"
      );
    } finally {
      setCasesLoading(false);
    }
  }

  function closeJurorCases() {
    setSelectedJuror(null);
    setJurorCases([]);
    setCasesError("");
  }

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center space-y-3">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--color-accent-primary)] border-t-transparent" />
        <p className="text-sm text-[var(--color-text-secondary)]">Loading juror management registry...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/90 p-6 backdrop-blur-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-[var(--color-gold)] animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-gold)]">
              Court Personnel
            </span>
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">
            Community Juror Administration
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Vetting incoming juror applications, inspect active juror workloads, and manage dispute review rights.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] px-3.5 py-2 font-mono text-xs text-[var(--color-gold)]">
            {applications.length} Pending
          </span>
          <span className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] px-3.5 py-2 font-mono text-xs text-[var(--color-success)]">
            {jurors.length} Active Jurors
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/90 p-1.5 backdrop-blur-xl">
        <button
          type="button"
          onClick={() => setActiveTab("pending")}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition ${
            activeTab === "pending"
              ? "bg-[var(--color-accent-primary)] text-white shadow-sm"
              : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
          }`}
        >
          <Clock className="h-3.5 w-3.5" />
          <span>Pending Applications ({applications.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("active")}
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition ${
            activeTab === "active"
              ? "bg-[var(--color-accent-primary)] text-white shadow-sm"
              : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
          }`}
        >
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>Active Verified Jurors ({jurors.length})</span>
        </button>
      </div>

      {/* Pending Applications Tab */}
      {activeTab === "pending" && (
        <div className="space-y-4">
          {applications.length === 0 && (
            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/90 p-12 text-center backdrop-blur-xl">
              <Check className="mx-auto h-10 w-10 text-[var(--color-success)] mb-3" />
              <h3 className="font-display text-base font-bold text-[var(--color-text-primary)]">
                All Applications Reviewed
              </h3>
              <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
                There are no pending juror applications awaiting administrator review.
              </p>
            </div>
          )}

          {applications.map((application) => {
            const applicant = application.userId;

            return (
              <div
                key={application._id}
                className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/90 p-6 backdrop-blur-xl transition hover:border-[var(--color-accent-primary)]/40"
              >
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-4 flex-1">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-display text-lg font-bold text-[var(--color-text-primary)]">
                          {applicant?.name || "Applicant"}
                        </h3>
                        <span className="rounded-full bg-[var(--color-bg-elevated)] px-2.5 py-0.5 text-xs text-[var(--color-text-muted)] font-mono">
                          {applicant?.email}
                        </span>
                      </div>
                      <p className="text-xs text-[var(--color-text-muted)] mt-1">
                        Applied on {new Date(application.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-primary)] p-4 space-y-1">
                      <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-gold)]">
                        Statement of Purpose & Neutrality
                      </p>
                      <p className="text-xs leading-6 text-[var(--color-text-secondary)]">
                        {application.reason}
                      </p>
                    </div>

                    {application.experience && (
                      <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-primary)] p-4 space-y-1">
                        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                          Relevant Experience / Background
                        </p>
                        <p className="text-xs leading-6 text-[var(--color-text-secondary)]">
                          {application.experience}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Review Action Box */}
                  <div className="w-full lg:max-w-xs rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] p-4 space-y-3 shrink-0">
                    <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                      Admin Decision
                    </p>

                    <textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Optional review note (sent to applicant)"
                      className="mc-input w-full p-2.5 text-xs"
                      rows={3}
                    />

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => reviewApplication(applicant._id, "approve")}
                        className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-[var(--color-success)] px-3 py-2 text-xs font-bold text-white transition hover:opacity-90"
                      >
                        <Check className="h-3.5 w-3.5" />
                        Approve
                      </button>

                      <button
                        type="button"
                        onClick={() => reviewApplication(applicant._id, "reject")}
                        className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-[var(--color-danger)] px-3 py-2 text-xs font-bold text-white transition hover:opacity-90"
                      >
                        <X className="h-3.5 w-3.5" />
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Active Jurors Tab */}
      {activeTab === "active" && (
        <div className="overflow-x-auto rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/90 backdrop-blur-xl">
          <table className="w-full text-left text-sm text-[var(--color-text-secondary)]">
            <thead className="bg-[var(--color-bg-elevated)] text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] border-b border-[var(--color-border-subtle)]">
              <tr>
                <th className="p-4">Juror Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Reputation Score</th>
                <th className="p-4">Tier Level</th>
                <th className="p-4">Vote Accuracy</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[var(--color-border-subtle)]">
              {jurors.map((juror) => (
                <tr key={juror._id} className="transition hover:bg-[var(--color-bg-elevated)]">
                  <td className="p-4 font-semibold text-[var(--color-text-primary)]">
                    {juror.name}
                  </td>
                  <td className="p-4 font-mono text-xs text-[var(--color-text-muted)]">
                    {juror.email}
                  </td>
                  <td className="p-4 font-mono font-bold text-[var(--color-gold)]">
                    {juror.reputationScore ?? 100} pts
                  </td>
                  <td className="p-4 capitalize">
                    <span className="rounded-full bg-[var(--color-accent-glow)] px-2.5 py-0.5 text-xs font-semibold text-[var(--color-accent-primary)]">
                      {juror.jurorLevel ?? "Junior"}
                    </span>
                  </td>
                  <td className="p-4 font-medium text-[var(--color-text-primary)]">
                    {juror.totalVotes > 0
                      ? `${Math.round((juror.correctVotes / juror.totalVotes) * 100)}% (${juror.correctVotes}/${juror.totalVotes})`
                      : "New Juror"}
                  </td>
                  <td className="p-4 text-right">
                    <button
                      type="button"
                      onClick={() => openJurorCases(juror)}
                      className="inline-flex items-center gap-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-primary)] px-3 py-1.5 text-xs font-semibold text-[var(--color-text-primary)] transition hover:bg-[var(--color-bg-elevated)]"
                    >
                      <Briefcase className="h-3.5 w-3.5 text-[var(--color-accent-primary)]" />
                      <span>Assigned Cases</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {jurors.length === 0 && (
            <div className="p-12 text-center text-sm text-[var(--color-text-muted)]">
              No active jurors enrolled in the platform.
            </div>
          )}
        </div>
      )}

      {/* Juror Cases Modal */}
      {selectedJuror && (
        <Modal
          isOpen={Boolean(selectedJuror)}
          onClose={closeJurorCases}
          title={`Assigned Cases: ${selectedJuror.name}`}
        >
          <div className="space-y-4">
            {casesLoading ? (
              <p className="text-xs text-[var(--color-text-muted)]">Loading juror cases...</p>
            ) : casesError ? (
              <p className="text-xs text-[var(--color-danger)]">{casesError}</p>
            ) : jurorCases.length === 0 ? (
              <p className="text-xs text-[var(--color-text-muted)]">No cases currently assigned to this juror.</p>
            ) : (
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {jurorCases.map((c) => (
                  <div key={c._id} className="rounded-lg border border-[var(--color-border)] p-3 text-xs flex justify-between items-center">
                    <div>
                      <p className="font-mono font-bold text-[var(--color-gold)]">{c.caseId}</p>
                      <p className="text-[var(--color-text-primary)] font-medium mt-0.5">{c.title}</p>
                    </div>
                    <span className="rounded-full bg-[var(--color-bg-elevated)] px-2.5 py-0.5 capitalize">
                      {c.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
