"use client";

import { ROLES } from "@/constants";

type RoleValue =
	(typeof ROLES)["COMPLAINANT"] | (typeof ROLES)["OPPOSITE_PARTY"];

type RoleSelectorProps = {
	value: RoleValue;
	onChange: (value: RoleValue) => void;
	disabled?: boolean;
	className?: string;
};

const ROLE_OPTIONS: Array<{
	value: RoleValue;
	title: string;
	description: string;
}> = [
	{
		value: ROLES.COMPLAINANT,
		title: "Complainant",
		description: "File a complaint and track the progress of your case.",
	},
	{
		value: ROLES.OPPOSITE_PARTY,
		title: "Opposite Party",
		description: "Respond to complaints and upload supporting evidence.",
	},
];

export default function RoleSelector({
	value,
	onChange,
	disabled = false,
	className = "",
}: RoleSelectorProps) {
	return (
		<div className={`space-y-3 ${className}`}>
			<div>
				<span className="block text-sm font-medium text-slate-700">Account type</span>
				<p className="mt-1 text-xs text-slate-500">
					Choose the role that matches how you will use MetaCourt.
				</p>
			</div>

			<div className="grid gap-3">
				{ROLE_OPTIONS.map((option) => {
					const active = value === option.value;

					return (
						<label
							key={option.value}
							className={`cursor-pointer rounded-2xl border p-4 transition ${
								active
									? "border-cyan-500 bg-cyan-50 shadow-sm shadow-cyan-100"
									: "border-slate-200 bg-white hover:border-cyan-300 hover:bg-slate-50"
							} ${disabled ? "cursor-not-allowed opacity-70" : ""}`}
						>
							<div className="flex items-start gap-3">
								<input
									type="radio"
									name="role"
									value={option.value}
									checked={active}
									onChange={() => onChange(option.value)}
									disabled={disabled}
									className="mt-1 h-4 w-4 border-slate-300 text-cyan-600 focus:ring-cyan-500"
								/>

								<div>
									<p className="font-semibold text-slate-900">{option.title}</p>
									<p className="mt-1 text-sm leading-6 text-slate-500">
										{option.description}
									</p>
								</div>
							</div>
						</label>
					);
				})}
			</div>

			<div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
				<span className="font-semibold">Note:</span> Juror access is not available here. It requires admin approval.
			</div>
		</div>
	);
}
