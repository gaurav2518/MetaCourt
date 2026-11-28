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
		const jpgPreview = file.url?.replace(/\.pdf$/i, ".jpg");
		if (!imageError && jpgPreview && jpgPreview !== file.url) {
			return (
				<div className="relative h-full w-full">
					<img
						src={jpgPreview}
						alt={file.fileName || "PDF thumbnail"}
						onError={() => setImageError(true)}
						className="h-full w-full object-cover"
					/>
					<div className="absolute bottom-0 inset-x-0 bg-black/75 py-0.5 text-center">
						<span className="text-[9px] font-bold uppercase tracking-wider text-red-400">PDF</span>
					</div>
				</div>
			);
		}

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
						const isPdf = computedType === "pdf" && (file.url?.toLowerCase().includes(".pdf") || (file.fileType || "").toLowerCase() === "pdf");
						
						// Cloudinary URL helpers
						const isCloudinary = file.url?.includes("res.cloudinary.com");
						const downloadUrl = isCloudinary && file.url.includes("/image/upload/")
							? file.url.replace("/image/upload/", "/image/upload/fl_attachment/")
							: file.url;
						const jpgPreviewUrl = isCloudinary && isPdf
							? file.url.replace(/\.pdf$/i, ".jpg")
							: null;

						return (
							<div
								key={file.publicId}
								className="group flex flex-col justify-between rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-primary)] p-3 transition duration-150 hover:border-[var(--color-accent-primary)] hover:bg-[var(--color-bg-elevated)]"
							>
								<div className="flex items-start gap-3">
									<a
										href={file.url}
										target="_blank"
										rel="noreferrer"
										className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] text-[var(--color-text-secondary)] transition hover:opacity-80"
										title="Click to view file"
									>
										<ThumbnailPreview file={file} computedType={computedType} />
									</a>

									<div className="min-w-0 flex-1">
										<p className="truncate text-sm font-medium text-[var(--color-text-primary)]" title={displayName}>
											{displayName}
										</p>
										<p className="mt-1 text-xs text-[var(--color-text-muted)]">
											{computedType.toUpperCase()} • {formatFileSize(file.fileSize)}
										</p>
									</div>
								</div>

								<div className="mt-3 flex flex-wrap items-center gap-2 border-t border-[var(--color-border)]/50 pt-2.5 text-xs">
									<a
										href={file.url}
										target="_blank"
										rel="noreferrer"
										className="inline-flex items-center gap-1 text-[var(--color-text-secondary)] hover:text-[var(--color-accent-primary)] transition"
									>
										<span>View</span>
										<ExternalLink className="h-3 w-3" />
									</a>

									{jpgPreviewUrl && (
										<a
											href={jpgPreviewUrl}
											target="_blank"
											rel="noreferrer"
											className="rounded bg-[var(--color-bg-secondary)] px-1.5 py-0.5 text-[10px] font-medium text-[var(--color-accent-primary)] hover:underline"
											title="View high-resolution page 1 image preview"
										>
											Image Preview
										</a>
									)}

									<a
										href={downloadUrl}
										target="_blank"
										rel="noreferrer"
										download={displayName}
										className="ml-auto inline-flex items-center gap-1 rounded bg-[var(--color-bg-secondary)] px-2 py-1 text-[11px] font-medium text-[var(--color-text-primary)] transition hover:bg-[var(--color-accent-primary)] hover:text-white"
										title="Download file directly"
									>
										<Download className="h-3 w-3" />
										<span>Download</span>
									</a>
								</div>
							</div>
						);
					})}
				</div>
			)}
		</section>
	);
}
