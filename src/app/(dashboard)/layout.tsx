"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardShell from "@/components/layout/DashboardShell";
import { useAuth } from "@/context/AuthContext";

export default function DashboardLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const router = useRouter();
	const { user, loading } = useAuth();

	useEffect(() => {
		if (!loading && !user) {
			router.replace("/login");
		}
	}, [loading, router, user]);

	if (loading || !user) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
				<div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-sm text-slate-300 shadow-xl shadow-black/20">
					Loading dashboard...
				</div>
			</div>
		);
	}

	return <DashboardShell>{children}</DashboardShell>;
}
