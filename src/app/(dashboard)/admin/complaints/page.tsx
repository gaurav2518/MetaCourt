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

  return (
    <div className="space-y-6">
      <PageHeader
        title="Complaint Management"
        subtitle="Review, filter, assign jurors, and finalize complaints."
      />

      <div className="grid gap-3 rounded-2xl border bg-white p-4 shadow-sm md:grid-cols-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search title or case ID"
          className="rounded-xl border px-4 py-2"
        />

        <select
          aria-label="Filter complaints by status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-xl border px-4 py-2"
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
          className="rounded-xl border px-4 py-2"
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
          className="rounded-xl border px-4 py-2"
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
        <div className="rounded-2xl border bg-white p-8 text-center text-sm text-slate-500">
          Loading complaints...
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="p-4">Case ID</th>
                <th className="p-4">Title</th>
                <th className="p-4">Category</th>
                <th className="p-4">Status</th>
                <th className="p-4">Priority</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredComplaints.map((complaint) => (
                <tr key={complaint._id} className="border-t">
                  <td className="p-4 font-medium">{complaint.caseId}</td>
                  <td className="p-4">{complaint.title}</td>
                  <td className="p-4 capitalize">{complaint.category}</td>
                  <td className="p-4 capitalize">
                    {complaint.status?.replace("_", " ")}
                  </td>
                  <td className="p-4 capitalize">{complaint.priority}</td>

                  <td className="p-4">
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={`/complainant/cases/${complaint.caseId}`}
                        className="rounded-lg border px-3 py-1.5 text-xs font-medium"
                      >
                        View
                      </Link>

                      {complaint.status === STATUS.UNDER_REVIEW && (
                        <button
                          type="button"
                          onClick={() => setSelectedCaseId(complaint.caseId)}
                          className="rounded-lg bg-cyan-600 px-3 py-1.5 text-xs font-medium text-white"
                        >
                          Assign Jurors
                        </button>
                      )}

                      {complaint.status === STATUS.VOTING && (
                        <button
                          type="button"
                          onClick={() => finalizeComplaint(complaint.caseId)}
                          className="rounded-lg bg-black px-3 py-1.5 text-xs font-medium text-white"
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
            <div className="p-6 text-center text-sm text-slate-500">
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