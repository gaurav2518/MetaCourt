"use client";

import { useState } from "react";
import { FileText, ImageIcon, Download, ExternalLink } from "lucide-react";
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

function resolveFileType(file: UploadedEvidenceFile): "image" | "pdf" | "document" {
	const rawType = (file.fileType || "").toLowerCase();
	const urlAndName = `${file.url || ""} ${file.fileName || ""}`.toLowerCase();

	if (rawType === "pdf" || urlAndName.includes(".pdf")) {
		return "pdf";
	}

	if (
		urlAndName.includes(".doc") ||
		urlAndName.includes(".docx") ||
		rawType === "document"
	) {
		return "document";
	}

	if (
		rawType === "image" ||
		urlAndName.includes(".png") ||
		urlAndName.includes(".jpg") ||
		urlAndName.includes(".jpeg") ||
		urlAndName.includes(".webp") ||
		urlAndName.includes(".svg")
	) {
		return "image";
	}

	return "document";
}

function getDisplayFileName(file: UploadedEvidenceFile, computedType: "image" | "pdf" | "document"): string {
	if (!file.fileName || file.fileName === "file" || file.fileName === "uploaded-file") {
		if (computedType === "pdf") return "Evidence Document.pdf";
		if (computedType === "image") return "Evidence Image";
		return "Evidence File";
	}
	return file.fileName;
}

function ThumbnailPreview({
	file,
	computedType,
}: {
	file: UploadedEvidenceFile;
	computedType: "image" | "pdf" | "document";
}) {
	const [imageError, setImageError] = useState(false);

	if (computedType === "pdf") {
		return (
			<div className="flex flex-col items-center justify-center p-1 text-center">
				<FileText className="h-6 w-6 text-red-500" />
				<span className="mt-1 text-[9px] font-bold uppercase tracking-wider text-red-400">PDF</span>
			</div>
		);
	}

	if (computedType === "document") {
		return (
			<div className="flex flex-col items-center justify-center p-1 text-center">
				<FileText className="h-6 w-6 text-blue-400" />
				<span className="mt-1 text-[9px] font-bold uppercase tracking-wider text-blue-400">DOC</span>
			</div>
		);
	}

	if (imageError) {
		return <ImageIcon className="h-6 w-6 text-[var(--color-text-muted)]" />;
	}

	return (
		<img
			src={file.url}
			alt={file.fileName || "Evidence thumbnail"}
			onError={() => setImageError(true)}
			className="h-full w-full object-cover"
		/>
	);
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
					{files.map((file) => {
						const computedType = resolveFileType(file);
						const displayName = getDisplayFileName(file, computedType);

						return (
							<a
								key={file.publicId}
								href={file.url}
								target="_blank"
								rel="noreferrer"
								download={displayName}
								className="group flex items-start gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-primary)] p-3 transition duration-150 hover:border-[var(--color-accent-primary)] hover:bg-[var(--color-bg-elevated)]"
							>
								<div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] text-[var(--color-text-secondary)]">
									<ThumbnailPreview file={file} computedType={computedType} />
								</div>

								<div className="min-w-0 flex-1">
									<div className="flex items-start justify-between gap-3">
										<div className="min-w-0">
											<p className="truncate text-sm font-medium text-[var(--color-text-primary)]">{displayName}</p>
											<p className="mt-1 text-xs text-[var(--color-text-muted)]">
												{computedType.toUpperCase()} - {formatFileSize(file.fileSize)}
											</p>
										</div>

										<Download className="h-4 w-4 shrink-0 text-[var(--color-text-muted)] transition group-hover:text-[var(--color-accent-primary)]" />
									</div>

									<p className="mt-2.5 text-xs leading-5 text-[var(--color-text-muted)] group-hover:text-[var(--color-text-secondary)] flex items-center gap-1">
										<span>Click to open or download</span>
										<ExternalLink className="h-3 w-3" />
									</p>
								</div>
							</a>
						);
					})}
				</div>
			)}
		</section>
	);
}
