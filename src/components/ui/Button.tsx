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
		"inline-flex cursor-pointer items-center justify-center rounded-lg px-6 py-3 text-sm font-medium transition duration-150 disabled:cursor-not-allowed disabled:opacity-60";

	const variants: Record<Variant, string> = {
		primary:
			"bg-[var(--color-accent-primary)] text-white hover:bg-[var(--color-accent-hover)] focus:outline-2 focus:outline-offset-2 focus:outline-[var(--color-accent-primary)]",
		secondary:
			"border border-[var(--color-border)] bg-transparent text-[var(--color-text-primary)] hover:bg-[var(--color-bg-elevated)]",
		danger: "bg-[var(--color-danger)] text-white hover:brightness-95",
		ghost: "bg-transparent text-[var(--color-text-primary)] hover:bg-[var(--color-bg-elevated)]",
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

