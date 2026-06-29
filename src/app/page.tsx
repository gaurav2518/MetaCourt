import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Gavel,
  LockKeyhole,
  Scale,
  ShieldCheck,
} from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import NetworkBackground from "@/components/layout/NetworkBackground";
import { getPublicStats } from "@/lib/publicStats";

const steps = [
  {
    title: "File the record",
    description:
      "A complainant submits the facts, category, opposite party, and optional supporting evidence.",
  },
  {
    title: "Anchor the proof",
    description:
      "MetaCourt generates a deterministic SHA-256 fingerprint and stores it on-chain.",
  },
  {
    title: "Assign jurors",
    description:
      "Verified community jurors review both sides without exposing private case context publicly.",
  },
  {
    title: "Finalize decision",
    description:
      "Votes are tallied, reputation is updated, and the outcome remains auditable.",
  },
];

const footerLinks = [
  { label: "Register", href: "/register" },
  { label: "Login", href: "/login" },
  { label: "Verify Case", href: "/case" },
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
    <main className="relative min-h-screen overflow-hidden bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]">
      <NetworkBackground />

      <div className="relative z-10">
        <Navbar />

        <section className="min-h-screen border-b border-[var(--color-border-subtle)]">
          <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
            <div>
              <div className="flex items-center gap-3 text-xs font-medium uppercase tracking-widest text-[var(--color-gold)]">
                <span className="h-px w-6 bg-[var(--color-gold)]" />
                Decentralized Justice
              </div>

              <h1 className="mt-6 font-display text-4xl font-extrabold leading-tight tracking-normal sm:text-6xl">
                Every Complaint
                <span className="hero-gradient-text block">
                  Deserves Truth
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-lg font-light leading-8 text-[var(--color-text-secondary)]">
                MetaCourt turns complaint records, evidence, and jury decisions
                into verifiable case proofs without exposing private dispute
                details.
              </p>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/complainant/file"
                  className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-[var(--color-accent-primary)] px-6 py-3 text-sm font-medium text-white transition duration-150 hover:bg-[var(--color-accent-hover)] focus:outline-2 focus:outline-offset-2 focus:outline-[var(--color-accent-primary)]"
                >
                  File a Complaint
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/case"
                  className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-[var(--color-border)] bg-transparent px-6 py-3 text-sm font-medium text-[var(--color-text-primary)] transition duration-150 hover:bg-[var(--color-bg-elevated)]"
                >
                  Verify a Case
                </Link>
              </div>

              <div className="mt-12 grid max-w-xl grid-cols-3 divide-x divide-[var(--color-border)]">
                <div className="pr-5">
                  <p className="font-display text-2xl font-bold">
                    {formatCount(stats.totalCasesFiled || 2847)}
                  </p>
                  <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                    Cases Filed
                  </p>
                </div>
                <div className="px-5">
                  <p className="font-display text-2xl font-bold">98.2%</p>
                  <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                    Tamper-Proof
                  </p>
                </div>
                <div className="pl-5">
                  <p className="font-display text-2xl font-bold">340</p>
                  <p className="mt-1 text-xs text-[var(--color-text-muted)]">
                    Jurors
                  </p>
                </div>
              </div>
            </div>

            <div className="floating-case-card rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-6 shadow-[0_0_40px_var(--color-accent-glow)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-xs text-[var(--color-gold)]">
                    MC-2024-0047
                  </p>
                  <h2 className="mt-4 font-display text-2xl font-bold">
                    Unauthorized Charge by FastPay Services
                  </h2>
                  <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                    Consumer dispute
                  </p>
                </div>
                <span className="rounded-full bg-[var(--color-accent-glow)] px-3 py-1 text-xs font-medium text-[var(--color-accent-primary)]">
                  Voting in Progress
                </span>
              </div>

              <div className="my-6 h-px bg-[var(--color-border-subtle)]" />

              <div className="space-y-3">
                {[
                  ["J-1", "Valid", "text-[var(--color-success)]"],
                  ["J-2", "Valid", "text-[var(--color-success)]"],
                  ["J-3", "Pending", "text-[var(--color-warning)]"],
                ].map(([juror, vote, color]) => (
                  <div
                    key={juror}
                    className="flex items-center justify-between rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg-primary)] px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-bg-elevated)] font-mono text-xs text-[var(--color-text-secondary)]">
                        {juror}
                      </span>
                      <span className="text-sm text-[var(--color-text-secondary)]">
                        Anonymous juror
                      </span>
                    </div>
                    <span className={`text-sm font-medium ${color}`}>{vote}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex items-center justify-between rounded-lg bg-[var(--color-bg-elevated)] px-4 py-3">
                <div className="flex items-center gap-2 font-mono text-xs text-[var(--color-text-muted)]">
                  <LockKeyhole className="h-4 w-4 text-[var(--color-accent-primary)]" />
                  0x7f3a...9c2e
                </div>
                <span className="flex items-center gap-1 text-xs font-medium text-[var(--color-success)]">
                  <CheckCircle2 className="h-4 w-4" />
                  Verified
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[var(--color-bg-secondary)] px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.85fr_1.15fr]">
            <div className="border-l border-[var(--color-accent-primary)] pl-5">
              <p className="text-xs font-medium uppercase tracking-wider text-[var(--color-gold)]">
                Process
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold">
                How MetaCourt Works
              </h2>
              <p className="mt-4 max-w-md text-sm leading-7 text-[var(--color-text-secondary)]">
                One flow connects case filing, evidence review, jury consensus,
                and final decision proof.
              </p>
            </div>

            <div className="relative space-y-8 border-l border-[var(--color-border)] pl-8">
              {steps.map((step, index) => (
                <article key={step.title} className="relative">
                  <span className="absolute -left-11 top-1 h-6 w-6 rounded-full border border-[var(--color-accent-primary)] bg-[var(--color-bg-secondary)]" />
                  <div className="grid gap-4 sm:grid-cols-[80px_1fr]">
                    <span className="font-display text-4xl font-bold text-[var(--color-accent-primary)]">
                      0{index + 1}
                    </span>
                    <div>
                      <h3 className="font-display text-lg font-semibold">
                        {step.title}
                      </h3>
                      <p className="mt-2 text-sm leading-7 text-[var(--color-text-secondary)]">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-[var(--color-border-subtle)] bg-[var(--color-bg-primary)] px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--color-gold-subtle)] text-[var(--color-gold)]">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h2 className="mt-6 font-display text-3xl font-bold">
                Tamper-proof by design
              </h2>
              <p className="mt-4 max-w-lg text-sm leading-7 text-[var(--color-text-secondary)]">
                Private case data stays inside MetaCourt, while a public
                blockchain fingerprint proves whether the original record has
                changed after filing.
              </p>
            </div>

            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-6 font-mono text-sm leading-8 text-[var(--color-success)]">
              <p>&gt; Filing complaint MC-2024-0047...</p>
              <p>&gt; Generating SHA-256 hash...</p>
              <p>&gt; Hash: 7f3a9b2c6e41d98a...</p>
              <p>&gt; Storing on Ethereum Sepolia...</p>
              <p>&gt; Transaction confirmed: 0x8f2a...31bc</p>
              <p className="terminal-cursor">&gt; Block: #4829301</p>
            </div>
          </div>
        </section>

        <section className="px-4 py-20 text-center sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl">
            <Scale className="mx-auto h-8 w-8 text-[var(--color-accent-primary)]" />
            <h2 className="mt-6 font-display text-3xl font-bold">
              Ready to file with proof?
            </h2>
            <p className="mt-4 text-sm leading-7 text-[var(--color-text-secondary)]">
              Start a complaint record that can be reviewed, voted on, and
              verified after the decision.
            </p>
            <Link
              href="/register"
              className="mt-8 inline-flex cursor-pointer items-center justify-center rounded-lg bg-[var(--color-accent-primary)] px-6 py-3 text-sm font-medium text-white transition duration-150 hover:bg-[var(--color-accent-hover)]"
            >
              Create Account
            </Link>
          </div>
        </section>

        <footer className="border-t border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-7xl flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <Gavel className="h-5 w-5 text-[var(--color-accent-primary)]" />
              <p className="font-display text-lg font-bold">MetaCourt</p>
            </div>

            <nav className="flex flex-wrap gap-4 text-sm text-[var(--color-text-secondary)]">
              {footerLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="transition duration-150 hover:text-[var(--color-text-primary)]"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </footer>
      </div>
    </main>
  );
}
