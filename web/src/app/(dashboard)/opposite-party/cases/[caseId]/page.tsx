"use client";

import { API_BASE_URL } from "@/config/api";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import AddEvidencePanel from "@/components/complaint/AddEvidencePanel";
import EvidenceViewer from "@/components/complaint/EvidenceViewer";
import EvidenceUpload from "@/components/complaint/EvidenceUpload";
import TimelineTracker from "@/components/complaint/TimelineTracker";
import ComplaintStatus from "@/components/complaint/ComplaintStatus";
import Button from "@/components/ui/Button";
import HashProof from "@/components/blockchain/HashProof";
import type { UploadedEvidenceFile } from "@/hooks/useUpload";
import {
  ArrowLeft,
  ShieldCheck,
  Scale,
  FileText,
  AlertCircle,
  CheckCircle2,
  LockKeyhole,
  Clock,
  Send,
} from "lucide-react";

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

export default function OppositePartyCasePage() {
  const params = useParams();
  const caseId = params.caseId as string;

  const [complaint, setComplaint] = useState<any>(null);
  const [defenseStatement, setDefenseStatement] = useState("");
  const [counterEvidence, setCounterEvidence] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [error, setError] = useState("");

  async function fetchComplaint() {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(`${API_BASE_URL}/api/complaints/${caseId}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch complaint");
      }

      if (data.relationship !== "opposite_party" && data.relationship !== "admin") {
        setError("You are not the designated opposite party for this dispute.");
        setComplaint(null);
      } else {
        setComplaint(data.complaint);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function submitDefense() {
    try {
      setSubmitting(true);
      setError("");

      const res = await fetch(`${API_BASE_URL}/api/complaints/${caseId}/response`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          defenseStatement,
          evidence: counterEvidence,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to submit response");
      }

      setComplaint(data.complaint);
      setDefenseStatement("");
      setCounterEvidence([]);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  async function claimCase() {
    try {
      setClaiming(true);
      setError("");

      const res = await fetch(`${API_BASE_URL}/api/complaints/${caseId}/link-opposite-party`, {
        method: "POST",
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to claim case");
      }

      setComplaint(data.complaint);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setClaiming(false);
    }
  }

  useEffect(() => {
    fetchComplaint();
  }, [caseId]);

  if (loading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center space-y-3">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--color-accent-primary)] border-t-transparent" />
        <p className="text-sm text-[var(--color-text-secondary)]">Loading dispute case details...</p>
      </div>
    );
  }

  if (error && !complaint) {
    return (
      <div className="rounded-2xl border border-[rgba(239,68,68,0.3)] bg-[rgba(239,68,68,0.08)] p-8 text-center space-y-4">
        <AlertCircle className="mx-auto h-10 w-10 text-[var(--color-danger)]" />
        <h2 className="font-display text-xl font-bold text-[var(--color-text-primary)]">Dispute Error</h2>
        <p className="text-sm text-[var(--color-text-secondary)]">{error}</p>
        <Link href="/opposite-party">
          <Button variant="secondary">Back to My Inquiries</Button>
        </Link>
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-8 text-center space-y-4">
        <p className="text-sm text-[var(--color-text-muted)]">Complaint not found.</p>
        <Link href="/opposite-party">
          <Button variant="secondary">Back to Cases</Button>
        </Link>
      </div>
    );
  }

  const hasResponded = Boolean(complaint.defenseStatement);
  const complainantEvidence = normalizeEvidence(complaint.evidence || []);
  const defenseEvidence = normalizeEvidence(complaint.defenseEvidence || []);
  const isLinkedToAccount = Boolean(complaint.oppositeParty?.userId);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/90 p-6 backdrop-blur-xl">
        <div className="space-y-1">
          <Link
            href="/opposite-party"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition mb-1"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Cases Against Me</span>
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
            Category: <span className="capitalize font-medium text-[var(--color-text-primary)]">{complaint.category?.replace("_", " ")}</span> • Filed on: {new Date(complaint.createdAt).toLocaleDateString()}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <ComplaintStatus status={complaint.status} />
        </div>
      </div>

      {/* Account Link Callout Banner if not linked */}
      {!isLinkedToAccount && (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-[var(--color-gold)]/40 bg-[var(--color-gold-subtle)] p-5 text-[var(--color-text-primary)]">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-[var(--color-gold)] shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-[var(--color-gold)]">
                Action Required: Link Case to Your Account
              </p>
              <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                This dispute matches your email address. Claim it to unlock formal response submissions.
              </p>
            </div>
          </div>

          <Button
            type="button"
            onClick={claimCase}
            isLoading={claiming}
            disabled={claiming}
            className="shrink-0"
          >
            Claim This Case
          </Button>
        </div>
      )}

      {/* Main Grid: Details & Complainant Claim */}
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          {/* Dispute Allegations Card */}
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/90 p-6 backdrop-blur-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--color-border-subtle)] pb-3">
              <h2 className="font-display text-base font-bold text-[var(--color-text-primary)] flex items-center gap-2">
                <FileText className="h-4 w-4 text-[var(--color-accent-primary)]" />
                Complainant's Claim & Description
              </h2>
              <span className="text-xs font-mono text-[var(--color-text-muted)]">
                Status: {complaint.status}
              </span>
            </div>

            <p className="text-sm leading-7 text-[var(--color-text-secondary)] whitespace-pre-wrap">
              {complaint.description}
            </p>
          </div>

          {/* Complainant Evidence */}
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/90 p-6 backdrop-blur-xl">
            <h2 className="font-display text-base font-bold text-[var(--color-text-primary)] mb-4">
              Complainant's Supporting Evidence
            </h2>
            <EvidenceViewer files={complainantEvidence} />
          </div>

          {/* Defense Response Section */}
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/90 p-6 backdrop-blur-xl space-y-5">
            <div className="flex items-center justify-between border-b border-[var(--color-border-subtle)] pb-3">
              <h2 className="font-display text-base font-bold text-[var(--color-text-primary)] flex items-center gap-2">
                <Scale className="h-4 w-4 text-[var(--color-gold)]" />
                Your Formal Defense Response
              </h2>
              <span className={`text-xs font-semibold ${hasResponded ? "text-[var(--color-success)]" : "text-[var(--color-warning)]"}`}>
                {hasResponded ? "Submitted & Recorded" : "Awaiting Your Response"}
              </span>
            </div>

            {hasResponded ? (
              <div className="space-y-5">
                <div className="flex items-center gap-2.5 rounded-xl border border-[rgba(16,185,129,0.3)] bg-[rgba(16,185,129,0.1)] p-4 text-xs text-[var(--color-success)] sm:text-sm">
                  <CheckCircle2 className="h-5 w-5 shrink-0" />
                  <span>Your formal defense statement has been anchored and submitted to the community jury panel.</span>
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] block mb-2">
                    Recorded Defense Statement
                  </label>
                  <p className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-primary)] p-4 text-sm leading-7 text-[var(--color-text-primary)] whitespace-pre-wrap">
                    {complaint.defenseStatement}
                  </p>
                </div>

                {defenseEvidence.length > 0 && (
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] block mb-2">
                      Submitted Defense Evidence
                    </label>
                    <EvidenceViewer files={defenseEvidence} />
                  </div>
                )}

                <AddEvidencePanel
                  caseId={complaint.caseId}
                  title="Add Supplementary Defense Evidence"
                  helperText="Attach additional documentation to support your defense before final voting is sealed."
                  onAdded={fetchComplaint}
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="mc-label mb-2 block">
                    Write Your Defense Statement (Minimum 10 characters)
                  </label>
                  <textarea
                    value={defenseStatement}
                    onChange={(e) => setDefenseStatement(e.target.value)}
                    rows={6}
                    className="mc-input w-full p-4 text-sm leading-6"
                    placeholder="Provide your factual side of the dispute, explaining any counter-evidence, contractual fulfillment, or discrepancies in the complainant's claims..."
                  />
                </div>

                <div>
                  <label className="mc-label mb-2 block">
                    Attach Supporting Files (Receipts, logs, communications)
                  </label>
                  <EvidenceUpload
                    onChange={(files) => setCounterEvidence(files)}
                  />
                </div>

                {counterEvidence.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs font-semibold text-[var(--color-text-muted)] mb-2">Files ready for submission:</p>
                    <EvidenceViewer files={counterEvidence} />
                  </div>
                )}

                {error && (
                  <div className="rounded-xl border border-[rgba(239,68,68,0.3)] bg-[rgba(239,68,68,0.1)] p-3 text-xs text-[var(--color-danger)]">
                    {error}
                  </div>
                )}

                <Button
                  type="button"
                  onClick={submitDefense}
                  isLoading={submitting}
                  disabled={
                    submitting ||
                    !isLinkedToAccount ||
                    defenseStatement.trim().length < 10
                  }
                  className="w-full flex items-center justify-center gap-2 mt-2"
                >
                  <Send className="h-4 w-4" />
                  <span>Submit Defense Statement & Evidence</span>
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar: HashProof, Timeline, Final Decision */}
        <aside className="space-y-6">
          <HashProof
            caseId={complaint.caseId}
            complaintHash={complaint.complaintHash}
            blockchainTxHash={complaint.blockchainTxHash}
          />

          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/90 p-6 backdrop-blur-xl">
            <h3 className="font-display text-sm font-bold text-[var(--color-text-primary)] mb-4">
              Dispute Resolution Milestones
            </h3>
            <TimelineTracker
              events={
                (complaint.history && complaint.history.length > 0)
                  ? complaint.history
                  : [
                      { id: `created-${complaint.caseId}`, status: "Filed by Complainant", timestamp: complaint.createdAt || new Date().toISOString() },
                      { id: `updated-${complaint.caseId}`, status: complaint.status, timestamp: complaint.updatedAt || complaint.createdAt || new Date().toISOString() },
                    ]
              }
            />
          </div>

          {complaint.status === "decided" && (
            <div className="rounded-2xl border border-[rgba(16,185,129,0.3)] bg-[rgba(16,185,129,0.1)] p-6 backdrop-blur-xl space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-success)]">
                Final Juror Verdict
              </span>
              <p className="font-display text-xl font-bold capitalize text-[var(--color-text-primary)]">
                {complaint.decision?.replace("_", " ")}
              </p>
              <p className="text-xs text-[var(--color-text-secondary)]">
                This case has concluded its jury deliberation and is permanently sealed on-chain.
              </p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
