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
	let colorClasses = "border-slate-500/30 bg-slate-500/10 text-slate-300";

	if (type === "status" || type === "decision" || type === "vote") {
		switch (normalized) {
			case "pending":
			case "appealed":
				colorClasses = "border-amber-500/30 bg-amber-500/10 text-amber-200 shadow-sm shadow-amber-500/5";
				break;
			case "under_review":
				colorClasses = "border-sky-500/30 bg-sky-500/10 text-sky-200 shadow-sm shadow-sky-500/5";
				break;
			case "voting":
			case "tied":
				colorClasses = "border-purple-500/30 bg-purple-500/10 text-purple-200 shadow-sm shadow-purple-500/5";
				break;
			case "decided":
			case "valid":
				colorClasses = "border-emerald-500/30 bg-emerald-500/10 text-emerald-300 shadow-sm shadow-emerald-500/5";
				break;
			case "needs_evidence":
				colorClasses = "border-amber-500/30 bg-amber-500/10 text-amber-200 shadow-sm shadow-amber-500/5";
				break;
			case "rejected":
			case "invalid":
			case "closed":
				colorClasses = "border-rose-500/30 bg-rose-500/10 text-rose-300 shadow-sm shadow-rose-500/5";
				break;
			default:
				colorClasses = "border-slate-500/30 bg-slate-500/10 text-slate-300";
		}
	} else if (type === "category") {
		switch (normalized) {
			case "consumer":
				colorClasses = "border-cyan-500/30 bg-cyan-500/10 text-cyan-200";
				break;
			case "employment":
				colorClasses = "border-emerald-500/30 bg-emerald-500/10 text-emerald-300";
				break;
			case "service":
				colorClasses = "border-purple-500/30 bg-purple-500/10 text-purple-200";
				break;
			case "government":
				colorClasses = "border-rose-500/30 bg-rose-500/10 text-rose-300";
				break;
			case "academic":
				colorClasses = "border-blue-500/30 bg-blue-500/10 text-blue-300";
				break;
			case "other":
			default:
				colorClasses = "border-slate-500/30 bg-slate-500/10 text-slate-300";
		}
	} else {
		// Generic heuristics if type isn't specified
		if (["pending", "appealed", "needs_evidence"].includes(normalized)) {
			colorClasses = "border-amber-500/30 bg-amber-500/10 text-amber-200";
		} else if (["under_review"].includes(normalized)) {
			colorClasses = "border-sky-500/30 bg-sky-500/10 text-sky-200";
		} else if (["voting", "tied", "service"].includes(normalized)) {
			colorClasses = "border-purple-500/30 bg-purple-500/10 text-purple-200";
		} else if (["decided", "valid", "employment"].includes(normalized)) {
			colorClasses = "border-emerald-500/30 bg-emerald-500/10 text-emerald-300";
		} else if (["rejected", "invalid", "closed", "government"].includes(normalized)) {
			colorClasses = "border-rose-500/30 bg-rose-500/10 text-rose-300";
		} else if (["consumer", "academic"].includes(normalized)) {
			colorClasses = "border-cyan-500/30 bg-cyan-500/10 text-cyan-200";
		}
	}

	return (
		<span
			className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider ${colorClasses} ${className}`}
			{...rest}
		>
			{formatValue(value)}
		</span>
	);
}
