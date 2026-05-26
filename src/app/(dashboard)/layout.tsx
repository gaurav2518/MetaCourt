"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import DashboardShell from "@/components/layout/DashboardShell";
import { useAuth } from "@/context/AuthContext";

export default function DashboardLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const router = useRouter();
	const pathname = usePathname();
	const { user, loading, logout } = useAuth();

	useEffect(() => {
		if (loading) return;

		if (!user) {
			router.replace("/login");
			return;
		}

		if (user.isBanned) {
			return;
		}

		const isPathAdmin = pathname?.startsWith("/admin");
		const isPathJuror = pathname?.startsWith("/juror");
		const isPathComplainant = pathname?.startsWith("/complainant");
		const isPathOpposite = pathname?.startsWith("/opposite-party");

		if (user.role === "admin") {
			if (!isPathAdmin) {
				router.replace("/admin");
			}
		} else if (user.role === "juror") {
			if (!isPathJuror && !isPathComplainant && !isPathOpposite) {
				router.replace("/juror");
			}
		} else if (user.role === "user") {
			if (isPathAdmin || isPathJuror || (!isPathComplainant && !isPathOpposite)) {
				router.replace("/complainant");
			}
		}
	}, [loading, router, user, pathname]);

	if (loading) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
				<div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-sm text-slate-300 shadow-xl shadow-black/20">
					Loading dashboard...
				</div>
			</div>
		);
	}

	if (!user) {
		return null;
	}

	if (user.isBanned) {
		return (
			<main className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-10 sm:px-6 lg:px-8">
				<div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(244,63,94,0.15),_transparent_28%),radial-gradient(circle_at_bottom_left,_rgba(244,63,94,0.12),_transparent_32%),linear-gradient(180deg,_rgba(2,6,23,0.98),_rgba(15,23,42,1))]" />
				<div className="absolute left-1/2 top-0 -z-10 h-80 w-80 -translate-x-1/2 rounded-full bg-rose-500/10 blur-3xl" />
				<div className="absolute bottom-0 right-0 -z-10 h-96 w-96 rounded-full bg-rose-500/10 blur-3xl" />

				<div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-xl items-center justify-center">
					<div className="w-full rounded-[2rem] border border-white/10 bg-white/5 p-1 shadow-2xl shadow-black/30 backdrop-blur-xl">
						<div className="rounded-[1.75rem] border border-white/10 bg-slate-950/70 p-8 text-center space-y-6">
							<div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 shadow-lg shadow-rose-500/15">
								<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
									<path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286Zm0 13.036h.008v.008H12v-.008Z" />
								</svg>
							</div>
							
							<div className="space-y-2">
								<h1 className="text-2xl font-bold tracking-tight text-white">
									Account Suspended
								</h1>
								<p className="text-sm leading-6 text-slate-300">
									Your account has been banned from the MetaCourt platform. You no longer have access to dispute resolution services.
								</p>
							</div>

							<div className="rounded-2xl border border-rose-500/10 bg-rose-500/5 px-4 py-3 text-xs leading-5 text-rose-300/80">
								Reason: Violating community guidelines or consensus voting integrity rules.
							</div>

							<button
								type="button"
								onClick={logout}
								className="inline-flex w-full items-center justify-center rounded-2xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-rose-500 hover:shadow-lg hover:shadow-rose-600/20 focus:ring-4 focus:ring-rose-500/20"
							>
								Logout
							</button>
						</div>
					</div>
				</div>
			</main>
		);
	}

	return <DashboardShell>{children}</DashboardShell>;
}

