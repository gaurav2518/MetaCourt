"use client";

import { FileText, ImageIcon, Download } from "lucide-react";

import type { UploadedEvidenceFile } from "@/hooks/useUpload";

type EvidenceViewerProps = {
	files: UploadedEvidenceFile[];
	title?: string;
	emptyMessage?: string;
};

function formatFileSize(bytes: number) {
	if (!bytes) return "0 B";

	const units = ["B", "KB", "MB", "GB"];
	const unitIndex = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
	const value = bytes / Math.pow(1024, unitIndex);

	return `${value.toFixed(value >= 10 || unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

export default function EvidenceViewer({
	files,
	title = "Evidence",
	emptyMessage = "No evidence has been uploaded yet.",
}: EvidenceViewerProps) {
	return (
		<section className="space-y-4 rounded-[1.75rem] border border-white/10 bg-white/5 p-4 shadow-xl shadow-black/20 backdrop-blur-xl sm:p-6">
			<div className="flex items-end justify-between gap-4">
				<div>
					<h3 className="text-base font-semibold text-white">{title}</h3>
					<p className="mt-1 text-sm leading-6 text-slate-400">Download or review the uploaded evidence files.</p>
				</div>

				<p className="text-xs text-slate-400">
					{files.length} file{files.length === 1 ? "" : "s"}
				</p>
			</div>

			{files.length === 0 ? (
				<div className="rounded-3xl border border-dashed border-white/15 bg-slate-950/40 px-5 py-10 text-center text-sm text-slate-400">
					{emptyMessage}
				</div>
			) : (
				<div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
					{files.map((file) => (
						<a
							key={file.publicId}
							href={file.url}
							target="_blank"
							rel="noreferrer"
							download={file.fileName}
							className="group flex items-start gap-3 rounded-2xl border border-white/10 bg-slate-950/50 p-3 transition hover:border-cyan-400/30 hover:bg-white/5"
						>
							<div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-white/5 text-slate-200">
								{file.fileType === "image" ? (
									<img src={file.url} alt={file.fileName} className="h-full w-full object-cover" />
								) : file.fileType === "pdf" ? (
									<FileText className="h-7 w-7 text-rose-300" />
								) : (
									<ImageIcon className="h-7 w-7 text-slate-300" />
								)}
							</div>

							<div className="min-w-0 flex-1">
								<div className="flex items-start justify-between gap-3">
									<div className="min-w-0">
										<p className="truncate text-sm font-medium text-white">{file.fileName}</p>
										<p className="mt-1 text-xs text-slate-400">
											{file.fileType.toUpperCase()} · {formatFileSize(file.fileSize)}
										</p>
									</div>

									<Download className="h-4 w-4 shrink-0 text-slate-500 transition group-hover:text-cyan-300" />
								</div>

								<p className="mt-3 text-xs leading-5 text-slate-500 group-hover:text-slate-400">
									Open to preview or download this evidence item.
								</p>
							</div>
						</a>
					))}
				</div>
			)}
		</section>
	);
}
