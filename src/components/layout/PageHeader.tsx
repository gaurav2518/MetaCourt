import React, { ReactNode } from "react";

type PageHeaderProps = {
	title: string;
	subtitle?: string;
	action?: ReactNode;
};

export default function PageHeader({ title, subtitle, action }: PageHeaderProps) {
	return (
		<div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
			<div className="space-y-1">
				<h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
					{title}
				</h1>
				{subtitle && (
					<p className="text-sm text-slate-400 sm:text-base">
						{subtitle}
					</p>
				)}
			</div>
			{action && (
				<div className="flex shrink-0 items-center gap-3 sm:justify-end">
					{action}
				</div>
			)}
		</div>
	);
}
