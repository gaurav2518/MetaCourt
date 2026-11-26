"use client";

import Link from "next/link";
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import NetworkBackground from "@/components/layout/NetworkBackground";
import {
  Search,
  ShieldCheck,
  LockKeyhole,
  Scale,
  FileCheck2,
  QrCode,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

const SAMPLE_CASES = [
  { id: "MC-2024-0047", title: "Unauthorized Charge by FastPay Services", category: "Consumer Dispute" },
  { id: "MC-2024-0012", title: "Unfulfilled Freelance Development Milestone", category: "Contract Dispute" },
  { id: "MC-2024-0089", title: "Intellectual Property Infringement Notice", category: "Copyright" },
];

const VERIFICATION_PILLARS = [
  {
    icon: LockKeyhole,
    title: "Zero-Knowledge Dispute Privacy",
    description:
      "Private evidence files, sensitive identity details, and internal defense notes remain strictly protected and confidential.",
  },
  {
    icon: ShieldCheck,
    title: "Immutable Blockchain Fingerprint",
    description:
      "A deterministic SHA-256 case fingerprint is anchored on the Ethereum Sepolia testnet to prove records have not been altered.",
  },
  {
    icon: Scale,
    title: "Community Juror Consensus",
    description:
      "Multi-juror blind evaluation guarantees fair, democratic dispute outcomes backed by cryptographic consensus.",
  },
];

export default function BrowseCasesPage() {
  const [caseId, setCaseId] = useState("");

  const normalizedCaseId = caseId.trim();

  return (
    <main className="relative min-h-screen overflow-hidden bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]">
      <NetworkBackground />

      <div className="relative z-10">
        <Navbar />

        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
          {/* Hero Lookup Card */}
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/90 p-6 shadow-2xl backdrop-blur-xl sm:p-10">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-gold)]/30 bg-[var(--color-gold-subtle)] px-3.5 py-1 text-xs font-semibold text-[var(--color-gold)]">
                <ShieldCheck className="h-4 w-4" />
                Public Case Verification
              </div>
              <span className="font-mono text-xs text-[var(--color-text-muted)]">
                Ethereum Sepolia Ledger
              </span>
            </div>

            <h1 className="mt-6 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
              Verify Any MetaCourt Dispute
            </h1>

            <p className="mt-3 max-w-2xl text-base text-[var(--color-text-secondary)]">
              Enter any MetaCourt case identifier to inspect its cryptographic SHA-256 fingerprint, blockchain transaction proof, and current resolution status.
            </p>

            {/* Search Input Box */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--color-text-muted)]" />
                <input
                  value={caseId}
                  onChange={(e) => setCaseId(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && normalizedCaseId) {
                      window.location.href = `/case/${normalizedCaseId}`;
                    }
                  }}
                  placeholder="Enter Case ID (e.g. MC-2024-0047)"
                  className="mc-input pl-12 pr-4 py-3.5 text-base shadow-inner"
                />
              </div>

              <Link
                href={normalizedCaseId ? `/case/${normalizedCaseId}` : "#"}
                className={`inline-flex items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-sm font-semibold transition duration-150 ${
                  normalizedCaseId
                    ? "bg-[var(--color-accent-primary)] text-white shadow-lg hover:bg-[var(--color-accent-hover)]"
                    : "cursor-not-allowed bg-[var(--color-bg-elevated)] text-[var(--color-text-muted)] border border-[var(--color-border)]"
                }`}
              >
                <span>Verify Case</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Quick Sample Queries */}
            <div className="mt-6 pt-6 border-t border-[var(--color-border-subtle)]">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                Sample Demonstrations:
              </p>
              <div className="mt-3 flex flex-wrap gap-2.5">
                {SAMPLE_CASES.map((sample) => (
                  <button
                    key={sample.id}
                    type="button"
                    onClick={() => setCaseId(sample.id)}
                    className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-primary)] px-3 py-1.5 text-xs text-[var(--color-text-secondary)] transition hover:border-[var(--color-accent-primary)] hover:text-[var(--color-text-primary)]"
                  >
                    <span className="font-mono font-medium text-[var(--color-accent-primary)]">
                      {sample.id}
                    </span>
                    <span className="text-[var(--color-text-muted)]">• {sample.category}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Privacy Guarantee Banner */}
            <div className="mt-8 flex items-start gap-3 rounded-xl border border-[rgba(16,185,129,0.25)] bg-[rgba(16,185,129,0.08)] p-4 text-xs text-[var(--color-success)] sm:text-sm">
              <ShieldCheck className="h-5 w-5 shrink-0 text-[var(--color-success)] mt-0.5" />
              <div>
                <span className="font-semibold">Zero-Knowledge Guarantee:</span> Public pages only display verifiable proof metadata (hash fingerprints, status, timestamps, and on-chain receipts). Private dispute evidence, sensitive identities, and juror delibaration notes are never exposed.
              </div>
            </div>
          </div>

          {/* Verification Pillars Grid */}
          <div className="mt-12">
            <h2 className="text-center font-display text-xl font-bold tracking-tight text-[var(--color-text-primary)]">
              How MetaCourt Protects Truth & Privacy
            </h2>
            <p className="mt-2 text-center text-sm text-[var(--color-text-secondary)]">
              Built on mathematical proofs, consensus validation, and decentralized trust.
            </p>

            <div className="mt-8 grid gap-6 sm:grid-cols-3">
              {VERIFICATION_PILLARS.map((pillar) => {
                const Icon = pillar.icon;
                return (
                  <div
                    key={pillar.title}
                    className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/80 p-6 backdrop-blur-sm transition duration-150 hover:border-[var(--color-accent-primary)]/40"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-accent-glow)] text-[var(--color-accent-primary)]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-4 font-display text-base font-bold text-[var(--color-text-primary)]">
                      {pillar.title}
                    </h3>
                    <p className="mt-2 text-xs leading-5 text-[var(--color-text-secondary)]">
                      {pillar.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Guide Card */}
          <div className="mt-12 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/60 p-6 sm:p-8">
            <h3 className="font-display text-base font-bold text-[var(--color-text-primary)]">
              Need to resolve a dispute or file an official complaint?
            </h3>
            <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
              Create an account in under 60 seconds to file complaints, attach verifiable documents, and participate in community jury panels.
            </p>
            <div className="mt-5 flex flex-wrap gap-4">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-accent-primary)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-accent-hover)]"
              >
                <span>Create an Account</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-primary)] px-5 py-2.5 text-sm font-medium text-[var(--color-text-primary)] transition hover:bg-[var(--color-bg-elevated)]"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
