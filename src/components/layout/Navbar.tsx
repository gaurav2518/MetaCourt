"use client";

import { ROLES } from "@/constants";
import { useAuth } from "@/context/AuthContext";

type RoleValue = (typeof ROLES)[keyof typeof ROLES];

const ROLE_LABELS: Record<RoleValue, string> = {
	[ROLES.COMPLAINANT]: "Complainant",
	[ROLES.OPPOSITE_PARTY]: "Opposite Party",
	[ROLES.JUROR]: "Juror",
	[ROLES.ADMIN]: "Admin",
};

export default function Navbar() {
	const { user, logout } = useAuth();

	const roleLabel = user?.role
		? ROLE_LABELS[user.role as RoleValue] ?? user.role.replace("_", " ")
		: "Guest";

	return (
		<header className="flex items-center justify-between border-b border-white/10 bg-slate-950/95 px-6 py-4 text-white backdrop-blur-xl sm:px-8">
			<div className="space-y-1">
				<p className="text-xs uppercase tracking-[0.28em] text-slate-400">
					MetaCourt Workspace
				</p>
				<h2 className="text-lg font-semibold tracking-tight text-white">
					Welcome back{user?.name ? `, ${user.name}` : ""}
				</h2>
			</div>

			<div className="flex items-center gap-3">
				<div className="hidden text-right sm:block">
					<p className="text-sm font-medium text-white">
						{user?.name ?? "Unknown User"}
					</p>
					<p className="text-xs text-slate-400">{roleLabel}</p>
				</div>

				<div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-indigo-600 font-semibold text-white shadow-lg shadow-cyan-500/20">
					{(user?.name?.[0] ?? "U").toUpperCase()}
				</div>

				<button
					type="button"
					onClick={logout}
					className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/10"
				>
					Logout
				</button>
			</div>
		</header>
	);
}
