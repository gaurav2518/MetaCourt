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
			<div className="flex min-h-screen items-center justify-center bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]">
				<div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-6 py-4 text-sm text-[var(--color-text-secondary)]">
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
			<main className="dashboard-grid-bg relative min-h-screen overflow-hidden bg-[var(--color-bg-primary)] px-4 py-10 sm:px-6 lg:px-8">

				<div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-xl items-center justify-center">
					<div className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-1">
						<div className="space-y-6 rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg-secondary)] p-8 text-center">
							<div className="mx-auto flex h-16 w-16 items-center justify-center rounded-lg border border-[rgba(239,68,68,0.25)] bg-[rgba(239,68,68,0.12)] text-[var(--color-danger)]">
								<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
									<path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286Zm0 13.036h.008v.008H12v-.008Z" />
								</svg>
							</div>
							
							<div className="space-y-2">
								<h1 className="font-display text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">
									Account Suspended
								</h1>
								<p className="text-sm leading-6 text-[var(--color-text-secondary)]">
									Your account has been banned from the MetaCourt platform. You no longer have access to dispute resolution services.
								</p>
							</div>

							<div className="rounded-lg border border-[rgba(239,68,68,0.20)] bg-[rgba(239,68,68,0.08)] px-4 py-3 text-xs leading-5 text-[var(--color-danger)]">
								Reason: Violating community guidelines or consensus voting integrity rules.
							</div>

							<button
								type="button"
								onClick={logout}
								className="inline-flex w-full items-center justify-center rounded-lg bg-[var(--color-danger)] px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
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

