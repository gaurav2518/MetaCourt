"use client";

import React, { ReactNode } from "react";
import Image from "next/image";

export interface TableColumn<T> {
	key: string;
	label: string;
	sortable?: boolean;
	render?: (item: T, index: number) => ReactNode;
	headerClassName?: string;
	cellClassName?: string;
}

interface TableProps<T> {
	columns: TableColumn<T>[];
	data: T[];
	isLoading?: boolean;
	emptyStateMessage?: string;
	emptyStateComponent?: ReactNode;
	sortKey?: string;
	sortOrder?: "asc" | "desc";
	onSort?: (key: string, order: "asc" | "desc") => void;
	className?: string;
}

export default function Table<T extends Record<string, any>>({
	columns,
	data,
	isLoading = false,
	emptyStateMessage = "No records found.",
	emptyStateComponent,
	sortKey,
	sortOrder,
	onSort,
	className = "",
}: TableProps<T>) {
	
	const handleHeaderClick = (column: TableColumn<T>) => {
		if (!column.sortable || !onSort) return;
		
		let nextOrder: "asc" | "desc" = "asc";
		if (sortKey === column.key) {
			nextOrder = sortOrder === "asc" ? "desc" : "asc";
		}
		onSort(column.key, nextOrder);
	};

	return (
		<div className={`w-full overflow-x-auto rounded-2xl border border-white/10 bg-slate-950/40 backdrop-blur-md ${className}`}>
			<table className="w-full border-collapse text-left text-sm text-slate-300">
				<thead>
					<tr className="border-b border-white/10 bg-white/2 text-xs font-semibold uppercase tracking-wider text-slate-400">
						{columns.map((col) => {
							const isSorted = sortKey === col.key;
							return (
								<th
									key={col.key}
									onClick={() => handleHeaderClick(col)}
									className={`px-6 py-4 ${col.sortable ? "cursor-pointer select-none hover:text-white transition" : ""} ${col.headerClassName || ""}`}
								>
									<span className="flex items-center gap-1.5">
										{col.label}
										{col.sortable && onSort && (
											<span className="text-slate-500">
												{isSorted ? (
													sortOrder === "asc" ? (
														<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5 text-cyan-400">
															<path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
														</svg>
													) : (
														<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3.5 h-3.5 text-cyan-400">
															<path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
														</svg>
													)
												) : (
													<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5 opacity-60">
														<path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
													</svg>
												)}
											</span>
										)}
									</span>
								</th>
							);
						})}
					</tr>
				</thead>
				<tbody className="divide-y divide-white/5">
					{isLoading ? (
						// Skeleton loading state
						Array.from({ length: 5 }).map((_, rowIndex) => (
							<tr key={`skeleton-${rowIndex}`} className="animate-pulse bg-white/1">
								{columns.map((col) => (
									<td key={`skeleton-${rowIndex}-${col.key}`} className="px-6 py-4">
										<div className="h-4 rounded bg-white/10 w-3/4" />
									</td>
								))}
							</tr>
						))
					) : data.length === 0 ? (
						// Empty state
						<tr>
							<td colSpan={columns.length} className="px-6 py-12 text-center">
								{emptyStateComponent ? (
									emptyStateComponent
								) : (
									<div className="flex flex-col items-center justify-center space-y-3">
										<div className="relative h-20 w-20 overflow-hidden rounded-lg border border-white/5 bg-white/2">
											<Image
												src="/Empty_State_Illustration.png"
												alt=""
												fill
												sizes="80px"
												className="object-cover"
											/>
										</div>
										<p className="text-slate-400 font-medium">{emptyStateMessage}</p>
									</div>
								)}
							</td>
						</tr>
					) : (
						// Data rows
						data.map((item, rowIndex) => (
							<tr
								key={item._id || item.id || `row-${rowIndex}`}
								className="hover:bg-white/2 transition duration-150"
							>
								{columns.map((col) => {
									const cellVal = item[col.key];
									return (
										<td
											key={col.key}
											className={`px-6 py-4.5 font-medium text-slate-200 ${col.cellClassName || ""}`}
										>
											{col.render ? col.render(item, rowIndex) : cellVal !== undefined ? String(cellVal) : ""}
										</td>
									);
								})}
							</tr>
						))
					)}
				</tbody>
			</table>
		</div>
	);
}
