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
  CalendarPlus,
  AlertTriangle,
  Hourglass,
  X,
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

  // Juror vote tracking & deadline extension states
  const [voteData, setVoteData] = useState<{
    total: number;
    valid: number;
    invalid: number;
    needs_evidence: number;
    votes: any[];
  } | null>(null);
  const [showExtendModal, setShowExtendModal] = useState(false);
  const [extensionDays, setExtensionDays] = useState(3);
  const [extendingDeadline, setExtendingDeadline] = useState(false);
  const [extendMessage, setExtendMessage] = useState("");
  const [extendError, setExtendError] = useState("");

  async function loadVotes() {
    try {
      const res = await fetch(`${API_BASE_URL}/api/votes/${caseId}`, {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setVoteData(data);
      }
    } catch (err) {
      console.error("Failed to load votes:", err);
    }
  }

  async function loadComplaint() {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(`${API_BASE_URL}/api/complaints/${caseId}`, {
        credentials: "include",
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to load complaint");
      }

      setComplaint(data.complaint);
      loadVotes();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load complaint");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (caseId) {
      loadComplaint();
      loadVotes();
    }
  }, [caseId]);

  async function handleExtendDeadline() {
    try {
      setExtendingDeadline(true);
      setExtendError("");
      setExtendMessage("");

      const res = await fetch(`${API_BASE_URL}/api/complaints/${caseId}/extend-deadline`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ additionalDays: extensionDays }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to extend deadline");
      }

      setExtendMessage(data.message);
      setComplaint((prev: any) => ({
        ...prev,
        votingDeadline: data.votingDeadline,
      }));
      setTimeout(() => {
        setShowExtendModal(false);
        setExtendMessage("");
      }, 1500);
    } catch (err) {
      setExtendError(err instanceof Error ? err.message : "Failed to extend deadline");
    } finally {
      setExtendingDeadline(false);
    }
  }

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
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[var(--color-border-subtle)] pb-4">
              <div className="flex items-center gap-2">
                <Gavel className="h-5 w-5 text-[var(--color-accent-primary)]" />
                <h3 className="font-display text-base font-bold text-[var(--color-text-primary)]">
                  Assigned Community Jurors ({complaint.assignedJurors?.length || 0})
                </h3>
              </div>

              {complaint.assignedJurors?.length > 0 && (() => {
                const totalJurors = complaint.assignedJurors.length;
                const votesCast = voteData?.total || 0;
                const isAllVoted = votesCast >= totalJurors;
                const isDeadlinePassed =
                  complaint.votingDeadline && new Date() > new Date(complaint.votingDeadline);
                const isDecided = complaint.status === "decided";

                return (
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    {/* Voting Progress Pill */}
                    {isAllVoted ? (
                      <span className="flex items-center gap-1 rounded-full bg-[rgba(16,185,129,0.15)] px-2.5 py-1 text-xs font-bold text-[var(--color-success)] border border-[rgba(16,185,129,0.3)] shadow-[0_0_12px_rgba(16,185,129,0.15)]">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>All {totalJurors} Jurors Voted (100%)</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 rounded-full bg-[rgba(245,158,11,0.15)] px-2.5 py-1 text-xs font-bold text-amber-400 border border-[rgba(245,158,11,0.3)]">
                        <Hourglass className="h-3.5 w-3.5 animate-pulse" />
                        <span>
                          {votesCast} / {totalJurors} Voted ({Math.round((votesCast / totalJurors) * 100)}%)
                        </span>
                      </span>
                    )}

                    {/* Deadline Status Pill */}
                    {complaint.votingDeadline && (
                      <span
                        className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium border ${
                          isDeadlinePassed
                            ? "bg-[rgba(239,68,68,0.12)] text-[var(--color-danger)] border-[rgba(239,68,68,0.25)]"
                            : "bg-[var(--color-bg-primary)] text-[var(--color-text-muted)] border-[var(--color-border)]"
                        }`}
                      >
                        {isDeadlinePassed ? (
                          <>
                            <AlertTriangle className="h-3 w-3 text-[var(--color-danger)]" />
                            <span>Deadline Expired: {new Date(complaint.votingDeadline).toLocaleDateString()}</span>
                          </>
                        ) : (
                          <>
                            <Clock className="h-3 w-3 text-[var(--color-gold)]" />
                            <span>Deadline: {new Date(complaint.votingDeadline).toLocaleDateString()}</span>
                          </>
                        )}
                      </span>
                    )}

                    {/* Extend Deadline Button */}
                    {!isDecided && (
                      <button
                        type="button"
                        onClick={() => setShowExtendModal(true)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--color-accent-primary)]/40 bg-[var(--color-accent-primary)]/10 px-2.5 py-1 text-xs font-semibold text-[var(--color-accent-primary)] transition hover:bg-[var(--color-accent-primary)] hover:text-white"
                        title="Extend voting deadline if jurors need more time"
                      >
                        <CalendarPlus className="h-3.5 w-3.5" />
                        <span>Extend Deadline</span>
                      </button>
                    )}
                  </div>
                );
              })()}
            </div>

            {/* Extend Deadline Modal / Popover */}
            {showExtendModal && (
              <div className="rounded-xl border border-[var(--color-accent-primary)]/40 bg-[var(--color-bg-primary)] p-4 shadow-xl animate-in fade-in duration-150 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CalendarPlus className="h-4 w-4 text-[var(--color-accent-primary)]" />
                    <span className="font-display text-sm font-bold text-[var(--color-text-primary)]">
                      Extend Voting & Deliberation Deadline
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowExtendModal(false)}
                    className="rounded-lg p-1 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <p className="text-xs text-[var(--color-text-secondary)]">
                  If the deadline was reached or is expiring soon and some jurors have not voted, add more days to keep deliberation active for missing ballots.
                </p>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-xs font-medium text-[var(--color-text-muted)]">Add:</span>
                  {[1, 2, 3, 5, 7].map((days) => (
                    <button
                      key={days}
                      type="button"
                      onClick={() => setExtensionDays(days)}
                      className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                        extensionDays === days
                          ? "bg-[var(--color-accent-primary)] text-white shadow-sm"
                          : "border border-[var(--color-border)] bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                      }`}
                    >
                      +{days} {days === 1 ? "Day" : "Days"}
                    </button>
                  ))}

                  <button
                    type="button"
                    disabled={extendingDeadline}
                    onClick={handleExtendDeadline}
                    className="ml-auto inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-[var(--color-accent-primary)] to-[#8b5cf6] px-4 py-1.5 text-xs font-bold text-white shadow-md transition hover:brightness-110 disabled:opacity-60"
                  >
                    {extendingDeadline ? "Updating..." : `Confirm +${extensionDays} Days Extension`}
                  </button>
                </div>

                {extendMessage && (
                  <p className="text-xs font-semibold text-[var(--color-success)] flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>{extendMessage}</span>
                  </p>
                )}
                {extendError && (
                  <p className="text-xs font-semibold text-[var(--color-danger)] flex items-center gap-1">
                    <AlertCircle className="h-3.5 w-3.5" />
                    <span>{extendError}</span>
                  </p>
                )}
              </div>
            )}

            {complaint.assignedJurors && complaint.assignedJurors.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {complaint.assignedJurors.map((juror: any, idx: number) => {
                  const jurorId = typeof juror === "object" ? juror._id?.toString() : juror?.toString();
                  const jurorName = typeof juror === "object" ? juror.name : `Juror #${idx + 1}`;
                  const jurorEmail = typeof juror === "object" ? juror.email : "Email unavailable";
                  const repScore = typeof juror === "object" ? juror.reputationScore ?? 100 : 100;
                  const level = typeof juror === "object" ? juror.jurorLevel ?? 1 : 1;

                  // Find vote for this juror
                  const jurorVote = voteData?.votes?.find((v: any) => {
                    const vJurorId = v.jurorId?._id?.toString() || v.jurorId?.toString();
                    return vJurorId === jurorId;
                  });

                  const hasVoted = Boolean(jurorVote);
                  const isDeadlinePassed =
                    complaint.votingDeadline && new Date() > new Date(complaint.votingDeadline);

                  return (
                    <div
                      key={typeof juror === "object" ? juror._id || idx : idx}
                      className={`flex flex-col justify-between rounded-xl border p-4 transition ${
                        hasVoted
                          ? "border-[rgba(16,185,129,0.35)] bg-[rgba(16,185,129,0.04)]"
                          : isDeadlinePassed
                          ? "border-[rgba(239,68,68,0.35)] bg-[rgba(239,68,68,0.04)]"
                          : "border-[var(--color-border-subtle)] bg-[var(--color-bg-primary)] hover:border-[var(--color-accent-primary)]/40 hover:bg-[var(--color-bg-elevated)]"
                      }`}
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

                      {/* Juror Vote Status Card */}
                      <div className="my-3">
                        {hasVoted ? (
                          <div className="rounded-lg bg-[rgba(16,185,129,0.12)] border border-[rgba(16,185,129,0.25)] p-2.5 text-xs space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="flex items-center gap-1 font-bold text-[var(--color-success)] capitalize">
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                <span>Vote: {jurorVote.vote?.replace("_", " ")}</span>
                              </span>
                              <span className="text-[10px] text-[var(--color-text-muted)]">
                                {new Date(jurorVote.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            {jurorVote.justification && (
                              <p className="text-[11px] text-[var(--color-text-secondary)] line-clamp-2 italic">
                                &ldquo;{jurorVote.justification}&rdquo;
                              </p>
                            )}
                          </div>
                        ) : isDeadlinePassed ? (
                          <div className="flex items-center justify-between rounded-lg bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.25)] p-2.5 text-xs">
                            <span className="flex items-center gap-1 font-semibold text-[var(--color-danger)]">
                              <AlertTriangle className="h-3.5 w-3.5" />
                              <span>Overdue (Did Not Vote)</span>
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between rounded-lg bg-[rgba(245,158,11,0.1)] border border-[rgba(245,158,11,0.25)] p-2.5 text-xs">
                            <span className="flex items-center gap-1 font-semibold text-amber-400">
                              <Hourglass className="h-3.5 w-3.5 animate-spin" />
                              <span>Awaiting Ballot</span>
                            </span>
                            <span className="text-[10px] text-[var(--color-text-muted)]">
                              In deliberation
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between border-t border-[var(--color-border-subtle)]/50 pt-2 text-xs">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-gold)] flex items-center gap-1">
                          <Award className="h-3 w-3" />
                          Rep: {repScore}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-medium ${
                            hasVoted ? "text-[var(--color-success)]" : "text-[var(--color-text-muted)]"
                          }`}
                        >
                          {hasVoted ? "Ballot Recorded" : "Assigned Juror"}
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
