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
    return <p className="text-sm text-slate-500">Loading juror management...</p>;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Juror Management"
        subtitle="Review applications and monitor verified jurors."
      />

      <div className="rounded-2xl border bg-white p-2 text-slate-900 shadow-sm">
        <button
          type="button"
          onClick={() => setActiveTab("pending")}
          className={`rounded-xl px-4 py-2 text-sm ${
            activeTab === "pending"
              ? "bg-black text-white"
              : "text-slate-600"
          }`}
        >
          Pending Applications
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("active")}
          className={`rounded-xl px-4 py-2 text-sm ${
            activeTab === "active"
              ? "bg-black text-white"
              : "text-slate-600"
          }`}
        >
          Active Jurors
        </button>
      </div>

      {activeTab === "pending" && (
        <div className="space-y-4">
          {applications.length === 0 && (
            <div className="rounded-2xl border bg-white p-6 text-sm text-slate-500">
              No pending juror applications.
            </div>
          )}

          {applications.map((application) => {
            const applicant = application.userId;

            return (
              <div
                key={application._id}
                className="rounded-2xl border bg-white p-5 text-slate-900 shadow-sm"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-900">
                      {applicant?.name}
                    </h3>
                    <p className="text-sm text-slate-500">
                      {applicant?.email}
                    </p>

                    <div className="mt-4">
                      <p className="text-sm font-medium">Reason</p>
                      <p className="mt-1 text-sm text-slate-600">
                        {application.reason}
                      </p>
                    </div>

                    <div className="mt-4">
                      <p className="text-sm font-medium">Experience</p>
                      <p className="mt-1 text-sm text-slate-600">
                        {application.experience || "No experience provided."}
                      </p>
                    </div>
                  </div>

                  <div className="w-full max-w-xs space-y-3">
                    <textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Optional review note"
                      className="w-full rounded-xl border px-3 py-2 text-sm"
                      rows={3}
                    />

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          reviewApplication(applicant._id, "approve")
                        }
                        className="flex-1 rounded-xl bg-green-600 px-4 py-2 text-sm font-medium text-white"
                      >
                        Approve
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          reviewApplication(applicant._id, "reject")
                        }
                        className="flex-1 rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white"
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
        <div className="overflow-hidden rounded-2xl border bg-white text-slate-900 shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
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
                <tr key={juror._id} className="border-t">
                  <td className="p-4 font-medium">{juror.name}</td>
                  <td className="p-4 text-slate-600">{juror.email}</td>
                  <td className="p-4">{juror.reputationScore ?? 100}</td>
                  <td className="p-4 capitalize">{juror.jurorLevel}</td>
                  <td className="p-4">{juror.activeCaseCount ?? "-"}</td>
                  <td className="p-4">
                    <button
                      type="button"
                      onClick={() => openJurorCases(juror)}
                      className="rounded-lg border px-3 py-1.5 text-xs font-medium"
                    >
                      View Cases
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {jurors.length === 0 && (
            <div className="p-6 text-center text-sm text-slate-500">
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
          <p className="text-sm text-slate-400">Loading assigned cases...</p>
        )}

        {casesError && (
          <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm text-rose-200">
            {casesError}
          </div>
        )}

        {!casesLoading && !casesError && jurorCases.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-slate-400">
            No assigned cases found for this juror.
          </div>
        )}

        {!casesLoading && jurorCases.length > 0 && (
          <div className="overflow-hidden rounded-2xl border border-white/10">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/5 text-slate-400">
                <tr>
                  <th className="p-3">Case</th>
                  <th className="p-3">Title</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Decision</th>
                </tr>
              </thead>
              <tbody>
                {jurorCases.map((item) => (
                  <tr key={item._id} className="border-t border-white/10">
                    <td className="p-3 font-medium text-white">
                      {item.caseId}
                    </td>
                    <td className="p-3 text-slate-300">{item.title}</td>
                    <td className="p-3 capitalize text-slate-300">
                      {item.status?.replace("_", " ")}
                    </td>
                    <td className="p-3 capitalize text-slate-300">
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
