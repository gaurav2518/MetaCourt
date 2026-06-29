"use client";

import React, { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	id: string;
	label?: string;
	error?: string | null;
	helperText?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
	{ id, label, error = null, helperText, className = "", ...rest },
	ref
) {
	return (
		<div className={`flex flex-col ${className}`}>
			{label && (
				<label htmlFor={id} className="mc-label">
					{label}
				</label>
			)}

			<input
				ref={ref}
				id={id}
				className={`mc-input px-4 py-3 text-sm ${
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

export default Input;

