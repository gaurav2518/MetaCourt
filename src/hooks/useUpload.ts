"use client";

import { useCallback, useState } from "react";

export type UploadedEvidenceFile = {
	url: string;
	publicId: string;
	fileType: "image" | "pdf" | "document" | "video";
	fileName: string;
	fileSize: number;
};

type UploadResponse = {
	file?: {
		url?: string;
		public_id?: string;
		fileType?: string;
		fileName?: string;
		fileSize?: number;
	};
	message?: string;
	error?: string;
};

function normalizeFileType(fileType?: string): UploadedEvidenceFile["fileType"] {
	if (fileType === "image" || fileType === "pdf" || fileType === "video") {
		return fileType;
	}

	return "document";
}

function toUploadedEvidenceFile(file: UploadResponse["file"]): UploadedEvidenceFile {
	if (!file?.url || !file.public_id) {
		throw new Error("Upload response was missing file details");
	}

	return {
		url: file.url,
		publicId: file.public_id,
		fileType: normalizeFileType(file.fileType),
		fileName: file.fileName ?? "uploaded-file",
		fileSize: file.fileSize ?? 0,
	};
}

export function useUpload() {
	const [uploading, setUploading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const upload = useCallback(async (file: File) => {
		setUploading(true);
		setError(null);

		try {
			const formData = new FormData();
			formData.append("file", file);

			const response = await fetch("/api/upload", {
				method: "POST",
				body: formData,
			});

			const payload = (await response.json().catch(() => ({}))) as UploadResponse;

			if (!response.ok) {
				throw new Error(payload.error || payload.message || "Failed to upload file");
			}

			return toUploadedEvidenceFile(payload.file);
		} catch (uploadError) {
			const message = uploadError instanceof Error ? uploadError.message : "Failed to upload file";
			setError(message);
			throw uploadError instanceof Error ? uploadError : new Error(message);
		} finally {
			setUploading(false);
		}
	}, []);

	return { upload, uploading, error };
}
