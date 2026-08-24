import React from "react";

type BadgeType = "status" | "category" | "decision" | "vote" | "generic";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
	value: string;
	type?: BadgeType;
	className?: string;
}

// Function to format snake_case to Title Case (e.g. under_review -> Under Review)
function formatValue(val: string): string {
	if (!val) return "";
	return val
		.split(/[_-]/)
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
		.join(" ");
}

export default function Badge({
	value,
	type = "generic",
	className = "",
	...rest
}: BadgeProps) {
	const normalized = value?.toLowerCase() || "";

	// Dynamic styling based on normalized value
	let colorClasses = "bg-[rgba(92,90,122,0.15)] text-[var(--color-text-secondary)]";

	if (type === "status" || type === "decision" || type === "vote") {
		switch (normalized) {
			case "pending":
			case "appealed":
				colorClasses = "bg-[rgba(245,158,11,0.15)] text-[var(--color-warning)]";
				break;
			case "under_review":
				colorClasses = "bg-[rgba(59,130,246,0.15)] text-[var(--color-info)]";
				break;
			case "voting":
			case "tied":
				colorClasses = "bg-[rgba(124,58,237,0.15)] text-[var(--color-accent-primary)]";
				break;
			case "decided":
			case "valid":
				colorClasses = "bg-[rgba(16,185,129,0.15)] text-[var(--color-success)]";
				break;
			case "needs_evidence":
				colorClasses = "bg-[rgba(245,158,11,0.15)] text-[var(--color-warning)]";
				break;
			case "rejected":
			case "invalid":
			case "closed":
				colorClasses = "bg-[rgba(239,68,68,0.15)] text-[var(--color-danger)]";
				break;
			default:
				colorClasses = "bg-[rgba(92,90,122,0.15)] text-[var(--color-text-secondary)]";
		}
	} else if (type === "category") {
		switch (normalized) {
			case "consumer":
				colorClasses = "bg-[rgba(124,58,237,0.15)] text-[var(--color-accent-primary)]";
				break;
			case "employment":
				colorClasses = "bg-[rgba(16,185,129,0.15)] text-[var(--color-success)]";
				break;
			case "service":
				colorClasses = "bg-[rgba(124,58,237,0.15)] text-[var(--color-accent-primary)]";
				break;
			case "government":
				colorClasses = "bg-[rgba(245,158,11,0.15)] text-[var(--color-gold)]";
				break;
			case "academic":
				colorClasses = "bg-[rgba(59,130,246,0.15)] text-[var(--color-info)]";
				break;
			case "other":
			default:
				colorClasses = "bg-[rgba(92,90,122,0.15)] text-[var(--color-text-secondary)]";
		}
	} else {
		// Generic heuristics if type isn't specified
		if (["pending", "appealed", "needs_evidence"].includes(normalized)) {
			colorClasses = "bg-[rgba(245,158,11,0.15)] text-[var(--color-warning)]";
		} else if (["under_review"].includes(normalized)) {
			colorClasses = "bg-[rgba(59,130,246,0.15)] text-[var(--color-info)]";
		} else if (["voting", "tied", "service"].includes(normalized)) {
			colorClasses = "bg-[rgba(124,58,237,0.15)] text-[var(--color-accent-primary)]";
		} else if (["decided", "valid", "employment"].includes(normalized)) {
			colorClasses = "bg-[rgba(16,185,129,0.15)] text-[var(--color-success)]";
		} else if (["rejected", "invalid", "closed", "government"].includes(normalized)) {
			colorClasses = "bg-[rgba(239,68,68,0.15)] text-[var(--color-danger)]";
		} else if (["consumer", "academic"].includes(normalized)) {
			colorClasses = "bg-[rgba(124,58,237,0.15)] text-[var(--color-accent-primary)]";
		}
	}

	return (
		<span
			className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium uppercase tracking-wider ${colorClasses} ${className}`}
			{...rest}
		>
			{formatValue(value)}
		</span>
	);
}
