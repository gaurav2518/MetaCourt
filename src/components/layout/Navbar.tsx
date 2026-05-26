"use client";

import Link from "next/link";
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
		<header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/10 bg-slate-950/55 px-6 py-4 text-white shadow-sm shadow-black/10 backdrop-blur-xl supports-backdrop-filter:bg-slate-950/45 sm:px-8">
			{user ? (
				<>
					<div className="flex items-center gap-3">
						{onToggleSidebar && (
							<button
								type="button"
								onClick={onToggleSidebar}
								className="mr-1 rounded-xl border border-white/10 bg-white/5 p-2 text-white transition hover:bg-white/10 lg:hidden"
								aria-label="Toggle navigation menu"
							>
								<Menu className="h-5 w-5" />
							</button>
						)}
						<div className="space-y-1">
							<p className="text-xs uppercase tracking-[0.28em] text-slate-400">
								MetaCourt Workspace
							</p>
							<h2 className="text-lg font-semibold tracking-tight text-white">
								Welcome back{user.name ? `, ${user.name}` : ""}
							</h2>
						</div>
					</div>

					<div className="flex items-center gap-3">
						<div className="hidden text-right sm:block">
							<p className="text-sm font-medium text-white">
								{user.name ?? "Unknown User"}
							</p>
							<p className="text-xs text-slate-400">{roleLabel}</p>
						</div>

						<div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-indigo-600 font-semibold text-white shadow-lg shadow-cyan-500/20">
							{(user.name?.[0] ?? "U").toUpperCase()}
						</div>

						<button
							type="button"
							onClick={logout}
							className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/10"
						>
							Logout
						</button>
					</div>
				</>
			) : (
				<>
					<Link href="/" className="flex items-center gap-3">
						<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 font-bold text-white shadow-lg shadow-cyan-500/20">
							M
						</div>
						<span className="text-xl font-semibold tracking-tight text-white">
							MetaCourt
						</span>
					</Link>

					<div className="flex items-center gap-4">
						<Link
							href="/login"
							className="text-sm font-medium text-slate-300 transition hover:text-white"
						>
							Log In
						</Link>
						<Link
							href="/register"
							className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
						>
							Register
						</Link>
					</div>
				</>
			)}
		</header>
	);
}