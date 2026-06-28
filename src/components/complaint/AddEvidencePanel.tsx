"use client";

import { useState } from "react";

import Button from "@/components/ui/Button";
import EvidenceUpload from "@/components/complaint/EvidenceUpload";
import type { UploadedEvidenceFile } from "@/hooks/useUpload";

type AddEvidencePanelProps = {
  caseId: string;
  title?: string;
  helperText?: string;
  onAdded?: () => Promise<void> | void;
};

export default function AddEvidencePanel({
  caseId,
  title = "Add Evidence",
  helperText = "Upload additional files after filing, then attach them to this case.",
  onAdded,
}: AddEvidencePanelProps) {
  const [files, setFiles] = useState<UploadedEvidenceFile[]>([]);
  const [resetKey, setResetKey] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function submitEvidence() {
    try {
      setSubmitting(true);
      setMessage("");
      setError("");

      const res = await fetch(`/api/complaints/${caseId}/evidence`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ evidence: files }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to attach evidence");
      }

      setFiles([]);
      setResetKey((current) => current + 1);
      setMessage("Evidence attached to this case.");
      await onAdded?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to attach evidence");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="space-y-4">
      <EvidenceUpload
        key={resetKey}
        label={title}
        helperText={helperText}
        onChange={setFiles}
        disabled={submitting}
      />

      {error && (
        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </div>
      )}

      {message && (
        <div className="rounded-2xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-200">
          {message}
        </div>
      )}

      <Button
        type="button"
        onClick={submitEvidence}
        isLoading={submitting}
        disabled={submitting || files.length === 0}
      >
        Attach Evidence
      </Button>
    </section>
  );
}
