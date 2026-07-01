"use client";

import Link from "next/link";
import Image from "next/image";
import { ROLES } from "@/constants";
import { useAuth } from "@/context/AuthContext";
import { Menu } from "lucide-react";

type RoleValue = (typeof ROLES)[keyof typeof ROLES];

const ROLE_LABELS: Record<RoleValue, string> = {
	[ROLES.USER]: "User",
	[ROLES.JUROR]: "Juror",
	[ROLES.ADMIN]: "Admin",
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
		<header className="sticky top-0 z-30 flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-bg-secondary)]/85 px-6 py-4 text-[var(--color-text-primary)] backdrop-blur-xl sm:px-8">
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
						<div className="space-y-1">
							<p className="text-xs font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
								MetaCourt Workspace
							</p>
							<h2 className="font-display text-lg font-bold tracking-normal text-[var(--color-text-primary)]">
								Welcome back{user.name ? `, ${user.name}` : ""}
							</h2>
						</div>
					</div>

					<div className="flex items-center gap-3">
						<div className="hidden text-right sm:block">
							<p className="text-sm font-medium text-[var(--color-text-primary)]">
								{user.name ?? "Unknown User"}
							</p>
							<p className="text-xs text-[var(--color-text-muted)]">{roleLabel}</p>
						</div>

						<div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[var(--color-accent-glow)] font-semibold text-[var(--color-accent-primary)]">
							{(user.name?.[0] ?? "U").toUpperCase()}
						</div>

						<button
							type="button"
							onClick={logout}
							className="inline-flex items-center justify-center rounded-lg border border-[var(--color-border)] bg-transparent px-4 py-2.5 text-sm font-medium text-[var(--color-text-primary)] transition duration-150 hover:bg-[var(--color-bg-elevated)]"
						>
							Logout
						</button>
					</div>
				</>
			) : (
				<>
					<Link href="/" className="flex items-center gap-3">
						<div className="relative h-10 w-10 overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-primary)]">
							<Image
								src="/metacourt-logo.png"
								alt="MetaCourt"
								fill
								sizes="40px"
								className="object-contain"
							/>
						</div>
						<span className="font-display text-xl font-bold tracking-tight text-[var(--color-text-primary)]">
							MetaCourt
						</span>
					</Link>

					<div className="flex items-center gap-4">
						<Link
							href="/login"
							className="text-sm font-medium text-[var(--color-text-secondary)] transition duration-150 hover:text-[var(--color-text-primary)]"
						>
							Log In
						</Link>
						<Link
							href="/register"
							className="rounded-lg border border-[var(--color-border)] bg-transparent px-4 py-2 text-sm font-medium text-[var(--color-text-primary)] transition duration-150 hover:bg-[var(--color-bg-elevated)]"
						>
							Register
						</Link>
					</div>
				</>
			)}
		</header>
	);
}
