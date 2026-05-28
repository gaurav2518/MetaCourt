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
	const textareaStyles = variant === "dark"
		? "border-white/10 bg-slate-950 text-white focus:ring-cyan-500/20"
		: variant === "light"
		? "border-slate-200 bg-white text-slate-900 focus:ring-cyan-500/10"
		: "border-slate-200 bg-white text-slate-900 dark:border-white/10 dark:bg-slate-950 dark:text-white focus:ring-cyan-500/10 dark:focus:ring-cyan-500/20";

	return (
		<div className={`flex flex-col ${className}`}>
			{label && (
				<label htmlFor={id} className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
					{label}
				</label>
			)}

			<textarea
				ref={ref}
				id={id}
				className={`w-full rounded-2xl border px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:ring-4 min-h-[100px] ${textareaStyles} ${
					error ? "border-rose-500 bg-rose-50 dark:bg-rose-950/20" : ""
				}`}
				aria-describedby={error ? `${id}-error` : helperText ? `${id}-help` : undefined}
				{...rest}
			/>

			{helperText && !error && (
				<p id={`${id}-help`} className="mt-2 text-xs text-slate-500 dark:text-slate-400">
					{helperText}
				</p>
			)}

			{error && (
				<p id={`${id}-error`} className="mt-2 text-xs text-rose-600 dark:text-rose-400">
					{error}
				</p>
			)}
		</div>
	);
});

export default Textarea;
