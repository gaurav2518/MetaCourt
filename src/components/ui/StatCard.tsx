import React, { ElementType } from "react";
import Card from "./Card";

type StatIconColor = "cyan" | "indigo" | "purple" | "rose" | "emerald";

interface StatCardProps {
	label: string;
	value: string | number;
	icon: ElementType;
	description?: string;
	className?: string;
	iconColor?: StatIconColor;
}

export default function StatCard({
	label,
	value,
	icon: Icon,
	description,
	className = "",
	iconColor = "cyan",
}: StatCardProps) {
	// Color theme map for the icon container
	const iconColorMap: Record<StatIconColor, string> = {
		cyan: "bg-cyan-500/10 border-cyan-500/20 text-cyan-400 shadow-lg shadow-cyan-500/5",
		indigo: "bg-indigo-500/10 border-indigo-500/20 text-indigo-400 shadow-lg shadow-indigo-500/5",
		purple: "bg-purple-500/10 border-purple-500/20 text-purple-400 shadow-lg shadow-purple-500/5",
		rose: "bg-rose-500/10 border-rose-500/20 text-rose-400 shadow-lg shadow-rose-500/5",
		emerald: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400 shadow-lg shadow-emerald-500/5",
	};

	return (
		<Card variant="glass" className={`flex items-start gap-5 p-6 ${className}`}>
			<div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border ${iconColorMap[iconColor]}`}>
				<Icon className="h-6 w-6" />
			</div>
			
			<div className="flex-1 space-y-1">
				<p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
					{label}
				</p>
				<h3 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
					{value}
				</h3>
				{description && (
					<p className="text-xs text-slate-400">
						{description}
					</p>
				)}
			</div>
		</Card>
	);
}
