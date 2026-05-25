"use client";

import type { ReactNode } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

type DashboardShellProps = {
	children: ReactNode;
};

export default function DashboardShell({ children }: DashboardShellProps) {
	return (
		<div className="min-h-screen bg-slate-950 text-white">
			<div className="flex min-h-screen">
				<aside className="hidden lg:block">
					<Sidebar />
				</aside>

				<div className="flex min-h-screen flex-1 flex-col overflow-hidden">
					<Navbar />

					<main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
						<div className="mx-auto w-full max-w-7xl">
							<div className="rounded-[2rem] border border-white/10 bg-white/5 p-4 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-6 lg:p-8">
								<div className="rounded-[1.5rem] border border-white/10 bg-slate-950/70 p-4 sm:p-6 lg:p-8">
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
