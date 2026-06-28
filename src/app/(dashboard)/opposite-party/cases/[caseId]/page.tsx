"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import PageHeader from "@/components/layout/PageHeader";
import AddEvidencePanel from "@/components/complaint/AddEvidencePanel";
import EvidenceViewer from "@/components/complaint/EvidenceViewer";
import EvidenceUpload from "@/components/complaint/EvidenceUpload";
import TimelineTracker from "@/components/complaint/TimelineTracker";
import ComplaintStatus from "@/components/complaint/ComplaintStatus";
import Button from "@/components/ui/Button";
import HashProof from "@/components/blockchain/HashProof";
import type { UploadedEvidenceFile } from "@/hooks/useUpload";

function normalizeEvidence(files: any[] = []): UploadedEvidenceFile[] {
  return files.map((file) => ({
    url: file.url ?? file.fileUrl ?? "",
    publicId:
      file.publicId ?? file.public_id ?? file._id?.toString() ?? file.fileUrl,
    fileType: file.fileType ?? "document",
    fileName: file.fileName ?? "uploaded-file",
    fileSize: file.fileSize ?? 0,
  }));
}

export default function OppositePartyCasePage() {
  const params = useParams();
  const caseId = params.caseId as string;

  const [complaint, setComplaint] = useState<any>(null);
  const [defenseStatement, setDefenseStatement] = useState("");
  const [counterEvidence, setCounterEvidence] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [error, setError] = useState("");

  async function fetchComplaint() {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(`/api/complaints/${caseId}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch complaint");
      }

      setComplaint(data.complaint);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function submitDefense() {
    try {
      setSubmitting(true);
      setError("");

      const res = await fetch(`/api/complaints/${caseId}/response`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          defenseStatement,
          evidence: counterEvidence,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to submit response");
      }

      setComplaint(data.complaint);
      setDefenseStatement("");
      setCounterEvidence([]);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  async function claimCase() {
    try {
      setClaiming(true);
      setError("");

      const res = await fetch(`/api/complaints/${caseId}/link-opposite-party`, {
        method: "POST",
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to claim case");
      }

      setComplaint(data.complaint);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setClaiming(false);
    }
  }

  useEffect(() => {
    fetchComplaint();
  }, [caseId]);

  if (loading) {
    return <p className="text-sm text-slate-500">Loading complaint...</p>;
  }

  if (error && !complaint) {
    return <p className="text-sm text-red-600">{error}</p>;
  }

  if (!complaint) {
    return <p className="text-sm text-slate-500">Complaint not found.</p>;
  }

  const hasResponded = Boolean(complaint.defenseStatement);
  const complainantEvidence = normalizeEvidence(complaint.evidence || []);
  const defenseEvidence = normalizeEvidence(complaint.defenseEvidence || []);
  const isLinkedToAccount = Boolean(complaint.oppositeParty?.userId);

  return (
    <div className="space-y-6">
      <PageHeader
        title={complaint.title}
        subtitle={`Case ID: ${complaint.caseId}`}
      />

      {!isLinkedToAccount && (
        <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-5 text-cyan-50">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm">
              This complaint matches your email. Claim it to link it to your
              account before responding.
            </p>

            <Button
              type="button"
              onClick={claimCase}
              isLoading={claiming}
              disabled={claiming}
            >
              Claim Case
            </Button>
          </div>
        </div>
      )}

      <div className="rounded-2xl border bg-white p-5 text-slate-900 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Complaint Details</h2>
          <ComplaintStatus status={complaint.status} />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <p className="text-sm text-slate-500">Category</p>
            <p className="font-medium capitalize">{complaint.category}</p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Filed On</p>
            <p className="font-medium">
              {new Date(complaint.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div>
            <p className="text-sm text-slate-500">Status</p>
            <p className="font-medium capitalize">
              {complaint.status.replace("_", " ")}
            </p>
          </div>
        </div>

        <div className="mt-5">
          <p className="text-sm text-slate-500">Description</p>
          <p className="mt-1 leading-7 text-slate-700">
            {complaint.description}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border bg-white p-5 text-slate-900 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">Complainant Evidence</h2>
        <EvidenceViewer files={complainantEvidence} />
      </div>

      <div className="rounded-2xl border bg-white p-5 text-slate-900 shadow-sm">
        <h2 className="text-lg font-semibold">Defense Response</h2>

        {hasResponded ? (
          <div className="mt-4 space-y-4">
            <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
              Response submitted and locked. You cannot edit it now.
            </div>

            <div>
              <p className="text-sm text-slate-500">Your Defense Statement</p>
              <p className="mt-2 rounded-xl bg-slate-50 p-4 leading-7 text-slate-700">
                {complaint.defenseStatement}
              </p>
            </div>

            <EvidenceViewer files={defenseEvidence} />

            <AddEvidencePanel
              caseId={complaint.caseId}
              title="Add More Defense Evidence"
              helperText="Attach extra defense evidence after your response."
              onAdded={fetchComplaint}
            />
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Defense Statement
              </label>
              <textarea
                value={defenseStatement}
                onChange={(e) => setDefenseStatement(e.target.value)}
                rows={6}
                className="w-full rounded-xl border px-4 py-3 outline-none focus:border-black"
                placeholder="Write your response to this complaint..."
              />
            </div>

            <EvidenceUpload
              onChange={(files) => setCounterEvidence(files)}
            />

            {counterEvidence.length > 0 && (
              <EvidenceViewer files={counterEvidence} />
            )}

            {error && <p className="text-sm text-red-600">{error}</p>}

            <Button
              type="button"
              onClick={submitDefense}
              isLoading={submitting}
              disabled={
                submitting ||
                !isLinkedToAccount ||
                defenseStatement.trim().length < 10
              }
            >
              Submit Defense
            </Button>
          </div>
        )}
      </div>

      <div className="rounded-2xl border bg-white p-5 text-slate-900 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">Status Timeline</h2>
        <TimelineTracker
          events={
            (complaint.history && complaint.history.length > 0)
              ? complaint.history
              : [
                  { id: `created-${complaint.caseId}`, status: "Filed", timestamp: complaint.createdAt || new Date().toISOString() },
                  { id: `updated-${complaint.caseId}`, status: complaint.status, timestamp: complaint.updatedAt || complaint.createdAt || new Date().toISOString() },
                ]
          }
        />
      </div>
      <HashProof caseId={complaint.caseId} complaintHash={complaint.complaintHash} blockchainTxHash={complaint.blockchainTxHash} />
      {complaint.status === "decided" && (
        <div className="rounded-2xl border bg-white p-5 text-slate-900 shadow-sm">
          <h2 className="text-lg font-semibold">Final Decision</h2>
          <p className="mt-2 text-slate-700 capitalize">
            Decision: {complaint.decision?.replace("_", " ")}
          </p>
        </div>
      )}
    </div>
  );
}
