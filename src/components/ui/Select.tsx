"use client";

import React, { forwardRef } from "react";

interface SelectOption {
	value: string;
	label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
	id: string;
	label?: string;
	error?: string | null;
	helperText?: string;
	options: Array<SelectOption | string>;
	variant?: "light" | "dark" | "auto";
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
	{ id, label, error = null, helperText, options, variant = "auto", className = "", ...rest },
	ref
) {
	const selectStyles = variant === "dark" 
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

			<div className="relative">
				<select
					ref={ref}
					id={id}
					className={`w-full rounded-2xl border px-4 py-3 text-sm outline-none transition appearance-none placeholder:text-slate-400 focus:ring-4 ${selectStyles} ${
						error ? "border-rose-500 bg-rose-50 dark:bg-rose-950/20" : ""
					}`}
					aria-describedby={error ? `${id}-error` : helperText ? `${id}-help` : undefined}
					{...rest}
				>
					{options.map((opt, i) => {
						const val = typeof opt === "string" ? opt : opt.value;
						const lbl = typeof opt === "string" ? opt : opt.label;
						return (
							<option key={i} value={val} className="bg-white text-slate-900 dark:bg-slate-950 dark:text-white">
								{lbl}
							</option>
						);
					})}
				</select>
				
				<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500 dark:text-slate-400">
					<svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
						<path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
					</svg>
				</div>
			</div>

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

export default Select;
