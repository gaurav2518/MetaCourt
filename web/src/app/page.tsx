import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Gavel,
  LockKeyhole,
  Scale,
  ShieldCheck,
  FileCheck2,
  Users,
  Fingerprint,
  Cpu,
  ChevronRight,
  Sparkles,
} from "lucide-react";

import Navbar from "@/components/layout/Navbar";
import NetworkBackground from "@/components/layout/NetworkBackground";
import { getPublicStats } from "@/lib/publicStats";

const features = [
  {
    icon: Fingerprint,
    title: "Cryptographic Fingerprint",
    description:
      "Every complaint, document, and defense is hashed using SHA-256 at the moment of filing, ensuring retroactive alterations are mathematically impossible.",
  },
  {
    icon: Scale,
    title: "Decentralized Peer Jury",
    description:
      "Cases are randomly assigned to vetted, multi-tier community jurors who cast blind votes based on objective evidence.",
  },
  {
    icon: LockKeyhole,
    title: "Zero-Knowledge Dispute Privacy",
    description:
      "Only case fingerprints and outcomes are stored on public ledgers. Private evidence and identities stay shielded and confidential.",
  },
  {
    icon: Cpu,
    title: "Ethereum Sepolia Anchoring",
    description:
      "Smart contracts record proof digests with deterministic timestamps, generating an immutable, publicly verifiable audit trail.",
  },
];

const steps = [
  {
    title: "File the Dispute Record",
    description:
      "Submit the complaint facts, category, counter-party email, and supporting evidence through a structured 3-step intake form.",
  },
  {
    title: "Anchor Hash on Blockchain",
    description:
      "MetaCourt generates an on-chain cryptographic fingerprint on Ethereum Sepolia before any party can dispute the timeline.",
  },
  {
    title: "Multi-Juror Peer Evaluation",
    description:
      "Verified community jurors evaluate both sides independently under blinded conditions to determine validity.",
  },
  {
    title: "Consensus Verdict & Seal",
    description:
      "Votes are tallied, juror reputation is updated, and a publicly verifiable proof certificate with QR code is generated.",
  },
];

const footerLinks = [
  { label: "File Complaint", href: "/complainant/file" },
  { label: "Verify Case Proof", href: "/case" },
  { label: "Apply as Juror", href: "/complainant/apply-juror" },
  { label: "Sign In", href: "/login" },
  { label: "Create Account", href: "/register" },
];

function formatCount(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

export default async function Home() {
  const stats = await getPublicStats().catch(() => ({
    totalCasesFiled: 0,
    decisionsMade: 0,
    totalJurors: 0,
  }));

  return (
    <main className="relative min-h-screen overflow-hidden bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]">
      <NetworkBackground />

      <div className="relative z-10">
        <Navbar />

        {/* Hero Section */}
        <section className="border-b border-[var(--color-border-subtle)]">
          <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-gold)]/30 bg-[var(--color-gold-subtle)] px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[var(--color-gold)]">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-gold)] animate-pulse" />
                Decentralized Justice Protocol
              </div>

              <h1 className="mt-6 font-display text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl">
                Every Dispute
                <span className="hero-gradient-text block">
                  Deserves Proven Truth
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-lg font-normal leading-8 text-[var(--color-text-secondary)]">
                MetaCourt converts complaint records, digital evidence, and jury consensus into tamper-proof cryptographic proofs without compromising private dispute details.
              </p>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/complainant/file"
                  className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-[var(--color-accent-primary)] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_0_25px_rgba(124,58,237,0.35)] transition duration-150 hover:bg-[var(--color-accent-hover)] focus:outline-2 focus:outline-offset-2 focus:outline-[var(--color-accent-primary)]"
                >
                  <span>File a Complaint</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  href="/case"
                  className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-6 py-3.5 text-sm font-medium text-[var(--color-text-primary)] transition duration-150 hover:border-[var(--color-accent-primary)] hover:bg-[var(--color-bg-elevated)]"
                >
                  <Scale className="h-4 w-4 text-[var(--color-gold)]" />
                  <span>Verify Any Case</span>
                </Link>
              </div>

              {/* Live Platform Stats */}
              <div className="mt-12 grid max-w-xl grid-cols-3 divide-x divide-[var(--color-border)] rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/60 p-4 backdrop-blur-sm">
                <div className="px-4 text-center sm:text-left">
                  <p className="font-display text-2xl font-extrabold text-[var(--color-text-primary)]">
                    {formatCount(stats.totalCasesFiled)}
                  </p>
                  <p className="mt-0.5 text-xs text-[var(--color-text-muted)] font-medium">
                    Cases Filed
                  </p>
                </div>
                <div className="px-4 text-center sm:text-left">
                  <p className="font-display text-2xl font-extrabold text-[var(--color-success)]">
                    {formatCount(stats.decisionsMade)}
                  </p>
                  <p className="mt-0.5 text-xs text-[var(--color-text-muted)] font-medium">
                    Decisions Resolved
                  </p>
                </div>
                <div className="px-4 text-center sm:text-left">
                  <p className="font-display text-2xl font-extrabold text-[var(--color-gold)]">
                    {formatCount(stats.totalJurors)}
                  </p>
                  <p className="mt-0.5 text-xs text-[var(--color-text-muted)] font-medium">
                    Active Jurors
                  </p>
                </div>
              </div>
            </div>

            {/* Interactive Live Case Demonstration Card */}
            <div className="floating-case-card rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/95 p-6 shadow-[0_0_50px_rgba(124,58,237,0.18)] backdrop-blur-xl">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-semibold text-[var(--color-gold)]">
                      MC-2024-0047
                    </span>
                    <span className="text-xs text-[var(--color-text-muted)]">•</span>
                    <span className="text-xs text-[var(--color-text-muted)]">Consumer Dispute</span>
                  </div>
                  <h2 className="mt-3 font-display text-xl font-bold text-[var(--color-text-primary)]">
                    Unauthorized Charge by FastPay Services
                  </h2>
                </div>
                <span className="rounded-full border border-[var(--color-accent-primary)]/40 bg-[var(--color-accent-glow)] px-3 py-1 text-xs font-semibold text-[var(--color-accent-primary)]">
                  Jury Voting Active
                </span>
              </div>

              <div className="my-5 h-px bg-[var(--color-border-subtle)]" />

              <div className="space-y-2.5">
                {[
                  ["Juror #1", "Valid Claim", "text-[var(--color-success)]", "bg-[rgba(16,185,129,0.1)]"],
                  ["Juror #2", "Valid Claim", "text-[var(--color-success)]", "bg-[rgba(16,185,129,0.1)]"],
                  ["Juror #3", "Deliberating...", "text-[var(--color-warning)]", "bg-[rgba(245,158,11,0.1)]"],
                ].map(([juror, vote, color, badgeBg]) => (
                  <div
                    key={juror}
                    className="flex items-center justify-between rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-primary)] px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--color-bg-elevated)] font-mono text-xs text-[var(--color-text-secondary)]">
                        {juror.replace("Juror #", "J")}
                      </span>
                      <span className="text-sm font-medium text-[var(--color-text-secondary)]">
                        Anonymous Peer Juror
                      </span>
                    </div>
                    <span className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${color} ${badgeBg}`}>
                      {vote}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex items-center justify-between rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)] px-4 py-3 text-xs">
                <div className="flex items-center gap-2 font-mono text-[var(--color-text-muted)]">
                  <LockKeyhole className="h-4 w-4 text-[var(--color-accent-primary)]" />
                  <span>SHA-256: 7f3a...9c2e</span>
                </div>
                <span className="flex items-center gap-1.5 font-medium text-[var(--color-success)]">
                  <CheckCircle2 className="h-4 w-4" />
                  Sepolia Confirmed
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Core Architectural Pillars */}
        <section className="px-4 py-20 sm:px-6 lg:px-8 border-b border-[var(--color-border-subtle)] bg-[var(--color-bg-secondary)]/40">
          <div className="mx-auto max-w-7xl">
            <div className="text-center max-w-2xl mx-auto">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-gold)]">
                Cryptographic Architecture
              </p>
              <h2 className="mt-3 font-display text-3xl font-extrabold sm:text-4xl">
                Engineered for Integrity & Discretion
              </h2>
              <p className="mt-4 text-base text-[var(--color-text-secondary)]">
                Traditional arbitration is opaque and slow. MetaCourt provides mathematically verifiable dispute records with complete privacy.
              </p>
            </div>

            <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feat) => {
                const Icon = feat.icon;
                return (
                  <div
                    key={feat.title}
                    className="group rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-6 transition duration-200 hover:-translate-y-1 hover:border-[var(--color-accent-primary)]/50 hover:shadow-xl"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-accent-glow)] text-[var(--color-accent-primary)] transition group-hover:scale-110">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="mt-5 font-display text-lg font-bold text-[var(--color-text-primary)]">
                      {feat.title}
                    </h3>
                    <p className="mt-2.5 text-xs leading-6 text-[var(--color-text-secondary)]">
                      {feat.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* How MetaCourt Works Timeline */}
        <section className="bg-[var(--color-bg-secondary)] px-4 py-20 sm:px-6 lg:px-8 border-b border-[var(--color-border-subtle)]">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="border-l-2 border-[var(--color-accent-primary)] pl-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-gold)]">
                The Protocol Workflow
              </p>
              <h2 className="mt-3 font-display text-3xl font-extrabold sm:text-4xl">
                How a Dispute Moves from Filing to Final Seal
              </h2>
              <p className="mt-4 max-w-md text-sm leading-7 text-[var(--color-text-secondary)]">
                Each step creates transparent, cryptographically tied milestones ensuring neither party can manipulate evidence or delay resolution.
              </p>
              <div className="mt-8">
                <Link
                  href="/complainant/file"
                  className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-accent-primary)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-accent-hover)]"
                >
                  <span>Start a Case</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="space-y-6">
              {steps.map((step, index) => (
                <div
                  key={step.title}
                  className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] p-6 transition hover:border-[var(--color-accent-primary)]/40"
                >
                  <div className="flex items-start gap-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-accent-glow)] font-display text-base font-bold text-[var(--color-accent-primary)]">
                      0{index + 1}
                    </span>
                    <div>
                      <h3 className="font-display text-base font-bold text-[var(--color-text-primary)]">
                        {step.title}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Live Terminal Blockchain Proof Section */}
        <section className="bg-[var(--color-bg-primary)] px-4 py-20 sm:px-6 lg:px-8 border-b border-[var(--color-border-subtle)]">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-gold-subtle)] text-[var(--color-gold)]">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h2 className="mt-6 font-display text-3xl font-extrabold">
                Immutable by Mathematical Design
              </h2>
              <p className="mt-4 max-w-lg text-sm leading-7 text-[var(--color-text-secondary)]">
                When a case is filed or decided, MetaCourt triggers an Ethereum smart contract transaction. Anyone can independently verify that the original dispute statement has never been tampered with.
              </p>
              <div className="mt-6 flex items-center gap-3">
                <Link
                  href="/case"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-gold)] hover:underline"
                >
                  <span>Test the public verifier</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Simulated Blockchain Terminal */}
            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-6 font-mono text-xs leading-7 shadow-2xl text-[var(--color-success)]">
              <div className="mb-4 flex items-center gap-2 border-b border-[var(--color-border-subtle)] pb-3 text-[var(--color-text-muted)]">
                <div className="h-3 w-3 rounded-full bg-red-500/80" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                <div className="h-3 w-3 rounded-full bg-green-500/80" />
                <span className="ml-2 font-mono text-[11px] text-[var(--color-text-muted)]">
                  metacourt-node :: sepolia-mainnet-anchor
                </span>
              </div>
              <p>&gt; Initializing SHA-256 fingerprint generation...</p>
              <p>&gt; Hash digest: 7f3a9b2c6e41d98a0fc43217d8e2098b</p>
              <p>&gt; Broadcasting to Ethereum Sepolia Smart Contract...</p>
              <p>&gt; Transaction hash: 0x8f2a643bb281e0419c830129487b31bc</p>
              <p>&gt; Block confirmed: #4829301 (6 network confirmations)</p>
              <p className="terminal-cursor text-[var(--color-gold)]">
                &gt; Status: PROOF_STORED_PERMANENTLY
              </p>
            </div>
          </div>
        </section>

        {/* Final CTA Banner */}
        <section className="px-4 py-20 text-center sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-10 shadow-2xl">
            <Scale className="mx-auto h-10 w-10 text-[var(--color-accent-primary)]" />
            <h2 className="mt-5 font-display text-3xl font-extrabold">
              Ready to resolve disputes with transparent proof?
            </h2>
            <p className="mt-4 text-base text-[var(--color-text-secondary)]">
              Join MetaCourt today. File complaints, submit defense statements, or become a community juror.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/register"
                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-[var(--color-accent-primary)] px-7 py-3.5 text-sm font-semibold text-white shadow-lg transition duration-150 hover:bg-[var(--color-accent-hover)]"
              >
                <span>Create an Account</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] px-7 py-3.5 text-sm font-medium text-[var(--color-text-primary)] transition hover:bg-[var(--color-bg-elevated)]"
              >
                Sign In
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-4 py-10 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-7xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <Gavel className="h-5 w-5 text-[var(--color-accent-primary)]" />
              <div>
                <p className="font-display text-base font-bold text-[var(--color-text-primary)]">
                  MetaCourt
                </p>
                <p className="text-xs text-[var(--color-text-muted)]">
                  Decentralized Dispute Resolution Protocol
                </p>
              </div>
            </div>

            <nav className="flex flex-wrap gap-5 text-xs text-[var(--color-text-secondary)]">
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
