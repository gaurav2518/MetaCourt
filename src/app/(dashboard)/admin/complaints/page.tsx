"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import PageHeader from "@/components/layout/PageHeader";
import ComplaintTable from "@/components/complaint/ComplaintTable";
import JurorAssignModal from "@/components/admin/JurorAssignModal";
import { CATEGORIES, PRIORITY, STATUS } from "@/constants";

export default function AdminComplaintsPage() {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [jurors, setJurors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("");
  const [search, setSearch] = useState("");

  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [updatingPriorityCaseId, setUpdatingPriorityCaseId] = useState<string | null>(null);

  async function loadComplaints() {
    try {
      setLoading(true);

      const res = await fetch("/api/complaints");
      const data = await res.json();

      if (res.ok) {
        setComplaints(data.complaints || []);
      }
    } finally {
      setLoading(false);
    }
  }

  async function loadJurors() {
    const res = await fetch("/api/admin/users?role=juror&limit=100");
    const data = await res.json();

    if (res.ok) {
      const verifiedJurors = (data.users || [])
        .filter((user: any) => user.isVerifiedJuror)
        .map((user: any) => ({
          ...user,
          activeCaseCount: user.activeCaseCount ?? 0,
        }));

      setJurors(verifiedJurors);
    }
  }

  useEffect(() => {
    loadComplaints();
    loadJurors();
  }, []);

  const filteredComplaints = useMemo(() => {
    return complaints.filter((complaint) => {
      const matchesStatus = status ? complaint.status === status : true;
      const matchesCategory = category ? complaint.category === category : true;
      const matchesPriority = priority ? complaint.priority === priority : true;

      const searchText = search.toLowerCase();

      const matchesSearch = search
        ? complaint.title?.toLowerCase().includes(searchText) ||
          complaint.caseId?.toLowerCase().includes(searchText)
        : true;

      return (
        matchesStatus &&
        matchesCategory &&
        matchesPriority &&
        matchesSearch
      );
    });
  }, [complaints, status, category, priority, search]);

  async function finalizeComplaint(caseId: string) {
    const res = await fetch(`/api/complaints/${caseId}/finalize`, {
      method: "POST",
    });

    if (res.ok) {
      loadComplaints();
    }
  }

  async function updateComplaintStatus(caseId: string, nextStatus: string) {
    const res = await fetch(`/api/complaints/${caseId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status: nextStatus,
      }),
    });

    if (res.ok) {
      loadComplaints();
    }
  }

  async function updateComplaintPriority(caseId: string, nextPriority: string) {
    try {
      setUpdatingPriorityCaseId(caseId);

      const res = await fetch(`/api/complaints/${caseId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priority: nextPriority,
        }),
      });

      if (res.ok) {
        setComplaints((currentComplaints) =>
          currentComplaints.map((complaint) =>
            complaint.caseId === caseId
              ? { ...complaint, priority: nextPriority }
              : complaint
          )
        );
      }
    } finally {
      setUpdatingPriorityCaseId(null);
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Complaint Management"
        subtitle="Review, filter, assign jurors, and finalize complaints."
      />

      <div className="grid gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-4 text-[var(--color-text-primary)] md:grid-cols-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search title or case ID"
          className="mc-input"
        />

        <select
          aria-label="Filter complaints by status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="mc-input"
        >
          <option value="">All Status</option>
          {Object.values(STATUS).map((item) => (
            <option key={item} value={item}>
              {item.replace("_", " ")}
            </option>
          ))}
        </select>

        <select
          aria-label="Filter complaints by category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="mc-input"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <select
          aria-label="Filter complaints by priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="mc-input"
        >
          <option value="">All Priority</option>
          {Object.values(PRIORITY).map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-8 text-center text-sm text-[var(--color-text-muted)]">
          Loading complaints...
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)]">
          <table className="w-full text-left text-sm">
            <thead className="bg-[var(--color-bg-secondary)] text-[var(--color-text-muted)]">
              <tr>
                <th className="w-[13%] p-4">Case ID</th>
                <th className="w-[34%] p-4">Title</th>
                <th className="w-[12%] p-4">Category</th>
                <th className="w-[12%] p-4">Status</th>
                <th className="w-[12%] p-4">Priority</th>
                <th className="w-[17%] p-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredComplaints.map((complaint) => (
                <tr key={complaint._id} className="border-t border-[var(--color-border-subtle)]">
                  <td className="p-4 font-medium">{complaint.caseId}</td>
                  <td className="p-4">{complaint.title}</td>
                  <td className="p-4 capitalize">{complaint.category}</td>
                  <td className="p-4 capitalize">
                    {complaint.status?.replace("_", " ")}
                  </td>
                  <td className="p-4">
                    <select
                      aria-label={`Change priority for ${complaint.caseId}`}
                      value={complaint.priority}
                      disabled={updatingPriorityCaseId === complaint.caseId}
                      onChange={(event) =>
                        updateComplaintPriority(
                          complaint.caseId,
                          event.target.value
                        )
                      }
                      className="h-9 w-28 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-primary)] px-3 text-xs font-medium capitalize text-[var(--color-text-primary)] outline-none transition focus:border-[var(--color-accent-primary)] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {Object.values(PRIORITY).map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td className="p-4">
                    <div className="flex flex-col gap-2">
                      <Link
                        href={`/admin/complaints/${complaint.caseId}`}
                        className="inline-flex h-8 w-full items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-primary)] px-3 text-xs font-medium text-[var(--color-text-primary)] transition hover:border-[var(--color-accent-primary)]"
                      >
                        View
                      </Link>

                      <div className="flex gap-2">
                        {complaint.status === STATUS.PENDING && (
                          <button
                            type="button"
                            onClick={() =>
                              updateComplaintStatus(
                                complaint.caseId,
                                STATUS.UNDER_REVIEW
                              )
                            }
                            className="inline-flex h-8 flex-1 items-center justify-center rounded-lg border border-[rgba(245,158,11,0.25)] bg-[rgba(245,158,11,0.08)] px-2 text-xs font-medium text-[var(--color-warning)] transition hover:bg-[rgba(245,158,11,0.14)]"
                          >
                            Review
                          </button>
                        )}

                        {[STATUS.PENDING, STATUS.UNDER_REVIEW].includes(
                          complaint.status
                        ) && (
                          <button
                            type="button"
                            onClick={() => setSelectedCaseId(complaint.caseId)}
                            className="inline-flex h-8 flex-1 items-center justify-center rounded-lg border border-[var(--color-accent-primary)] bg-[var(--color-accent-glow)] px-2 text-xs font-medium text-[var(--color-accent-primary)] transition hover:bg-[rgba(124,58,237,0.20)]"
                          >
                            Jurors
                          </button>
                        )}

                        {complaint.status === STATUS.VOTING && (
                          <button
                            type="button"
                            onClick={() => finalizeComplaint(complaint.caseId)}
                            className="inline-flex h-8 flex-1 items-center justify-center rounded-lg bg-[var(--color-gold)] px-2 text-xs font-medium text-[var(--color-bg-primary)] transition hover:opacity-90"
                          >
                            Finalize
                          </button>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredComplaints.length === 0 && (
            <div className="p-6 text-center text-sm text-[var(--color-text-muted)]">
              No complaints found.
            </div>
          )}
        </div>
      )}

      {selectedCaseId && (
        <JurorAssignModal
          open={Boolean(selectedCaseId)}
          caseId={selectedCaseId}
          jurors={jurors}
          onClose={() => setSelectedCaseId(null)}
          onAssigned={loadComplaints}
        />
      )}
    </div>
  );
}
