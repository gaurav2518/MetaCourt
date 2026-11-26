import Link from "next/link";
import Image from "next/image";
import NetworkBackground from "@/components/layout/NetworkBackground";
import { ShieldCheck, Scale, LockKeyhole, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function AuthLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<main className="relative min-h-screen overflow-hidden bg-[var(--color-bg-primary)] px-4 py-8 text-[var(--color-text-primary)] sm:px-6 lg:px-8">
			<NetworkBackground />

			{/* Top Bar with Home Link */}
			<div className="relative z-10 mx-auto max-w-6xl flex items-center justify-between pb-6">
				<Link href="/" className="group flex items-center gap-3">
					<div className="relative h-9 w-9 overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-1 transition group-hover:border-[var(--color-accent-primary)]">
						<Image
							src="/metacourt-logo.png"
							alt="MetaCourt"
							fill
							sizes="36px"
							className="object-contain"
						/>
					</div>
					<span className="font-display text-lg font-bold tracking-tight text-[var(--color-text-primary)]">
						MetaCourt
					</span>
				</Link>

				<Link
					href="/"
					className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--color-text-secondary)] transition hover:text-[var(--color-text-primary)]"
				>
					<ArrowLeft className="h-3.5 w-3.5" />
					<span>Back to Home</span>
				</Link>
			</div>

			{/* Central Split Layout */}
			<div className="relative z-10 mx-auto my-auto flex min-h-[calc(100vh-8rem)] max-w-6xl items-center justify-center">
				<div className="grid w-full gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
					{/* Left Brand Showcase Column */}
					<div className="hidden lg:block space-y-8 pr-8">
						<div>
							<div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-gold)]/30 bg-[var(--color-gold-subtle)] px-3 py-1 text-xs font-semibold text-[var(--color-gold)]">
								<Scale className="h-3.5 w-3.5" />
								<span>On-Chain Justice Protocol</span>
							</div>

							<h1 className="mt-5 font-display text-4xl font-extrabold leading-tight">
								Empowering Truth Through
								<span className="hero-gradient-text block">
									Decentralized Consensus
								</span>
							</h1>

							<p className="mt-4 text-sm leading-7 text-[var(--color-text-secondary)]">
								Access dispute records, file cryptographic complaints, provide counter-evidence, and participate in anonymous peer jury deliberation.
							</p>
						</div>

						{/* Feature Pills */}
						<div className="space-y-3.5">
							<div className="flex items-start gap-3 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-secondary)]/70 p-3.5 backdrop-blur-sm">
								<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--color-accent-glow)] text-[var(--color-accent-primary)]">
									<LockKeyhole className="h-4 w-4" />
								</div>
								<div>
									<p className="text-xs font-semibold text-[var(--color-text-primary)]">
										Zero-Knowledge Dispute Privacy
									</p>
									<p className="text-[11px] text-[var(--color-text-muted)]">
										Private evidence remains confidential. Only proof fingerprints are broadcasted.
									</p>
								</div>
							</div>

							<div className="flex items-start gap-3 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-secondary)]/70 p-3.5 backdrop-blur-sm">
								<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[rgba(16,185,129,0.15)] text-[var(--color-success)]">
									<ShieldCheck className="h-4 w-4" />
								</div>
								<div>
									<p className="text-xs font-semibold text-[var(--color-text-primary)]">
										Ethereum Sepolia Anchoring
									</p>
									<p className="text-[11px] text-[var(--color-text-muted)]">
										Case hashes and juror verdicts are locked irrevocably on-chain.
									</p>
								</div>
							</div>

							<div className="flex items-start gap-3 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-secondary)]/70 p-3.5 backdrop-blur-sm">
								<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--color-gold-subtle)] text-[var(--color-gold)]">
									<Scale className="h-4 w-4" />
								</div>
								<div>
									<p className="text-xs font-semibold text-[var(--color-text-primary)]">
										Incentivized Peer Jurors
									</p>
									<p className="text-[11px] text-[var(--color-text-muted)]">
										Jurors earn reputation and increased voting power by aligning with factual consensus.
									</p>
								</div>
							</div>
						</div>

						{/* Live Status Pill */}
						<div className="flex items-center gap-3 text-xs text-[var(--color-text-muted)] font-mono">
							<span className="flex h-2 w-2 rounded-full bg-[var(--color-success)] animate-pulse" />
							<span>Smart Contract Active • Sepolia Testnet</span>
						</div>
					</div>

					{/* Right Form Column */}
					<div className="flex justify-center w-full">
						{children}
					</div>
				</div>
			</div>
		</main>
	);
}
