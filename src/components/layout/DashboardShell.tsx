"use client";

import { useState, type ReactNode } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

type DashboardShellProps = {
	children: ReactNode;
};

export default function DashboardShell({ children }: DashboardShellProps) {
	const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

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
						<div className="mx-auto w-full max-w-7xl">
							<div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/80 p-4 backdrop-blur-xl sm:p-6 lg:p-8">
								<div className="rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg-primary)]/75 p-4 sm:p-6 lg:p-8">
									{children}
								</div>
							</div>
						</div>
					</main>
				</div>
			</div>
		</div>
	);
}

