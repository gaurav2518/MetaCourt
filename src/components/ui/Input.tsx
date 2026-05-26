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
				<label htmlFor={id} className="mb-2 text-sm font-medium text-slate-700">
					{label}
				</label>
			)}

			<input
				ref={ref}
				id={id}
				className={`w-full rounded-2xl border px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:ring-4 focus:ring-cyan-500/10 ${
					error ? "border-rose-500 bg-rose-50" : "border-slate-200 bg-white"
				}`}
				aria-describedby={error ? `${id}-error` : helperText ? `${id}-help` : undefined}
				{...rest}
			/>

			{helperText && !error && (
				<p id={`${id}-help`} className="mt-2 text-xs text-slate-500">
					{helperText}
				</p>
			)}

			{error && (
				<p id={`${id}-error`} className="mt-2 text-xs text-rose-600">
					{error}
				</p>
			)}
		</div>
	);
});

export default Input;

