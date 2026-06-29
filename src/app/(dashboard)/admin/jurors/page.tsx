"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import Modal from "@/components/ui/Modal";

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
    const res = await fetch("/api/admin/jurors?status=pending");
    const data = await res.json();

    if (res.ok) {
      setApplications(data.applications || []);
    }
  }

  async function loadJurors() {
    const res = await fetch("/api/admin/users?role=juror&limit=100");
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
    const res = await fetch(`/api/admin/jurors/${userId}/verify`, {
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
      const res = await fetch(`/api/admin/jurors/cases?jurorId=${jurorId}`);
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
    return <p className="text-sm text-[var(--color-text-muted)]">Loading juror management...</p>;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Juror Management"
        subtitle="Review applications and monitor verified jurors."
      />

      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-2 text-[var(--color-text-primary)]">
        <button
          type="button"
          onClick={() => setActiveTab("pending")}
          className={`rounded-xl px-4 py-2 text-sm ${
            activeTab === "pending"
              ? "bg-[var(--color-accent-primary)] text-white"
              : "text-[var(--color-text-muted)]"
          }`}
        >
          Pending Applications
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("active")}
          className={`rounded-xl px-4 py-2 text-sm ${
            activeTab === "active"
              ? "bg-[var(--color-accent-primary)] text-white"
              : "text-[var(--color-text-muted)]"
          }`}
        >
          Active Jurors
        </button>
      </div>

      {activeTab === "pending" && (
        <div className="space-y-4">
          {applications.length === 0 && (
            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-6 text-sm text-[var(--color-text-muted)]">
              No pending juror applications.
            </div>
          )}

          {applications.map((application) => {
            const applicant = application.userId;

            return (
              <div
                key={application._id}
                className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5 text-[var(--color-text-primary)]"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h3 className="font-semibold text-[var(--color-text-primary)]">
                      {applicant?.name}
                    </h3>
                    <p className="text-sm text-[var(--color-text-muted)]">
                      {applicant?.email}
                    </p>

                    <div className="mt-4">
                      <p className="text-sm font-medium">Reason</p>
                      <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                        {application.reason}
                      </p>
                    </div>

                    <div className="mt-4">
                      <p className="text-sm font-medium">Experience</p>
                      <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                        {application.experience || "No experience provided."}
                      </p>
                    </div>
                  </div>

                  <div className="w-full max-w-xs space-y-3">
                    <textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Optional review note"
                      className="mc-input w-full"
                      rows={3}
                    />

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          reviewApplication(applicant._id, "approve")
                        }
                        className="flex-1 rounded-lg bg-[var(--color-success)] px-4 py-2 text-sm font-medium text-white"
                      >
                        Approve
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          reviewApplication(applicant._id, "reject")
                        }
                        className="flex-1 rounded-lg bg-[var(--color-danger)] px-4 py-2 text-sm font-medium text-white"
                      >
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

      {activeTab === "active" && (
        <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)]">
          <table className="w-full text-left text-sm">
            <thead className="bg-[var(--color-bg-secondary)] text-[var(--color-text-muted)]">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Reputation</th>
                <th className="p-4">Level</th>
                <th className="p-4">Case Count</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {jurors.map((juror) => (
                <tr key={juror._id} className="border-t border-[var(--color-border-subtle)]">
                  <td className="p-4 font-medium">{juror.name}</td>
                  <td className="p-4 text-[var(--color-text-secondary)]">{juror.email}</td>
                  <td className="p-4">{juror.reputationScore ?? 100}</td>
                  <td className="p-4 capitalize">{juror.jurorLevel}</td>
                  <td className="p-4">{juror.activeCaseCount ?? "-"}</td>
                  <td className="p-4">
                    <button
                      type="button"
                      onClick={() => openJurorCases(juror)}
                      className="rounded-lg border border-[var(--color-border)] px-3 py-1.5 text-xs font-medium text-[var(--color-text-primary)] hover:border-[var(--color-accent-primary)]"
                    >
                      View Cases
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {jurors.length === 0 && (
            <div className="p-6 text-center text-sm text-[var(--color-text-muted)]">
              No active jurors found.
            </div>
          )}
        </div>
      )}

      <Modal
        isOpen={Boolean(selectedJuror)}
        onClose={closeJurorCases}
        title={selectedJuror ? `${selectedJuror.name}'s Cases` : "Juror Cases"}
        className="max-w-3xl"
      >
        {casesLoading && (
          <p className="text-sm text-[var(--color-text-muted)]">Loading assigned cases...</p>
        )}

        {casesError && (
          <div className="rounded-lg border border-[rgba(239,68,68,0.25)] bg-[rgba(239,68,68,0.12)] p-4 text-sm text-[var(--color-danger)]">
            {casesError}
          </div>
        )}

        {!casesLoading && !casesError && jurorCases.length === 0 && (
          <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-5 text-sm text-[var(--color-text-muted)]">
            No assigned cases found for this juror.
          </div>
        )}

        {!casesLoading && jurorCases.length > 0 && (
          <div className="overflow-hidden rounded-lg border border-[var(--color-border)]">
            <table className="w-full text-left text-sm">
              <thead className="bg-[var(--color-bg-secondary)] text-[var(--color-text-muted)]">
                <tr>
                  <th className="p-3">Case</th>
                  <th className="p-3">Title</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Decision</th>
                </tr>
              </thead>
              <tbody>
                {jurorCases.map((item) => (
                  <tr key={item._id} className="border-t border-[var(--color-border-subtle)]">
                    <td className="p-3 font-medium text-[var(--color-text-primary)]">
                      {item.caseId}
                    </td>
                    <td className="p-3 text-[var(--color-text-secondary)]">{item.title}</td>
                    <td className="p-3 capitalize text-[var(--color-text-secondary)]">
                      {item.status?.replace("_", " ")}
                    </td>
                    <td className="p-3 capitalize text-[var(--color-text-secondary)]">
                      {item.decision ?? "pending"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Modal>
    </div>
  );
}
