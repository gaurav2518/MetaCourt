"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { useDisputeNotifications } from "@/context/NotificationContext";
import { ShieldAlert, ArrowRight, X } from "lucide-react";

type DashboardShellProps = {
	children: ReactNode;
};

export default function DashboardShell({ children }: DashboardShellProps) {
	const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
	const { notifications, isAlertDismissed, dismissAlert } = useDisputeNotifications();

	const activeActionNotifs = notifications.filter(
		(n) => n.needsResponse && !isAlertDismissed(n.caseId)
	);
	const primaryNotif = activeActionNotifs[0];

	return (
		<div className="dashboard-grid-bg min-h-screen text-[var(--color-text-primary)]">
			<div className="flex min-h-screen">
				{/* Desktop Sidebar */}
				<aside className="hidden lg:block">
					<Sidebar />
				</aside>

				{/* Mobile Sidebar Overlay Backdrop */}
				{isMobileSidebarOpen && (
					<div
						className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs transition-opacity lg:hidden"
						onClick={() => setIsMobileSidebarOpen(false)}
					/>
				)}

				{/* Mobile Sidebar Drawer */}
				<div
					className={`fixed inset-y-0 left-0 z-50 flex h-full w-72 transform transition-transform duration-300 ease-in-out lg:hidden ${
						isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
					}`}
				>
					<Sidebar onClose={() => setIsMobileSidebarOpen(false)} />
				</div>

				<div className="flex min-h-screen flex-1 flex-col overflow-hidden">
					<Navbar onToggleSidebar={() => setIsMobileSidebarOpen((prev) => !prev)} />

					<main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
						<div className="mx-auto w-full max-w-7xl space-y-6">
							{/* Urgent Dispute Notice Popup Banner */}
							{primaryNotif && (
								<div className="relative overflow-hidden rounded-2xl border border-[rgba(239,68,68,0.4)] bg-gradient-to-r from-[rgba(239,68,68,0.18)] via-[rgba(239,68,68,0.08)] to-transparent p-4 sm:p-5 shadow-xl backdrop-blur-xl animate-in fade-in slide-in-from-top-3 duration-200">
									<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
										<div className="flex items-start gap-3.5">
											<div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[rgba(239,68,68,0.25)] text-[var(--color-danger)] shadow-inner">
												<ShieldAlert className="h-6 w-6 animate-pulse" />
											</div>
											<div className="space-y-1">
												<div className="flex flex-wrap items-center gap-2">
													<span className="font-display text-sm font-bold text-[var(--color-danger)]">
														Dispute Filed Against You
													</span>
													<span className="rounded-full bg-[rgba(239,68,68,0.25)] px-2 py-0.5 text-[10px] font-bold text-[var(--color-danger)]">
														Action Required
													</span>
													<span className="font-mono text-xs font-semibold text-[var(--color-gold)]">
														{primaryNotif.caseId}
													</span>
												</div>
												<p className="text-xs text-[var(--color-text-secondary)] leading-relaxed max-w-2xl">
													{activeActionNotifs.length > 1
														? `You have ${activeActionNotifs.length} active dispute cases filed against you that require your defense statement and evidence before jury voting begins.`
														: `A complaint ("${primaryNotif.title}") has been registered against your account. Review the claims and submit your defense statement and evidence before community jury deliberation.`}
												</p>
											</div>
										</div>

										<div className="flex items-center gap-2.5 sm:shrink-0">
											<Link
												href={primaryNotif.actionUrl}
												className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--color-danger)] px-4 py-2 text-xs font-bold text-white shadow-md transition hover:bg-red-600 active:scale-95"
											>
												<span>Review & Respond</span>
												<ArrowRight className="h-3.5 w-3.5" />
											</Link>
											<button
												type="button"
												onClick={() => dismissAlert(primaryNotif.caseId)}
												className="rounded-xl border border-[rgba(239,68,68,0.3)] bg-[rgba(239,68,68,0.1)] p-2 text-[var(--color-text-secondary)] transition hover:bg-[rgba(239,68,68,0.2)] hover:text-white"
												title="Dismiss this alert"
												aria-label="Dismiss this alert"
											>
												<X className="h-4 w-4" />
											</button>
										</div>
									</div>
								</div>
							)}

							{children}
						</div>
					</main>
				</div>
			</div>
		</div>
	);
}
