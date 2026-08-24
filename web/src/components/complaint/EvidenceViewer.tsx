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
		<section className="space-y-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-4 sm:p-6">
			<div className="flex items-end justify-between gap-4">
				<div>
					<h3 className="font-display text-base font-semibold text-[var(--color-text-primary)]">{title}</h3>
					<p className="mt-1 text-sm leading-6 text-[var(--color-text-secondary)]">Download or review the uploaded evidence files.</p>
				</div>

				<p className="text-xs text-[var(--color-text-muted)]">
					{files.length} file{files.length === 1 ? "" : "s"}
				</p>
			</div>

			{files.length === 0 ? (
				<div className="rounded-lg border border-dashed border-[var(--color-border)] bg-[var(--color-bg-primary)] px-5 py-10 text-center text-sm text-[var(--color-text-secondary)]">
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
							className="group flex items-start gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-primary)] p-3 transition duration-150 hover:border-[var(--color-accent-primary)] hover:bg-[var(--color-bg-elevated)]"
						>
							<div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] text-[var(--color-text-secondary)]">
								{file.fileType === "image" ? (
									<img src={file.url} alt={file.fileName} className="h-full w-full object-cover" />
								) : file.fileType === "pdf" ? (
									<FileText className="h-7 w-7 text-[var(--color-danger)]" />
								) : (
									<ImageIcon className="h-7 w-7 text-[var(--color-text-secondary)]" />
								)}
							</div>

							<div className="min-w-0 flex-1">
								<div className="flex items-start justify-between gap-3">
									<div className="min-w-0">
										<p className="truncate text-sm font-medium text-[var(--color-text-primary)]">{file.fileName}</p>
										<p className="mt-1 text-xs text-[var(--color-text-muted)]">
											{file.fileType.toUpperCase()} - {formatFileSize(file.fileSize)}
										</p>
									</div>

									<Download className="h-4 w-4 shrink-0 text-[var(--color-text-muted)] transition group-hover:text-[var(--color-accent-primary)]" />
								</div>

								<p className="mt-3 text-xs leading-5 text-[var(--color-text-muted)] group-hover:text-[var(--color-text-secondary)]">
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
