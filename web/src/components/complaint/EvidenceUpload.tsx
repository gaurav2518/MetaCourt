"use client";

import { useMemo, useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { FileText, ImageIcon, Loader2, Upload } from "lucide-react";

import { useUpload, type UploadedEvidenceFile } from "@/hooks/useUpload";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ACCEPTED_TYPES = [
	"image/jpeg",
	"image/png",
	"image/webp",
	"application/pdf",
	"application/msword",
	"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

type EvidenceUploadProps = {
	onChange?: (files: UploadedEvidenceFile[]) => void;
	initialFiles?: UploadedEvidenceFile[];
	maxFiles?: number;
	label?: string;
	helperText?: string;
	disabled?: boolean;
};

function formatFileSize(bytes: number) {
	if (!bytes) return "0 B";

	const units = ["B", "KB", "MB", "GB"];
	const unitIndex = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
	const value = bytes / Math.pow(1024, unitIndex);

	return `${value.toFixed(value >= 10 || unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

function getFileKind(file: File): UploadedEvidenceFile["fileType"] | null {
	if (file.type.startsWith("image/")) {
		return "image";
	}

	if (file.type === "application/pdf") {
		return "pdf";
	}

	if (
		file.type === "application/msword" ||
		file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
	) {
		return "document";
	}

	return null;
}

function validateFiles(files: FileList | File[]) {
	const accepted: File[] = [];
	const rejected: string[] = [];

	Array.from(files).forEach((file) => {
		const kind = getFileKind(file);

		if (!kind || !ACCEPTED_TYPES.includes(file.type)) {
			rejected.push(`${file.name} is not a supported file type.`);
			return;
		}

		if (file.size > MAX_FILE_SIZE) {
			rejected.push(`${file.name} exceeds the 10MB upload limit.`);
			return;
		}

		accepted.push(file);
	});

	return { accepted, rejected };
}

export default function EvidenceUpload({
	onChange,
	initialFiles = [],
	maxFiles = 10,
	label = "Upload evidence",
	helperText = "Drag and drop files here, or click to choose images, PDFs, or documents.",
	disabled = false,
}: EvidenceUploadProps) {
	const inputRef = useRef<HTMLInputElement | null>(null);
	const { upload, uploading, error: uploadError } = useUpload();
	const [isDragging, setIsDragging] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [uploadedFiles, setUploadedFiles] = useState<UploadedEvidenceFile[]>(initialFiles);
	const [progress, setProgress] = useState<{ current: number; total: number } | null>(null);

	const displayError = error || uploadError;

	const totalSlotsLeft = useMemo(() => Math.max(maxFiles - uploadedFiles.length, 0), [maxFiles, uploadedFiles.length]);

	function commitFiles(nextFiles: UploadedEvidenceFile[]) {
		setUploadedFiles(nextFiles);
		onChange?.(nextFiles);
	}

	function handleRejected(messages: string[]) {
		if (messages.length === 0) return;

		setError(messages[0]);
	}

	async function processFiles(files: FileList | File[]) {
		if (disabled || uploading) {
			return;
		}

		setError(null);

		const { accepted, rejected } = validateFiles(files);
		handleRejected(rejected);

		const slice = accepted.slice(0, totalSlotsLeft);

		if (slice.length === 0) {
			if (accepted.length > 0 && totalSlotsLeft === 0) {
				setError(`You can upload up to ${maxFiles} files.`);
			}
			return;
		}

		setProgress({ current: 0, total: slice.length });

		const nextUploadedFiles = [...uploadedFiles];

		try {
			for (let index = 0; index < slice.length; index += 1) {
				const file = slice[index];
				const uploaded = await upload(file);
				nextUploadedFiles.push(uploaded);
				setProgress({ current: index + 1, total: slice.length });
				commitFiles([...nextUploadedFiles]);
			}
		} catch {
			// The hook already exposes the error message.
		} finally {
			setProgress(null);
			if (inputRef.current) {
				inputRef.current.value = "";
			}
		}
	}

	function handleDrop(event: DragEvent<HTMLDivElement>) {
		event.preventDefault();
		setIsDragging(false);
		void processFiles(event.dataTransfer.files);
	}

	function handleSelect(event: ChangeEvent<HTMLInputElement>) {
		if (!event.target.files) return;
		void processFiles(event.target.files);
	}

	return (
		<section className="space-y-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-4 sm:p-6">
			<div>
				<h3 className="font-display text-base font-semibold text-[var(--color-text-primary)]">{label}</h3>
				<p className="mt-1 text-sm leading-6 text-[var(--color-text-secondary)]">{helperText}</p>
			</div>

			<div
				onDragOver={(event) => {
					event.preventDefault();
					if (!disabled) {
						setIsDragging(true);
					}
				}}
				onDragLeave={() => setIsDragging(false)}
				onDrop={handleDrop}
				className={`relative rounded-xl border border-dashed px-5 py-8 text-center transition ${
					isDragging
						? "border-[var(--color-accent-primary)] bg-[var(--color-accent-glow)]"
						: "border-[var(--color-border)] bg-[var(--color-bg-secondary)] hover:border-[var(--color-accent-primary)]"
				} ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
				onClick={() => inputRef.current?.click()}
				role="button"
				tabIndex={0}
				onKeyDown={(event) => {
					if (event.key === "Enter" || event.key === " ") {
						event.preventDefault();
						inputRef.current?.click();
					}
				}}
			>
				<input
					ref={inputRef}
					type="file"
					multiple
					accept=".jpg,.jpeg,.png,.webp,.pdf,.doc,.docx"
					className="sr-only"
					onChange={handleSelect}
					disabled={disabled}
					aria-label="Upload evidence files"
				/>

				<div className="mx-auto flex h-14 w-14 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--color-accent-glow)] text-[var(--color-accent-primary)]">
					<Upload className="h-6 w-6" />
				</div>

				<p className="mt-4 text-sm font-medium text-[var(--color-text-primary)]">Drop files here or click to upload</p>
				<p className="mt-2 text-xs leading-5 text-[var(--color-text-muted)]">
					Images, PDFs, and document files up to 10MB each.
				</p>
			</div>

			{progress && (
				<div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)] px-4 py-3 text-sm text-[var(--color-text-secondary)]">
					Uploading {progress.current} of {progress.total} files...
					<div className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--color-bg-primary)]">
						<div className="h-full w-1/2 animate-pulse rounded-full bg-[var(--color-accent-primary)]" />
					</div>
				</div>
			)}

			{displayError && (
				<div className="rounded-lg border border-[rgba(239,68,68,0.25)] bg-[rgba(239,68,68,0.12)] px-4 py-3 text-sm text-[var(--color-danger)]">
					{displayError}
				</div>
			)}

			{uploadedFiles.length > 0 && (
				<div className="space-y-3">
					<div className="flex items-center justify-between gap-3">
						<h4 className="text-sm font-semibold text-[var(--color-text-primary)]">Uploaded files</h4>
						<p className="text-xs text-[var(--color-text-muted)]">{uploadedFiles.length} file{uploadedFiles.length === 1 ? "" : "s"} ready</p>
					</div>

					<div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
						{uploadedFiles.map((file) => (
							<div key={file.publicId} className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-3">
								<div className="flex gap-3">
									<div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-primary)]">
										{file.fileType === "image" ? (
											<img src={file.url} alt={file.fileName} className="h-full w-full object-cover" />
										) : file.fileType === "pdf" ? (
											<FileText className="h-7 w-7 text-[var(--color-danger)]" />
										) : (
											<ImageIcon className="h-7 w-7 text-[var(--color-text-secondary)]" />
										)}
									</div>

									<div className="min-w-0 flex-1">
										<p className="truncate text-sm font-medium text-[var(--color-text-primary)]">{file.fileName}</p>
										<p className="mt-1 text-xs text-[var(--color-text-muted)]">
											{file.fileType.toUpperCase()} - {formatFileSize(file.fileSize)}
										</p>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			)}

			{uploading && (
				<div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
					<Loader2 className="h-4 w-4 animate-spin text-[var(--color-accent-primary)]" />
					Uploading selected evidence...
				</div>
			)}
		</section>
	);
}
