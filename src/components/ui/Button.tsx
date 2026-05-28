"use client";

import React from "react";
import Spinner from "./Spinner";

type Variant = "primary" | "secondary" | "danger" | "ghost";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: Variant;
	isLoading?: boolean;
}

export default function Button({
	children,
	variant = "primary",
	isLoading = false,
	type,
	disabled,
	className = "",
	...rest
}: ButtonProps) {
	const base =
		"inline-flex cursor-pointer items-center justify-center rounded-2xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60";

	const variants: Record<Variant, string> = {
		primary:
			"bg-cyan-600 text-white hover:brightness-95 focus:ring-4 focus:ring-cyan-500/20",
		secondary:
			"bg-white/5 text-white hover:bg-white/10 border border-white/10",
		danger: "bg-rose-600 text-white hover:brightness-95",
		ghost: "bg-transparent text-white hover:bg-white/5",
	};

	const cls = `${base} ${variants[variant]} ${className}`;

	return (
		<button type={type ?? "button"} className={cls} disabled={disabled || isLoading} {...rest}>
			{isLoading ? (
				<span className="flex items-center gap-2">
					<Spinner size={16} />
					<span className="opacity-90">{children}</span>
				</span>
			) : (
				children
			)}
		</button>
	);
}

