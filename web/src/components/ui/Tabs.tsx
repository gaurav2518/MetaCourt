"use client";

import React, { ElementType } from "react";

export interface TabItem {
	id: string;
	label: string;
	icon?: ElementType;
}

interface TabsProps {
	tabs: TabItem[];
	activeTab: string;
	onChange: (id: string) => void;
	className?: string;
}

export default function Tabs({
	tabs,
	activeTab,
	onChange,
	className = "",
}: TabsProps) {
	return (
		<div className={`flex border-b border-[var(--color-border)] ${className}`}>
			<div className="flex gap-2 -mb-[1px]">
				{tabs.map((tab) => {
					const isActive = activeTab === tab.id;
					const Icon = tab.icon;
					
					return (
						<button
							key={tab.id}
							type="button"
							onClick={() => onChange(tab.id)}
							className={`group flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition cursor-pointer select-none ${
								isActive
									? "border-[var(--color-accent-primary)] text-[var(--color-accent-primary)]"
									: "border-transparent text-[var(--color-text-muted)] hover:border-[var(--color-border)] hover:text-[var(--color-text-secondary)]"
							}`}
						>
							{Icon && (
								<Icon
									className={`h-4.5 w-4.5 transition-colors ${
										isActive ? "text-[var(--color-accent-primary)]" : "text-[var(--color-text-muted)] group-hover:text-[var(--color-text-secondary)]"
									}`}
								/>
							)}
							<span>{tab.label}</span>
						</button>
					);
				})}
			</div>
		</div>
	);
}
