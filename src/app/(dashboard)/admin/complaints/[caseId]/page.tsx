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
  const [repairingHash, setRepairingHash] = useState(false);
  const [repairMessage, setRepairMessage] = useState("");
  const [repairError, setRepairError] = useState("");

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

  async function storeHashOnChain() {
    try {
      setRepairingHash(true);
      setRepairMessage("");
      setRepairError("");

      const res = await fetch("/api/blockchain/store-hash", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          caseId: complaint.caseId,
          complaintHash: complaint.complaintHash || undefined,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to store hash on-chain");
      }

      setComplaint(data.complaint ?? complaint);
      setRepairMessage(`Blockchain transaction recorded: ${data.txHash}`);
    } catch (err) {
      setRepairError(
        err instanceof Error ? err.message : "Failed to store hash on-chain"
      );
    } finally {
      setRepairingHash(false);
    }
  }

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
    return <p className="text-sm text-[var(--color-text-muted)]">Loading complaint...</p>;
  }

  if (error || !complaint) {
    return (
      <div className="space-y-4">
        <PageHeader title="Complaint not found" subtitle={caseId} />
        <div className="rounded-xl border border-[rgba(239,68,68,0.25)] bg-[rgba(239,68,68,0.12)] p-5 text-sm text-[var(--color-danger)]">
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
            className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-4 py-2 text-sm font-medium text-[var(--color-text-primary)] transition hover:border-[var(--color-accent-primary)]"
          >
            Back
          </Link>
        }
      />

      <section className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5 text-[var(--color-text-secondary)]">
          <div className="flex flex-wrap items-center gap-3">
            <ComplaintStatus status={complaint.status} />
            <span className="rounded-full border border-[var(--color-border)] px-3 py-1 text-xs capitalize text-[var(--color-text-secondary)]">
              {complaint.category}
            </span>
            <span className="rounded-full border border-[var(--color-border)] px-3 py-1 text-xs capitalize text-[var(--color-text-secondary)]">
              {complaint.priority} priority
            </span>
          </div>

          <p className="mt-5 whitespace-pre-wrap text-sm leading-7 text-[var(--color-text-secondary)]">
            {complaint.description}
          </p>
        </div>

        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5 text-sm text-[var(--color-text-secondary)]">
          <h2 className="font-display text-base font-semibold text-[var(--color-text-primary)]">Case Parties</h2>

          <dl className="mt-4 space-y-3">
            <div>
              <dt className="text-xs uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
                Complainant
              </dt>
              <dd className="mt-1 text-[var(--color-text-primary)]">
                {complaint.complainantId?.name ?? "Unknown"}
              </dd>
              <dd className="text-xs text-[var(--color-text-muted)]">
                {complaint.complainantId?.email ?? "No email"}
              </dd>
            </div>

            <div>
              <dt className="text-xs uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
                Opposite Party
              </dt>
              <dd className="mt-1 text-[var(--color-text-primary)]">
                {complaint.oppositeParty?.userId?.name ??
                  complaint.oppositeParty?.name ??
                  "Not linked"}
              </dd>
              <dd className="text-xs text-[var(--color-text-muted)]">
                {complaint.oppositeParty?.userId?.email ??
                  complaint.oppositeParty?.email ??
                  "No email"}
              </dd>
            </div>

            <div>
              <dt className="text-xs uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
                Filed
              </dt>
              <dd className="mt-1 text-[var(--color-text-primary)]">
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
        <div className="space-y-4">
          <HashProof
            caseId={complaint.caseId}
            complaintHash={complaint.complaintHash}
            blockchainTxHash={complaint.blockchainTxHash}
          />

          {!complaint.blockchainTxHash && (
            <div className="rounded-xl border border-[rgba(245,158,11,0.25)] bg-[rgba(245,158,11,0.12)] p-5 text-[var(--color-warning)]">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">
                    Blockchain Registration Needed
                  </h2>
                  <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                    Store this complaint hash on-chain if automatic filing did
                    not complete.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={storeHashOnChain}
                  disabled={repairingHash}
                  className="rounded-lg bg-[var(--color-gold)] px-4 py-2 text-sm font-semibold text-[var(--color-bg-primary)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {repairingHash ? "Storing..." : "Store Hash"}
                </button>
              </div>

              {repairMessage && (
                <p className="mt-3 break-all text-sm text-[var(--color-success)]">
                  {repairMessage}
                </p>
              )}

              {repairError && (
                <p className="mt-3 text-sm text-[var(--color-danger)]">{repairError}</p>
              )}
            </div>
          )}
        </div>
      </section>

      <section className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-5">
        <h2 className="font-display text-base font-semibold text-[var(--color-text-primary)]">
          Assigned Jurors
        </h2>

        {complaint.assignedJurors?.length ? (
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {complaint.assignedJurors.map((juror: any) => (
              <div
                key={juror._id ?? juror}
                className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-4"
              >
                <p className="font-medium text-[var(--color-text-primary)]">
                  {juror.name ?? "Assigned juror"}
                </p>
                <p className="mt-1 text-xs capitalize text-[var(--color-text-muted)]">
                  {juror.jurorLevel ?? "juror"} level
                </p>
                <p className="mt-2 text-xs text-[var(--color-text-muted)]">
                  Reputation: {juror.reputationScore ?? 100}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-sm text-[var(--color-text-muted)]">
            No jurors assigned yet.
          </p>
        )}
      </section>
    </div>
  );
}
