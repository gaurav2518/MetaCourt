"use client";

import React, { useEffect, ReactNode } from "react";
import Card from "./Card";

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	title: string;
	children: ReactNode;
	className?: string;
}

export default function Modal({
	isOpen,
	onClose,
	title,
	children,
	className = "",
}: ModalProps) {
	// Close modal on escape keypress
	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};

		if (isOpen) {
			document.body.style.overflow = "hidden";
			window.addEventListener("keydown", handleEscape);
		}

		return () => {
			document.body.style.overflow = "unset";
			window.removeEventListener("keydown", handleEscape);
		};
	}, [isOpen, onClose]);

	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
			{/* Backdrop overlay */}
			<div
				className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity duration-300"
				onClick={onClose}
			/>

			{/* Modal Card content wrapper */}
			<div className={`relative w-full max-w-lg z-10 transform scale-100 transition-all duration-300 ${className}`}>
				<Card variant="glass" className="!p-0 border border-white/10 shadow-2xl shadow-black/80">
					{/* Modal Header */}
					<div className="flex items-center justify-between border-b border-white/10 px-6 py-4.5 bg-white/2">
						<h3 className="text-lg font-bold text-white tracking-tight">
							{title}
						</h3>
						<button
							type="button"
							onClick={onClose}
							className="rounded-xl border border-white/10 bg-white/5 p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
							aria-label="Close dialog"
						>
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-4 h-4">
								<path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
							</svg>
						</button>
					</div>

					{/* Modal Body */}
					<div className="px-6 py-6 max-h-[75vh] overflow-y-auto">
						{children}
					</div>
				</Card>
			</div>
		</div>
	);
}
