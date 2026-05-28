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
		<div className={`flex border-b border-white/10 ${className}`}>
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
									? "border-cyan-500 text-cyan-400"
									: "border-transparent text-slate-400 hover:border-white/10 hover:text-slate-200"
							}`}
						>
							{Icon && (
								<Icon
									className={`h-4.5 w-4.5 transition-colors ${
										isActive ? "text-cyan-400" : "text-slate-500 group-hover:text-slate-300"
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
