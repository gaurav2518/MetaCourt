"use client";

import Link from "next/link";
import { useState } from "react";
import NetworkBackground from "@/components/layout/NetworkBackground";

export default function BrowseCasesPage() {
  const [caseId, setCaseId] = useState("");

  const normalizedCaseId = caseId.trim();

  return (
    <main className="relative min-h-screen overflow-hidden bg-[var(--color-bg-primary)] px-4 py-12 text-[var(--color-text-primary)]">
      <NetworkBackground />

      <div className="relative z-10 mx-auto max-w-3xl rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/90 p-8 backdrop-blur-xl">
        <p className="text-xs font-medium uppercase tracking-wider text-[var(--color-gold)]">
          Public Case Lookup
        </p>

        <h1 className="mt-4 font-display text-3xl font-bold">
          Browse Public Case Verification
        </h1>

        <p className="mt-3 text-[var(--color-text-secondary)]">
          Enter a MetaCourt case ID to open its public blockchain verification page.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <input
            value={caseId}
            onChange={(e) => setCaseId(e.target.value)}
            placeholder="Example: MC-2024-0001"
            className="mc-input flex-1 px-4 py-3 text-sm"
          />

          <Link
            href={normalizedCaseId ? `/case/${normalizedCaseId}` : "#"}
            className={`rounded-lg px-6 py-3 text-center text-sm font-medium transition duration-150 ${
              normalizedCaseId
                ? "bg-[var(--color-accent-primary)] text-white hover:bg-[var(--color-accent-hover)]"
                : "cursor-not-allowed bg-[var(--color-bg-elevated)] text-[var(--color-text-muted)]"
            }`}
          >
            Verify Case
          </Link>
        </div>

        <div className="mt-8 rounded-lg bg-[rgba(16,185,129,0.15)] p-5 text-sm text-[var(--color-success)]">
          Public pages only show safe verification data. Private evidence,
          identities, defense statements, and juror details are never exposed.
        </div>
      </div>
    </main>
  );
}
