"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import AddEvidencePanel from "@/components/complaint/AddEvidencePanel";
import ComplaintStatus from "@/components/complaint/ComplaintStatus";
import EvidenceViewer from "@/components/complaint/EvidenceViewer";
import TimelineTracker from "@/components/complaint/TimelineTracker";
import BlockchainBadge from "@/components/complaint/BlockchainBadge";
import { useComplaints } from "@/hooks/useComplaints";
import HashProof from "@/components/blockchain/HashProof";
import type { UploadedEvidenceFile } from "@/hooks/useUpload";
import { QRCodeCanvas } from "qrcode.react";
import {
  ArrowLeft,
  Share2,
  Download,
  Copy,
  Check,
  ShieldCheck,
  Scale,
  Calendar,
  User,
  AlertCircle,
  FileText,
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

export default function CaseDetailPage() {
  const params = useParams();
  const caseId = params?.caseId as string;

  const { fetchComplaint } = useComplaints();
  const [complaint, setComplaint] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [shareMessage, setShareMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function loadComplaint() {
    if (!caseId) return;

    setLoading(true);

    try {
      const res = await fetchComplaint(caseId);
      if (res.relationship !== "complainant" && res.relationship !== "admin") {
        setComplaint(null);
      } else {
        setComplaint(res.complaint ?? null);
      }
    } catch {
      setComplaint(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let mounted = true;

    if (mounted) {
      void loadComplaint();
    }

    return () => {
      mounted = false;
    };
  }, [caseId, fetchComplaint]);

  if (loading) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center space-y-3">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--color-accent-primary)] border-t-transparent" />
        <p className="text-sm text-[var(--color-text-secondary)]">Loading dispute details...</p>
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="rounded-2xl border border-[rgba(239,68,68,0.3)] bg-[rgba(239,68,68,0.08)] p-8 text-center space-y-4">
        <AlertCircle className="mx-auto h-10 w-10 text-[var(--color-danger)]" />
        <h2 className="font-display text-xl font-bold text-[var(--color-text-primary)]">Dispute Not Found</h2>
        <p className="text-sm text-[var(--color-text-secondary)]">The requested case could not be located.</p>
        <Link href="/complainant">
          <Button variant="secondary">Back to My Cases</Button>
        </Link>
      </div>
    );
  }

  const evidence = normalizeEvidence((complaint as any).evidence ?? []);

  // Build a minimal timeline from known fields if no history provided
  const timeline =
    (complaint.history && complaint.history.length > 0)
      ? complaint.history
      : [
          { id: `created-${complaint.caseId}`, status: "Filed", timestamp: complaint.createdAt || new Date().toISOString() },
          { id: `updated-${complaint.caseId}`, status: complaint.status, timestamp: complaint.updatedAt || complaint.createdAt || new Date().toISOString() },
        ];

  const oppositeResponse = (complaint as any).oppositeResponse ?? (complaint.oppositeParty?.response ?? null);

  const qrUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/case/${complaint.caseId}`
      : `/case/${complaint.caseId}`;

  async function handleShare() {
    try {
      if (typeof window !== "undefined") {
        if (navigator.share) {
          await navigator.share({
            title: complaint.title,
            text: `MetaCourt Dispute Case ${complaint.caseId}`,
            url: qrUrl,
          });
        } else {
          await navigator.clipboard.writeText(qrUrl);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }
      }
    } catch {
      setShareMessage("Sharing cancelled.");
    }
  }

  function downloadQrCode() {
    if (typeof window === "undefined") return;
    const canvas = document.getElementById("case-qr-code") as HTMLCanvasElement | null;
    if (!canvas) return;

    const pngUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = pngUrl;
    link.download = `${complaint.caseId}-verification-qr.png`;
    link.click();
  }

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/90 p-6 backdrop-blur-xl">
        <div className="space-y-1">
          <Link
            href="/complainant"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition mb-1"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to My Cases</span>
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
            Category: <span className="capitalize font-medium text-[var(--color-text-primary)]">{complaint.category?.replace("_", " ")}</span> • Priority: <span className="capitalize font-medium text-[var(--color-gold)]">{complaint.priority || "Standard"}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <ComplaintStatus status={complaint.status} />
          <BlockchainBadge
            complaintHash={complaint.complaintHash}
            blockchainTxHash={complaint.blockchainTxHash}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main 2-column info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Dispute Statement Card */}
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/90 p-6 backdrop-blur-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--color-border-subtle)] pb-3">
              <h3 className="font-display text-base font-bold text-[var(--color-text-primary)] flex items-center gap-2">
                <FileText className="h-4 w-4 text-[var(--color-accent-primary)]" />
                Dispute Statement & Facts
              </h3>
              <span className="text-xs text-[var(--color-text-muted)]">
                Filed on {new Date(complaint.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p className="text-sm leading-7 text-[var(--color-text-secondary)] whitespace-pre-wrap">
              {complaint.description}
            </p>
          </div>

          {/* Evidence Attachments */}
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/90 p-6 backdrop-blur-xl">
            <h3 className="font-display text-base font-bold text-[var(--color-text-primary)] mb-4">
              Complainant Evidence Files
            </h3>
            <EvidenceViewer files={evidence} />
          </div>

          {/* Add Evidence Component */}
          <AddEvidencePanel
            caseId={complaint.caseId}
            title="Attach Supplementary Evidence"
            helperText="Submit additional documents or screenshots to strengthen your claim before voting completes."
            onAdded={loadComplaint}
          />

          {/* Opposite Party Response Status */}
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/90 p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-3 border-b border-[var(--color-border-subtle)] pb-3">
              <h3 className="font-display text-base font-bold text-[var(--color-text-primary)] flex items-center gap-2">
                <User className="h-4 w-4 text-[var(--color-gold)]" />
                Opposite Party Response
              </h3>
              <span className="text-xs text-[var(--color-text-muted)]">
                Target: {complaint.oppositeParty?.email || "Email on record"}
              </span>
            </div>

            {oppositeResponse ? (
              <div className="rounded-xl border border-[rgba(59,130,246,0.25)] bg-[rgba(59,130,246,0.08)] p-4 text-sm text-[var(--color-text-primary)] leading-6">
                {oppositeResponse}
              </div>
            ) : (
              <div className="flex items-start gap-3 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)] p-4 text-xs text-[var(--color-text-secondary)]">
                <AlertCircle className="h-4 w-4 text-[var(--color-warning)] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-[var(--color-text-primary)]">Pending Counter-Statement:</span> The opposite party has been notified and has the opportunity to submit their defense and evidence before final jury voting.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar Details */}
        <aside className="space-y-6">
          {/* Cryptographic Hash Card */}
          <HashProof
            caseId={complaint.caseId}
            complaintHash={complaint.complaintHash}
            blockchainTxHash={complaint.blockchainTxHash}
          />

          {/* Public Verification & QR */}
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/90 p-6 backdrop-blur-xl">
            <h4 className="font-display text-sm font-bold text-[var(--color-text-primary)]">
              Public Verification QR
            </h4>
            <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
              Scan with any mobile device to open the public blockchain proof page.
            </p>

            <div className="mt-4 flex justify-center">
              <div className="rounded-xl border border-[var(--color-border)] bg-white p-3.5 shadow-md">
                <QRCodeCanvas id="case-qr-code" value={qrUrl} size={150} />
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <Button
                variant="secondary"
                onClick={handleShare}
                className="w-full text-xs py-2 px-3 flex items-center justify-center gap-1.5"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-[var(--color-success)]" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? "Copied" : "Share Link"}</span>
              </Button>

              <Button
                variant="secondary"
                onClick={downloadQrCode}
                className="w-full text-xs py-2 px-3 flex items-center justify-center gap-1.5"
              >
                <Download className="h-3.5 w-3.5" />
                <span>PNG QR</span>
              </Button>
            </div>
            {shareMessage && <p className="mt-2 text-center text-xs text-[var(--color-text-muted)]">{shareMessage}</p>}
          </div>

          {/* Timeline Tracker */}
          <TimelineTracker events={timeline} />
        </aside>
      </div>
    </div>
  );
}
