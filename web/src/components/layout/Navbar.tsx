"use client";

import Link from "next/link";
import Image from "next/image";
import { ROLES } from "@/constants";
import { useAuth } from "@/context/AuthContext";
import { Menu, ShieldCheck, Scale, ArrowRight, ExternalLink } from "lucide-react";

type RoleValue = (typeof ROLES)[keyof typeof ROLES];

const ROLE_LABELS: Record<RoleValue, string> = {
	[ROLES.USER]: "Complainant / Respondent",
	[ROLES.JUROR]: "Juror",
	[ROLES.ADMIN]: "Administrator",
};

interface NavbarProps {
	onToggleSidebar?: () => void;
}

export default function Navbar({ onToggleSidebar }: NavbarProps) {
	const { user, logout } = useAuth();

	const roleLabel = user?.role
		? ROLE_LABELS[user.role as RoleValue] ?? user.role.replace("_", " ")
		: "Guest";

	return (
		<header className="sticky top-0 z-30 flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-bg-secondary)]/90 px-4 py-3.5 text-[var(--color-text-primary)] backdrop-blur-xl sm:px-8">
			{user ? (
				<>
					<div className="flex items-center gap-3">
						{onToggleSidebar && (
							<button
								type="button"
								onClick={onToggleSidebar}
								className="mr-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-primary)] p-2 text-[var(--color-text-primary)] transition duration-150 hover:bg-[var(--color-bg-elevated)] lg:hidden"
								aria-label="Toggle navigation menu"
							>
								<Menu className="h-5 w-5" />
							</button>
						)}
						<div className="space-y-0.5">
							<div className="flex items-center gap-2">
								<p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-gold)]">
									MetaCourt Protocol
								</p>
								<span className="hidden h-1 w-1 rounded-full bg-[var(--color-text-muted)] sm:inline-block" />
								<span className="hidden text-xs text-[var(--color-text-muted)] sm:inline-block">
									{roleLabel}
								</span>
							</div>
							<h2 className="font-display text-base font-bold tracking-tight text-[var(--color-text-primary)] sm:text-lg">
								Welcome, {user.name || "Member"}
							</h2>
						</div>
					</div>

					<div className="flex items-center gap-3 sm:gap-4">
						{/* Sepolia Network Badge */}
						<div className="hidden items-center gap-2 rounded-full border border-[var(--color-border-subtle)] bg-[var(--color-bg-primary)] px-3 py-1 text-xs md:flex">
							<span className="relative flex h-2 w-2">
								<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-success)] opacity-75" />
								<span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--color-success)]" />
							</span>
							<span className="font-mono text-[11px] text-[var(--color-text-secondary)]">Sepolia Testnet</span>
						</div>

						{/* Public Verification Link */}
						<Link
							href="/case"
							className="hidden items-center gap-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-primary)] px-3 py-1.5 text-xs font-medium text-[var(--color-text-secondary)] transition hover:border-[var(--color-accent-primary)] hover:text-[var(--color-text-primary)] sm:inline-flex"
						>
							<Scale className="h-3.5 w-3.5 text-[var(--color-gold)]" />
							<span>Verify Case</span>
						</Link>

						{/* User Avatar */}
						<div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-accent-glow)] font-display text-sm font-bold text-[var(--color-accent-primary)] shadow-sm">
							{(user.name?.[0] ?? "U").toUpperCase()}
						</div>

						<button
							type="button"
							onClick={logout}
							className="inline-flex items-center justify-center rounded-lg border border-[var(--color-border)] bg-transparent px-3 py-1.5 text-xs font-medium text-[var(--color-text-secondary)] transition duration-150 hover:bg-[rgba(239,68,68,0.1)] hover:border-[rgba(239,68,68,0.2)] hover:text-[var(--color-danger)]"
						>
							Logout
						</button>
					</div>
				</>
			) : (
				<>
					<Link href="/" className="flex items-center gap-3 group">
						<div className="relative h-10 w-10 overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] p-1 transition group-hover:border-[var(--color-accent-primary)]">
							<Image
								src="/metacourt-logo.png"
								alt="MetaCourt"
								fill
								sizes="40px"
								className="object-contain"
							/>
						</div>
						<div>
							<span className="font-display text-xl font-bold tracking-tight text-[var(--color-text-primary)]">
								MetaCourt
							</span>
							<p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-gold)]">
								Truth On-Chain
							</p>
						</div>
					</Link>

					<div className="flex items-center gap-3 sm:gap-6">
						<Link
							href="/case"
							className="hidden text-sm font-medium text-[var(--color-text-secondary)] transition duration-150 hover:text-[var(--color-text-primary)] sm:inline-flex items-center gap-1.5"
						>
							<Scale className="h-4 w-4 text-[var(--color-gold)]" />
							Verify Case
						</Link>
						<Link
							href="/login"
							className="text-sm font-medium text-[var(--color-text-secondary)] transition duration-150 hover:text-[var(--color-text-primary)]"
						>
							Log In
						</Link>
						<Link
							href="/register"
							className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--color-accent-primary)] px-4 py-2 text-sm font-medium text-white shadow-md transition duration-150 hover:bg-[var(--color-accent-hover)]"
						>
							<span>Get Started</span>
							<ArrowRight className="h-3.5 w-3.5" />
						</Link>
					</div>
				</>
			)}
		</header>
	);
}
