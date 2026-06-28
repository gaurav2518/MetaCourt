"use client";

import Link from "next/link";
import { useState } from "react";

export default function BrowseCasesPage() {
  const [caseId, setCaseId] = useState("");

  const normalizedCaseId = caseId.trim();

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-white">
      <div className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl">
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">
          Public Case Lookup
        </p>

        <h1 className="mt-4 text-3xl font-bold">
          Browse Public Case Verification
        </h1>

        <p className="mt-3 text-slate-400">
          Enter a MetaCourt case ID to open its public blockchain verification page.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <input
            value={caseId}
            onChange={(e) => setCaseId(e.target.value)}
            placeholder="Example: MC-2024-0001"
            className="flex-1 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-cyan-400"
          />

          <Link
            href={normalizedCaseId ? `/case/${normalizedCaseId}` : "#"}
            className={`rounded-2xl px-6 py-3 text-center font-medium ${
              normalizedCaseId
                ? "bg-cyan-500 text-white hover:bg-cyan-400"
                : "cursor-not-allowed bg-white/10 text-slate-500"
            }`}
          >
            Verify Case
          </Link>
        </div>

        <div className="mt-8 rounded-2xl border border-green-400/20 bg-green-400/10 p-5 text-sm text-green-100">
          Public pages only show safe verification data. Private evidence,
          identities, defense statements, and juror details are never exposed.
        </div>
      </div>
    </main>
  );
}