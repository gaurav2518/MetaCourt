"use client";

import { API_BASE_URL } from "@/config/api";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import HashProof from "@/components/blockchain/HashProof";
import ComplaintStatus from "@/components/complaint/ComplaintStatus";
import EvidenceViewer from "@/components/complaint/EvidenceViewer";
import TimelineTracker from "@/components/complaint/TimelineTracker";
import type { UploadedEvidenceFile } from "@/hooks/useUpload";
import {
  ArrowLeft,
  FileText,
  Users,
  ShieldCheck,
  Cpu,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Gavel,
  Award,
  Clock,
} from "lucide-react";

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

      const res = await fetch(`${API_BASE_URL}/api/complaints/${caseId}`);
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

      const res = await fetch(`${API_BASE_URL}/api/blockchain/store-hash`, {
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
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center space-y-3">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--color-accent-primary)] border-t-transparent" />
        <p className="text-sm text-[var(--color-text-secondary)]">Loading dispute dossier...</p>
      </div>
    );
  }

  if (error || !complaint) {
    return (
      <div className="rounded-2xl border border-[rgba(239,68,68,0.3)] bg-[rgba(239,68,68,0.1)] p-8 text-center space-y-4">
        <AlertCircle className="mx-auto h-10 w-10 text-[var(--color-danger)]" />
        <h2 className="font-display text-xl font-bold text-[var(--color-text-primary)]">Dispute Not Found</h2>
        <p className="text-sm text-[var(--color-text-secondary)]">{error || "Case record could not be found."}</p>
        <Link href="/admin/complaints">
          <button type="button" className="rounded-xl bg-[var(--color-accent-primary)] px-5 py-2 text-xs font-semibold text-white">
            Back to Registry
          </button>
        </Link>
      </div>
    );
  }

  const evidence = normalizeEvidence(complaint.evidence);
  const defenseEvidence = normalizeEvidence(complaint.defenseEvidence);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/90 p-6 backdrop-blur-xl">
        <div className="space-y-1">
          <Link
            href="/admin/complaints"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition mb-1"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to All Complaints</span>
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-display text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">
              {complaint.title}
            </h1>
            <span className="font-mono text-xs font-bold text-[var(--color-gold)]">
              {complaint.caseId}
            </span>
          </div>
          <p className="text-xs text-[var(--color-text-secondary)]">
            Category: <span className="capitalize font-medium text-[var(--color-text-primary)]">{complaint.category?.replace("_", " ")}</span> • Priority: <span className="capitalize font-medium text-[var(--color-gold)]">{complaint.priority}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <ComplaintStatus status={complaint.status} />
        </div>
      </div>

      {/* Main Grid: Details & Parties */}
      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-6">
          {/* Dispute Description */}
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/90 p-6 backdrop-blur-xl space-y-4">
            <h2 className="font-display text-base font-bold text-[var(--color-text-primary)] flex items-center gap-2">
              <FileText className="h-4 w-4 text-[var(--color-accent-primary)]" />
              Dispute Facts & Statements
            </h2>
            <p className="whitespace-pre-wrap text-sm leading-7 text-[var(--color-text-secondary)]">
              {complaint.description}
            </p>
          </div>

          {/* Complainant Evidence */}
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/90 p-6 backdrop-blur-xl">
            <h3 className="font-display text-base font-bold text-[var(--color-text-primary)] mb-4">
              Complainant Uploads ({evidence.length})
            </h3>
            <EvidenceViewer files={evidence} title="Complainant Evidence Files" />
          </div>

          {/* Defense Statement & Uploads */}
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/90 p-6 backdrop-blur-xl space-y-4">
            <h3 className="font-display text-base font-bold text-[var(--color-text-primary)]">
              Respondent Defense Statement & Counter-Evidence
            </h3>

            {complaint.defenseStatement ? (
              <div className="space-y-4">
                <p className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-primary)] p-4 text-sm leading-7 text-[var(--color-text-primary)] whitespace-pre-wrap">
                  {complaint.defenseStatement}
                </p>
                {defenseEvidence.length > 0 && (
                  <EvidenceViewer files={defenseEvidence} title="Respondent Counter-Evidence Files" />
                )}
              </div>
            ) : (
              <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-primary)] p-6 text-center text-xs text-[var(--color-text-muted)]">
                No defense statement has been submitted by the opposite party yet.
              </div>
            )}
          </div>

          {/* Assigned Community Jurors Section */}
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/90 p-6 backdrop-blur-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-[var(--color-border-subtle)] pb-3">
              <div className="flex items-center gap-2">
                <Gavel className="h-5 w-5 text-[var(--color-accent-primary)]" />
                <h3 className="font-display text-base font-bold text-[var(--color-text-primary)]">
                  Assigned Community Jurors ({complaint.assignedJurors?.length || 0})
                </h3>
              </div>

              {complaint.assignedJurors?.length > 0 && (
                <div className="flex items-center gap-2 text-xs">
                  <span className="rounded-full bg-[rgba(124,58,237,0.15)] px-2.5 py-0.5 font-bold text-[var(--color-accent-primary)] border border-[rgba(124,58,237,0.3)]">
                    {complaint.assignedJurors.length === 3 ? "Standard Panel (3 Jurors)" : `${complaint.assignedJurors.length} Juror Panel`}
                  </span>
                  {complaint.votingDeadline && (
                    <span className="flex items-center gap-1 text-[var(--color-text-muted)]">
                      <Clock className="h-3 w-3 text-[var(--color-gold)]" />
                      Deadline: {new Date(complaint.votingDeadline).toLocaleDateString()}
                    </span>
                  )}
                </div>
              )}
            </div>

            {complaint.assignedJurors && complaint.assignedJurors.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {complaint.assignedJurors.map((juror: any, idx: number) => {
                  const jurorName = typeof juror === "object" ? juror.name : `Juror #${idx + 1}`;
                  const jurorEmail = typeof juror === "object" ? juror.email : "Email unavailable";
                  const repScore = typeof juror === "object" ? juror.reputationScore ?? 100 : 100;
                  const level = typeof juror === "object" ? juror.jurorLevel ?? 1 : 1;

                  return (
                    <div
                      key={typeof juror === "object" ? juror._id || idx : idx}
                      className="flex flex-col justify-between rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-primary)] p-4 transition hover:border-[var(--color-accent-primary)]/40 hover:bg-[var(--color-bg-elevated)]"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between gap-1">
                          <p className="font-semibold text-sm text-[var(--color-text-primary)] truncate" title={jurorName}>
                            {jurorName}
                          </p>
                          <span className="rounded bg-[var(--color-accent-primary)]/20 px-1.5 py-0.5 text-[10px] font-bold text-[var(--color-accent-primary)]">
                            Lvl {level}
                          </span>
                        </div>
                        <p className="font-mono text-xs text-[var(--color-text-muted)] truncate" title={jurorEmail}>
                          {jurorEmail}
                        </p>
                      </div>

                      <div className="mt-3 flex items-center justify-between border-t border-[var(--color-border-subtle)]/50 pt-2 text-xs">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-gold)] flex items-center gap-1">
                          <Award className="h-3 w-3" />
                          Rep: {repScore}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[10px] text-[var(--color-success)] font-medium">
                          <CheckCircle2 className="h-3 w-3" />
                          Active Juror
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-[var(--color-border)] bg-[var(--color-bg-primary)] p-6 text-center text-xs text-[var(--color-text-muted)]">
                No jurors have been assigned to this case yet. Jurors can be assigned by admin once respondent submits defense or deadline expires.
              </div>
            )}
          </div>
        </div>

        {/* Sidebar: Parties, Blockchain, Milestones */}
        <aside className="space-y-6">
          {/* Parties Dossier Card */}
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/90 p-6 backdrop-blur-xl space-y-4">
            <h2 className="font-display text-base font-bold text-[var(--color-text-primary)] flex items-center gap-2">
              <Users className="h-4 w-4 text-[var(--color-gold)]" />
              Involved Parties
            </h2>

            <div className="space-y-3.5 text-xs">
              <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-primary)] p-3 space-y-1">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-gold)]">
                  Complainant
                </span>
                <p className="font-semibold text-sm text-[var(--color-text-primary)]">
                  {complaint.complainantId?.name ?? "Anonymous Complainant"}
                </p>
                <p className="font-mono text-xs text-[var(--color-text-muted)]">
                  {complaint.complainantId?.email ?? "No email"}
                </p>
              </div>

              <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-primary)] p-3 space-y-1">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-info)]">
                  Opposite Party (Respondent)
                </span>
                <p className="font-semibold text-sm text-[var(--color-text-primary)]">
                  {complaint.oppositeParty?.userId?.name ??
                    complaint.oppositeParty?.name ??
                    "Not linked yet"}
                </p>
                <p className="font-mono text-xs text-[var(--color-text-muted)]">
                  {complaint.oppositeParty?.userId?.email ??
                    complaint.oppositeParty?.email ??
                    "No email"}
                </p>
              </div>

              <div className="text-[11px] text-[var(--color-text-muted)] pt-1">
                Filed on: {formatDate(complaint.createdAt)}
              </div>
            </div>
          </div>

          {/* Hash Proof & Sepolia Sync Tool */}
          <div className="space-y-3">
            <HashProof
              caseId={complaint.caseId}
              complaintHash={complaint.complaintHash}
              blockchainTxHash={complaint.blockchainTxHash}
            />

            {!complaint.blockchainTxHash && (
              <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-4 space-y-3">
                <p className="text-xs text-[var(--color-text-secondary)]">
                  This case has a generated hash fingerprint but has not been anchored to Ethereum Sepolia yet.
                </p>
                <button
                  type="button"
                  onClick={storeHashOnChain}
                  disabled={repairingHash}
                  className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-[var(--color-accent-primary)] px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[var(--color-accent-hover)] disabled:opacity-60"
                >
                  <Cpu className="h-3.5 w-3.5" />
                  <span>{repairingHash ? "Anchoring on Sepolia..." : "Anchor Hash on Blockchain"}</span>
                </button>

                {repairMessage && (
                  <p className="text-xs text-[var(--color-success)]">{repairMessage}</p>
                )}
                {repairError && (
                  <p className="text-xs text-[var(--color-danger)]">{repairError}</p>
                )}
              </div>
            )}
          </div>

          {/* Timeline Milestones */}
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/90 p-6 backdrop-blur-xl">
            <h3 className="font-display text-sm font-bold text-[var(--color-text-primary)] mb-4">
              Audit Milestones
            </h3>
            <TimelineTracker events={timelineEvents} />
          </div>
        </aside>
      </div>
    </div>
  );
}
