import React, { ElementType } from "react";
import Card from "./Card";

type StatIconColor =
	| "accent"
	| "gold"
	| "danger"
	| "success"
	| "info"
	| "cyan"
	| "indigo"
	| "purple"
	| "rose"
	| "emerald";

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
	iconColor = "accent",
}: StatCardProps) {
	const iconColorMap: Record<StatIconColor, string> = {
		accent: "bg-[var(--color-accent-glow)] text-[var(--color-accent-primary)]",
		gold: "bg-[var(--color-gold-subtle)] text-[var(--color-gold)]",
		danger: "bg-[rgba(239,68,68,0.15)] text-[var(--color-danger)]",
		success: "bg-[rgba(16,185,129,0.15)] text-[var(--color-success)]",
		info: "bg-[rgba(59,130,246,0.15)] text-[var(--color-info)]",
		cyan: "bg-[var(--color-accent-glow)] text-[var(--color-accent-primary)]",
		indigo: "bg-[var(--color-accent-glow)] text-[var(--color-accent-primary)]",
		purple: "bg-[var(--color-accent-glow)] text-[var(--color-accent-primary)]",
		rose: "bg-[rgba(239,68,68,0.15)] text-[var(--color-danger)]",
		emerald: "bg-[rgba(16,185,129,0.15)] text-[var(--color-success)]",
	};

	return (
		<Card variant="glass" className={`flex items-start gap-5 p-6 ${className}`}>
			<div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${iconColorMap[iconColor]}`}>
				<Icon className="h-6 w-6" />
			</div>
			
			<div className="flex-1 space-y-1">
				<p className="text-xs font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
					{label}
				</p>
				<h3 className="font-display text-2xl font-bold tracking-normal text-[var(--color-text-primary)] sm:text-3xl">
					{value}
				</h3>
				{description && (
					<p className="text-xs text-[var(--color-text-secondary)]">
						{description}
					</p>
				)}
			</div>
		</Card>
	);
}
