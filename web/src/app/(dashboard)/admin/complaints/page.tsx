"use client";

import { API_BASE_URL } from "@/config/api";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  FolderKanban,
  Search,
  Filter,
  Users,
  CheckCircle2,
  Clock,
  ArrowRight,
  Gavel,
} from "lucide-react";

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

      const res = await fetch(`${API_BASE_URL}/api/complaints`);
      const data = await res.json();

      if (res.ok) {
        setComplaints(data.complaints || []);
      }
    } finally {
      setLoading(false);
    }
  }

  async function loadJurors() {
    const res = await fetch(`${API_BASE_URL}/api/admin/users?role=juror&limit=100`);
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
    const res = await fetch(`${API_BASE_URL}/api/complaints/${caseId}/finalize`, {
      method: "POST",
    });

    if (res.ok) {
      loadComplaints();
    }
  }

  async function updateComplaintStatus(caseId: string, nextStatus: string) {
    const res = await fetch(`${API_BASE_URL}/api/complaints/${caseId}`, {
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

      const res = await fetch(`${API_BASE_URL}/api/complaints/${caseId}`, {
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
      {/* Header Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/90 p-6 backdrop-blur-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-[var(--color-accent-primary)] animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-gold)]">
              Case Operations
            </span>
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">
            Complaint & Dispute Registry
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Search, filter by status, adjust priorities, assign verified jurors, and finalize on-chain verdicts.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] px-4 py-2 font-mono text-xs text-[var(--color-text-secondary)]">
          <span>Total: {complaints.length} Records</span>
        </div>
      </div>

      {/* Modern Filter Bar */}
      <div className="grid gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/90 p-4 backdrop-blur-xl md:grid-cols-4">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search title or case ID..."
            className="mc-input pl-10 pr-4 py-2 text-sm"
          />
        </div>

        <select
          aria-label="Filter complaints by status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="mc-input py-2 text-sm"
        >
          <option value="">All Statuses</option>
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
          className="mc-input py-2 text-sm"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map((item) => (
            <option key={item} value={item}>
              {item.replace("_", " ")}
            </option>
          ))}
        </select>

        <select
          aria-label="Filter complaints by priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="mc-input py-2 text-sm"
        >
          <option value="">All Priorities</option>
          {Object.values(PRIORITY).map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      {/* Main Table */}
      {loading ? (
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-12 text-center text-sm text-[var(--color-text-muted)]">
          Loading dispute records...
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/90 backdrop-blur-xl">
          <table className="w-full text-left text-sm text-[var(--color-text-secondary)]">
            <thead className="bg-[var(--color-bg-elevated)] text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] border-b border-[var(--color-border-subtle)]">
              <tr>
                <th className="p-4">Case ID</th>
                <th className="p-4">Dispute Title</th>
                <th className="p-4">Category</th>
                <th className="p-4">Status</th>
                <th className="p-4">Priority</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[var(--color-border-subtle)]">
              {filteredComplaints.map((complaint) => (
                <tr key={complaint._id} className="transition hover:bg-[var(--color-bg-elevated)]">
                  <td className="p-4 font-mono font-bold text-[var(--color-gold)]">
                    {complaint.caseId}
                  </td>
                  <td className="p-4 font-medium text-[var(--color-text-primary)] max-w-xs truncate">
                    {complaint.title}
                  </td>
                  <td className="p-4 capitalize text-xs">
                    {complaint.category?.replace("_", " ")}
                  </td>
                  <td className="p-4 capitalize text-xs">
                    <span className="rounded-full bg-[var(--color-bg-primary)] px-2.5 py-1 text-xs border border-[var(--color-border-subtle)] font-medium">
                      {complaint.status?.replace("_", " ")}
                    </span>
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
                      className="h-8 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-primary)] px-2.5 text-xs font-medium capitalize text-[var(--color-text-primary)] outline-none transition focus:border-[var(--color-accent-primary)] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {Object.values(PRIORITY).map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/complaints/${complaint.caseId}`}
                        className="inline-flex h-8 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-primary)] px-3 text-xs font-semibold text-[var(--color-text-primary)] transition hover:bg-[var(--color-bg-elevated)]"
                      >
                        Inspect
                      </Link>

                      {complaint.status === STATUS.PENDING && (
                        <button
                          type="button"
                          onClick={() =>
                            updateComplaintStatus(
                              complaint.caseId,
                              STATUS.UNDER_REVIEW
                            )
                          }
                          className="inline-flex h-8 items-center justify-center rounded-lg border border-[rgba(245,158,11,0.3)] bg-[rgba(245,158,11,0.1)] px-3 text-xs font-semibold text-[var(--color-warning)] transition hover:bg-[rgba(245,158,11,0.2)]"
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
                          className="inline-flex h-8 items-center justify-center rounded-lg bg-[var(--color-accent-primary)] px-3 text-xs font-semibold text-white shadow-sm transition hover:bg-[var(--color-accent-hover)]"
                        >
                          Assign Jurors
                        </button>
                      )}

                      {complaint.status === STATUS.VOTING && (
                        <button
                          type="button"
                          onClick={() => finalizeComplaint(complaint.caseId)}
                          className="inline-flex h-8 items-center justify-center rounded-lg bg-[var(--color-gold)] px-3 text-xs font-bold text-black transition hover:opacity-90"
                        >
                          Finalize
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredComplaints.length === 0 && (
            <div className="p-12 text-center text-sm text-[var(--color-text-muted)]">
              No matching dispute records found.
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
