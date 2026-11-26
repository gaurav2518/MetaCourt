import Link from "next/link";
import ComplaintForm from "@/components/complaint/ComplaintForm";
import PageHeader from "@/components/layout/PageHeader";
import Button from "@/components/ui/Button";
import {
  ArrowLeft,
  FileText,
  ShieldCheck,
  Scale,
  LockKeyhole,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

export default function FileComplaintPage() {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/90 p-6 backdrop-blur-xl">
        <div className="space-y-1">
          <Link
            href="/complainant"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition mb-1"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to My Cases</span>
          </Link>
          <h1 className="font-display text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">
            File a New Dispute Complaint
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Follow the 3-step intake wizard to submit case details, identify counter-parties, and attach verifiable evidence.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-[var(--color-gold)]/30 bg-[var(--color-gold-subtle)] px-3.5 py-2 text-xs font-semibold text-[var(--color-gold)]">
          <ShieldCheck className="h-4 w-4" />
          <span>SHA-256 Anchored</span>
        </div>
      </div>

      {/* 2-Column Responsive Layout */}
      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
        {/* Main Intake Form */}
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/90 p-6 backdrop-blur-xl sm:p-8">
          <ComplaintForm />
        </div>

        {/* Sidebar Intake Guidance & Rules */}
        <aside className="space-y-5">
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/80 p-6 backdrop-blur-sm">
            <h3 className="font-display text-sm font-bold text-[var(--color-text-primary)] flex items-center gap-2">
              <FileText className="h-4 w-4 text-[var(--color-accent-primary)]" />
              Evidence Best Practices
            </h3>
            <ul className="mt-3.5 space-y-2.5 text-xs text-[var(--color-text-secondary)]">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-[var(--color-success)] shrink-0 mt-0.5" />
                <span>Upload clear, dated contract agreements, invoice receipts, or transaction screenshots.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-[var(--color-success)] shrink-0 mt-0.5" />
                <span>State concrete facts, specific timelines, and financial sums in dispute.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-[var(--color-success)] shrink-0 mt-0.5" />
                <span>Keep evidence legible (PDF or PNG/JPG under 10MB recommended).</span>
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/80 p-6 backdrop-blur-sm">
            <h3 className="font-display text-sm font-bold text-[var(--color-text-primary)] flex items-center gap-2">
              <LockKeyhole className="h-4 w-4 text-[var(--color-gold)]" />
              Cryptographic Immutability
            </h3>
            <p className="mt-2.5 text-xs leading-5 text-[var(--color-text-secondary)]">
              Upon submission, a deterministic SHA-256 fingerprint of your complaint text and attachments is stored on the Sepolia blockchain testnet.
            </p>
            <div className="mt-3 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg-primary)] p-3 font-mono text-[11px] text-[var(--color-text-muted)]">
              Proof standard: ERC-721 / Deterministic Hash Proof
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/80 p-6 backdrop-blur-sm">
            <h3 className="font-display text-sm font-bold text-[var(--color-text-primary)] flex items-center gap-2">
              <Scale className="h-4 w-4 text-[var(--color-info)]" />
              Opposite Party Rights
            </h3>
            <p className="mt-2.5 text-xs leading-5 text-[var(--color-text-secondary)]">
              The respondent will receive email notification to submit their formal defense and counter-evidence before jurors commence blind voting.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
