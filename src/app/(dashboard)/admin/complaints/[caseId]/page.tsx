"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import HashProof from "@/components/blockchain/HashProof";
import ComplaintStatus from "@/components/complaint/ComplaintStatus";
import EvidenceViewer from "@/components/complaint/EvidenceViewer";
import TimelineTracker from "@/components/complaint/TimelineTracker";
import PageHeader from "@/components/layout/PageHeader";
import type { UploadedEvidenceFile } from "@/hooks/useUpload";

type TimelineEvent = {
  id: string;
  status: string;
  timestamp: string;
  note?: string;
};

function normalizeEvidence(files: any[] = []): UploadedEvidenceFile[] {
  return files.map((file) => ({
    url: file.url ?? file.fileUrl ?? "",
    publicId:
      file.publicId ?? file.public_id ?? file._id?.toString() ?? file.fileUrl,
    fileType: file.fileType ?? "document",
    fileName: file.fileName ?? "uploaded-file",
    fileSize: file.fileSize ?? 0,
  }));
}

function formatDate(value?: string | Date | null) {
  if (!value) return "Not available";
  return new Date(value).toLocaleString();
}

export default function AdminComplaintDetailPage() {
  const params = useParams();
  const caseId = params.caseId as string;

  const [complaint, setComplaint] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadComplaint() {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(`/api/complaints/${caseId}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to load complaint");
      }

      setComplaint(data.complaint);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load complaint");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (caseId) loadComplaint();
  }, [caseId]);

  const timelineEvents = useMemo<TimelineEvent[]>(() => {
    if (!complaint) return [];

    const events: TimelineEvent[] = [
      {
        id: "created",
        status: "Filed",
        timestamp: complaint.createdAt,
        note: "Complaint was submitted to MetaCourt.",
      },
    ];

    if (complaint.updatedAt && complaint.updatedAt !== complaint.createdAt) {
      events.push({
        id: "updated",
        status: complaint.status?.replace("_", " ") ?? "Updated",
        timestamp: complaint.updatedAt,
        note: "Latest case status update.",
      });
    }

    if (complaint.decidedAt) {
      events.push({
        id: "decided",
        status: "Decision finalized",
        timestamp: complaint.decidedAt,
        note: `Final decision: ${complaint.decision ?? "not recorded"}.`,
      });
    }

    return events;
  }, [complaint]);

  if (loading) {
    return <p className="text-sm text-slate-400">Loading complaint...</p>;
  }

  if (error || !complaint) {
    return (
      <div className="space-y-4">
        <PageHeader title="Complaint not found" subtitle={caseId} />
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-5 text-sm text-red-200">
          {error || "Complaint not found."}
        </div>
      </div>
    );
  }

  const evidence = normalizeEvidence(complaint.evidence);
  const defenseEvidence = normalizeEvidence(complaint.defenseEvidence);

  return (
    <div className="space-y-6">
      <PageHeader
        title={complaint.title}
        subtitle={`Case ID: ${complaint.caseId}`}
        action={
          <Link
            href="/admin/complaints"
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
          >
            Back
          </Link>
        }
      />

      <section className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-slate-200">
          <div className="flex flex-wrap items-center gap-3">
            <ComplaintStatus status={complaint.status} />
            <span className="rounded-full border border-white/10 px-3 py-1 text-xs capitalize text-slate-300">
              {complaint.category}
            </span>
            <span className="rounded-full border border-white/10 px-3 py-1 text-xs capitalize text-slate-300">
              {complaint.priority} priority
            </span>
          </div>

          <p className="mt-5 whitespace-pre-wrap text-sm leading-7 text-slate-300">
            {complaint.description}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-slate-300">
          <h2 className="text-base font-semibold text-white">Case Parties</h2>

          <dl className="mt-4 space-y-3">
            <div>
              <dt className="text-xs uppercase tracking-[0.2em] text-slate-500">
                Complainant
              </dt>
              <dd className="mt-1 text-white">
                {complaint.complainantId?.name ?? "Unknown"}
              </dd>
              <dd className="text-xs text-slate-400">
                {complaint.complainantId?.email ?? "No email"}
              </dd>
            </div>

            <div>
              <dt className="text-xs uppercase tracking-[0.2em] text-slate-500">
                Opposite Party
              </dt>
              <dd className="mt-1 text-white">
                {complaint.oppositeParty?.userId?.name ??
                  complaint.oppositeParty?.name ??
                  "Not linked"}
              </dd>
              <dd className="text-xs text-slate-400">
                {complaint.oppositeParty?.userId?.email ??
                  complaint.oppositeParty?.email ??
                  "No email"}
              </dd>
            </div>

            <div>
              <dt className="text-xs uppercase tracking-[0.2em] text-slate-500">
                Filed
              </dt>
              <dd className="mt-1 text-white">
                {formatDate(complaint.createdAt)}
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <EvidenceViewer files={evidence} title="Complainant Evidence" />
        <EvidenceViewer
          files={defenseEvidence}
          title="Defense Evidence"
          emptyMessage="No defense evidence has been uploaded yet."
        />
      </section>

      <section className="grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
        <TimelineTracker events={timelineEvents} />
        <HashProof
          caseId={complaint.caseId}
          complaintHash={complaint.complaintHash}
          blockchainTxHash={complaint.blockchainTxHash}
        />
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <h2 className="text-base font-semibold text-white">
          Assigned Jurors
        </h2>

        {complaint.assignedJurors?.length ? (
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {complaint.assignedJurors.map((juror: any) => (
              <div
                key={juror._id ?? juror}
                className="rounded-xl border border-white/10 bg-slate-950/40 p-4"
              >
                <p className="font-medium text-white">
                  {juror.name ?? "Assigned juror"}
                </p>
                <p className="mt-1 text-xs capitalize text-slate-400">
                  {juror.jurorLevel ?? "juror"} level
                </p>
                <p className="mt-2 text-xs text-slate-500">
                  Reputation: {juror.reputationScore ?? 100}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-sm text-slate-400">
            No jurors assigned yet.
          </p>
        )}
      </section>
    </div>
  );
}
