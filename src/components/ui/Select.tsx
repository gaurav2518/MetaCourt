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
	return (
		<div className={`flex flex-col ${className}`}>
			{label && (
				<label htmlFor={id} className="mc-label">
					{label}
				</label>
			)}

			<div className="relative">
				<select
					ref={ref}
					id={id}
					className={`mc-input appearance-none px-4 py-3 text-sm ${
						error ? "border-[var(--color-danger)] bg-[rgba(239,68,68,0.08)]" : ""
					}`}
					aria-describedby={error ? `${id}-error` : helperText ? `${id}-help` : undefined}
					{...rest}
				>
					{options.map((opt, i) => {
						const val = typeof opt === "string" ? opt : opt.value;
						const lbl = typeof opt === "string" ? opt : opt.label;
						return (
							<option key={i} value={val} className="bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]">
								{lbl}
							</option>
						);
					})}
				</select>
				
				<div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[var(--color-text-muted)]">
					<svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
						<path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
					</svg>
				</div>
			</div>

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

export default Select;
