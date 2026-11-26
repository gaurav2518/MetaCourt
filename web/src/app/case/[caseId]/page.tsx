"use client";

import { API_BASE_URL } from "@/config/api";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { QRCodeCanvas } from "qrcode.react";
import {
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  LockKeyhole,
  Scale,
  ShieldCheck,
  Share2,
  Download,
  Copy,
  Check,
} from "lucide-react";

import ComplaintStatus from "@/components/complaint/ComplaintStatus";
import HashProof from "@/components/blockchain/HashProof";
import NetworkBackground from "@/components/layout/NetworkBackground";
import Navbar from "@/components/layout/Navbar";

export default function PublicCasePage() {
  const { caseId } = useParams();
  const [complaint, setComplaint] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const publicUrl =
    typeof window !== "undefined"
      ? window.location.href
      : "";

  useEffect(() => {
    async function loadCase() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/complaints/${caseId}?public=true`);
        const data = await res.json();

        if (res.ok) {
          setComplaint(data.complaint);
        }
      } catch (err) {
        console.error("Failed to load public case:", err);
      } finally {
        setLoading(false);
      }
    }

    if (caseId) loadCase();
  }, [caseId]);

  function copyCaseLink() {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  function downloadQrCode() {
    if (typeof window === "undefined") return;
    const canvas = document.getElementById("public-qr-code") as HTMLCanvasElement | null;
    if (!canvas) return;

    const pngUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = pngUrl;
    link.download = `${caseId}-verification-qr.png`;
    link.click();
  }

  if (loading) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]">
        <NetworkBackground />
        <div className="relative z-10">
          <Navbar />
          <div className="mx-auto max-w-4xl px-4 py-20 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-[var(--color-accent-primary)] border-t-transparent" />
            <p className="mt-4 text-sm text-[var(--color-text-secondary)]">
              Fetching blockchain proof record for {caseId}...
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (!complaint) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]">
        <NetworkBackground />
        <div className="relative z-10">
          <Navbar />
          <div className="mx-auto max-w-xl px-4 py-20">
            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-8 text-center shadow-xl">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[rgba(239,68,68,0.15)] text-[var(--color-danger)]">
                <LockKeyhole className="h-7 w-7" />
              </div>
              <h1 className="mt-5 font-display text-2xl font-bold">Case Record Not Found</h1>
              <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
                No case matching <span className="font-mono text-[var(--color-gold)]">{caseId}</span> was found in the public ledger.
              </p>
              <div className="mt-6 flex justify-center gap-3">
                <Link
                  href="/case"
                  className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-accent-primary)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-accent-hover)]"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Search
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const etherscanUrl = complaint.blockchainTxHash
    ? `https://sepolia.etherscan.io/tx/${complaint.blockchainTxHash}`
    : null;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]">
      <NetworkBackground />

      <div className="relative z-10">
        <Navbar />

        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center justify-between">
            <Link
              href="/case"
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] transition hover:text-[var(--color-text-primary)]"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Public Lookup</span>
            </Link>

            <div className="flex items-center gap-2 font-mono text-xs text-[var(--color-gold)]">
              <ShieldCheck className="h-4 w-4" />
              <span>Public Verification Record</span>
            </div>
          </div>

          {/* Certificate Header Card */}
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/95 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-[var(--color-gold)]">
                  {complaint.caseId}
                </span>
                <span className="text-xs text-[var(--color-text-muted)]">•</span>
                <span className="rounded-full bg-[rgba(92,90,122,0.15)] px-3 py-0.5 text-xs capitalize text-[var(--color-text-secondary)]">
                  {complaint.category?.replace("_", " ")}
                </span>
              </div>

              <ComplaintStatus status={complaint.status} />
            </div>

            <h1 className="mt-4 font-display text-2xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-3xl">
              {complaint.title}
            </h1>

            <p className="mt-3 text-sm leading-6 text-[var(--color-text-secondary)]">
              Filed on {new Date(complaint.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })} • Protected under MetaCourt Protocol
            </p>

            {complaint.status === "decided" && (
              <div className="mt-6 flex items-center justify-between rounded-xl border border-[rgba(16,185,129,0.3)] bg-[rgba(16,185,129,0.12)] p-4 sm:p-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-success)]">
                    Consensus Juror Decision
                  </p>
                  <p className="mt-1 font-display text-xl font-bold capitalize text-[var(--color-text-primary)]">
                    {complaint.decision?.replace("_", " ")}
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[rgba(16,185,129,0.2)] text-[var(--color-success)]">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
              </div>
            )}
          </div>

          {/* Blockchain Hash Proof */}
          <HashProof
            caseId={complaint.caseId}
            complaintHash={complaint.complaintHash}
            blockchainTxHash={complaint.blockchainTxHash}
          />

          {/* Etherscan Direct Link */}
          {etherscanUrl && (
            <a
              href={etherscanUrl}
              target="_blank"
              rel="noreferrer"
              className="group flex items-center justify-between rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/90 p-4 text-sm transition hover:border-[var(--color-accent-primary)] hover:bg-[var(--color-bg-elevated)]"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-accent-glow)] text-[var(--color-accent-primary)]">
                  <ExternalLink className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-semibold text-[var(--color-text-primary)]">
                    View Verified Block on Etherscan
                  </p>
                  <p className="font-mono text-xs text-[var(--color-text-muted)] truncate max-w-sm sm:max-w-md">
                    Tx: {complaint.blockchainTxHash}
                  </p>
                </div>
              </div>
              <span className="text-xs font-medium text-[var(--color-accent-primary)] group-hover:underline">
                Explore &rarr;
              </span>
            </a>
          )}

          {/* Share & QR Verification Card */}
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/90 p-6 sm:p-8">
            <div className="grid gap-6 sm:grid-cols-[1fr_auto] sm:items-center">
              <div>
                <h2 className="font-display text-lg font-bold text-[var(--color-text-primary)]">
                  Share Public Verification Proof
                </h2>
                <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                  Anyone can scan this cryptographic QR code or use the link to verify the dispute fingerprint on-chain without exposing private records.
                </p>

                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={copyCaseLink}
                    className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-primary)] px-4 py-2 text-xs font-medium text-[var(--color-text-primary)] transition hover:bg-[var(--color-bg-elevated)]"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-[var(--color-success)]" />
                        Link Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        Copy Shareable Link
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={downloadQrCode}
                    className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-primary)] px-4 py-2 text-xs font-medium text-[var(--color-text-primary)] transition hover:bg-[var(--color-bg-elevated)]"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Download QR Code PNG
                  </button>
                </div>
              </div>

              <div className="flex justify-center">
                <div className="rounded-xl border border-[var(--color-border)] bg-white p-3.5 shadow-md">
                  <QRCodeCanvas id="public-qr-code" value={publicUrl} size={150} />
                </div>
              </div>
            </div>
          </div>

          {/* Security & Confidentiality Notice */}
          <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)]/60 p-4 text-xs text-[var(--color-text-muted)] text-center">
            Verification is executed against the MetaCourt smart contract on Ethereum Sepolia. Hash digest is generated deterministically via SHA-256.
          </div>
        </div>
      </div>
    </main>
  );
}
