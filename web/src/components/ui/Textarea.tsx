"use client";

import React, { forwardRef } from "react";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
	id: string;
	label?: string;
	error?: string | null;
	helperText?: string;
	variant?: "light" | "dark" | "auto";
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
	{ id, label, error = null, helperText, variant = "auto", className = "", ...rest },
	ref
) {
	return (
		<div className={`flex flex-col ${className}`}>
			{label && (
				<label htmlFor={id} className="mc-label">
					{label}
				</label>
			)}

			<textarea
				ref={ref}
				id={id}
				className={`mc-input min-h-[100px] px-4 py-3 text-sm ${
					error ? "border-[var(--color-danger)] bg-[rgba(239,68,68,0.08)]" : ""
				}`}
				aria-describedby={error ? `${id}-error` : helperText ? `${id}-help` : undefined}
				{...rest}
			/>

			{helperText && !error && (
				<p id={`${id}-help`} className="mt-2 text-xs text-[var(--color-text-muted)]">
					{helperText}
				</p>
			)}

			{error && (
				<p id={`${id}-error`} className="mt-2 text-xs text-[var(--color-danger)]">
					{error}
				</p>
			)}
		</div>
	);
});

export default Textarea;
