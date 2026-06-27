import Link from "next/link";
import {
  ArrowRight,
  DatabaseZap,
  FileText,
  Gavel,
  LockKeyhole,
  Scale,
  ShieldCheck,
  UploadCloud,
  Users,
} from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import { getPublicStats } from "@/lib/publicStats";

const steps = [
  {
    title: "File",
    description: "A complainant opens a case with the core facts, category, and opposite party details.",
    icon: FileText,
  },
  {
    title: "Evidence",
    description: "Documents, screenshots, and proofs are uploaded and linked to the case record.",
    icon: UploadCloud,
  },
  {
    title: "Jury",
    description: "Verified jurors review both sides and cast anonymous votes within the case window.",
    icon: Users,
  },
  {
    title: "Decision",
    description: "The outcome is finalized, recorded, and tied back to the on-chain case proof.",
    icon: Gavel,
  },
];

const footerLinks = [
  { label: "Register", href: "/register" },
  { label: "Login", href: "/login" },
  { label: "Browse Cases", href: "/case" },
];

function formatCount(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

export default async function Home() {
  const stats = await getPublicStats().catch(() => ({
    totalCasesFiled: 0,
    decisionsMade: 0,
  }));

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <Navbar />

      <section className="border-b border-white/10 bg-[linear-gradient(180deg,#0a0a0a_0%,#111827_58%,#0a0a0a_100%)]">
        <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-lg border border-emerald-400/25 bg-emerald-400/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-200">
              <ShieldCheck className="h-4 w-4" />
              On-chain dispute records
            </div>

            <h1 className="text-4xl font-bold tracking-normal text-white sm:text-6xl lg:text-7xl">
              MetaCourt
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300 sm:text-xl">
              A blockchain-backed complaint and jury decision platform for transparent, tamper-resistant dispute resolution.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-500 px-6 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-400"
              >
                Register
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/case"
                className="inline-flex items-center justify-center rounded-lg border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Browse Cases
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-lg border border-white/10 bg-zinc-900/80 p-5 shadow-2xl shadow-black/30">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">Case proof</p>
                  <p className="mt-1 font-mono text-sm text-zinc-200">MC-2026-0001</p>
                </div>
                <LockKeyhole className="h-5 w-5 text-emerald-300" />
              </div>

              <div className="space-y-4 py-5">
                <div className="rounded-lg border border-white/10 bg-black/30 p-4">
                  <div className="mb-3 flex items-center gap-2 text-sm font-medium text-white">
                    <DatabaseZap className="h-4 w-4 text-sky-300" />
                    SHA-256 fingerprint
                  </div>
                  <p className="break-all font-mono text-xs leading-6 text-zinc-400">
                    8fd9a72c4a0ef0b1e12d9a7e6c2b51f94e0c31a7d8b640c915a3b09d4f8e231a
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
                    <p className="text-xs text-zinc-500">Status</p>
                    <p className="mt-1 text-sm font-semibold text-amber-200">Voting</p>
                  </div>
                  <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
                    <p className="text-xs text-zinc-500">Jurors</p>
                    <p className="mt-1 text-sm font-semibold text-sky-200">3 assigned</p>
                  </div>
                  <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
                    <p className="text-xs text-zinc-500">Record</p>
                    <p className="mt-1 text-sm font-semibold text-emerald-200">Anchored</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 border-t border-white/10 pt-4 text-sm text-zinc-400">
                <Scale className="h-4 w-4 text-violet-300" />
                Evidence, votes, and decisions remain auditable after finalization.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-zinc-950 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-300">
              How it works
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-normal text-white sm:text-4xl">
              From complaint to decision in four steps
            </h2>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <article key={step.title} className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-white/10 text-emerald-200">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="font-mono text-sm text-zinc-500">
                      0{index + 1}
                    </span>
                  </div>

                  <h3 className="mt-6 text-xl font-semibold text-white">{step.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-zinc-400">{step.description}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-zinc-900 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-300">
              Trust layer
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-normal text-white sm:text-4xl">
              Tamper-proof by design
            </h2>
          </div>

          <div className="rounded-lg border border-white/10 bg-black/25 p-6">
            <p className="text-base leading-8 text-zinc-300">
              MetaCourt creates a deterministic hash from the complaint record and stores that proof on-chain. The case can keep private details inside the app while the blockchain preserves a public fingerprint that exposes later tampering.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
                <p className="text-sm font-semibold text-white">Immutable case proof</p>
                <p className="mt-2 text-sm leading-6 text-zinc-400">
                  Any changed field creates a different hash.
                </p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
                <p className="text-sm font-semibold text-white">Auditable decisions</p>
                <p className="mt-2 text-sm leading-6 text-zinc-400">
                  Finalized outcomes are tied to the same case identity.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="stats" className="bg-zinc-950 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-300">
                Live platform stats
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-normal text-white sm:text-4xl">
                Public case activity
              </h2>
            </div>
            <Link href="/api/stats/public" className="text-sm font-medium text-zinc-400 transition hover:text-white">
              View public stats API
            </Link>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-white/10 bg-white/[0.04] p-6">
              <p className="text-sm text-zinc-400">Total cases filed</p>
              <p className="mt-3 text-5xl font-semibold text-white">
                {formatCount(stats.totalCasesFiled)}
              </p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/[0.04] p-6">
              <p className="text-sm text-zinc-400">Decisions made</p>
              <p className="mt-3 text-5xl font-semibold text-white">
                {formatCount(stats.decisionsMade)}
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-black px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-lg font-semibold text-white">MetaCourt</p>
            <p className="mt-2 text-sm text-zinc-500">
              Blockchain-backed complaint resolution.
            </p>
          </div>

          <nav className="flex flex-wrap gap-4 text-sm text-zinc-400">
            {footerLinks.map((link) => (
              <Link key={link.href} href={link.href} className="transition hover:text-white">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </footer>
    </main>
  );
}
