"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import ComplaintStatus from "@/components/complaint/ComplaintStatus";
import EvidenceViewer from "@/components/complaint/EvidenceViewer";
import TimelineTracker from "@/components/complaint/TimelineTracker";
import BlockchainBadge from "@/components/complaint/BlockchainBadge";
import { useComplaints } from "@/hooks/useComplaints";
import HashProof from "@/components/blockchain/HashProof";

export default function CaseDetailPage() {
  const params = useParams();
  const caseId = params?.caseId as string;

  const { fetchComplaint } = useComplaints();
  const [complaint, setComplaint] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [shareMessage, setShareMessage] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    if (!caseId) return;

    setLoading(true);

    fetchComplaint(caseId)
      .then((res) => {
        if (mounted) setComplaint(res.complaint ?? null);
      })
      .catch(() => {
        if (mounted) setComplaint(null);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [caseId, fetchComplaint]);

  if (loading) return <div className="text-sm text-slate-400">Loading...</div>;

  if (!complaint) return <div className="text-sm text-rose-400">Complaint not found.</div>;

  const evidence = (complaint as any).evidence ?? [];

  // Build a minimal timeline from known fields if no history provided
  const timeline =
    (complaint.history && complaint.history.length > 0)
      ? complaint.history
      : [
          { id: `created-${complaint.caseId}`, status: "Filed", timestamp: complaint.createdAt || new Date().toISOString() },
          { id: `updated-${complaint.caseId}`, status: complaint.status, timestamp: complaint.updatedAt || complaint.createdAt || new Date().toISOString() },
        ];

  const oppositeResponse = (complaint as any).oppositeResponse ?? (complaint.oppositeParty?.response ?? null);

  async function handleShare() {
    const url = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({
          title: complaint.title,
          text: `Complaint case ${complaint.caseId}`,
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        setShareMessage("Case link copied to clipboard.");
      }
    } catch {
      setShareMessage("Sharing was canceled or not available.");
    }
  }

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">{complaint.title}</h1>
          <p className="mt-1 text-sm text-slate-400">Case ID: {complaint.caseId}</p>
        </div>

        <div className="flex items-center gap-3">
          <ComplaintStatus status={complaint.status} />
          <BlockchainBadge />
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-4">
            <Card.Body>
              <h3 className="text-base font-semibold text-white">Details</h3>
              <p className="mt-3 text-sm text-slate-400">{complaint.description}</p>
            </Card.Body>
          </Card>

          <EvidenceViewer files={evidence} />

          <section>
            <h3 className="mb-2 text-sm font-semibold text-white">Opposite party response</h3>
            {oppositeResponse ? (
              <Card className="p-4">
                <Card.Body>
                  <p className="text-sm text-slate-200">{oppositeResponse}</p>
                </Card.Body>
              </Card>
            ) : (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-400">No response yet from the opposite party.</div>
            )}
          </section>
        </div>
        

        <aside className="space-y-4">
          <HashProof caseId={complaint.caseId} complaintHash={complaint.complaintHash} blockchainTxHash={complaint.blockchainTxHash} />
          <TimelineTracker events={timeline} />

          <Card className="p-4">
            <Card.Body>
              <h4 className="text-sm font-semibold text-white">Case actions</h4>
              <div className="mt-3 flex flex-col gap-2">
                <Button variant="ghost" onClick={handleShare}>Share</Button>
                <Button variant="ghost" disabled title="Appeal flow is not wired yet">
                  Appeal
                </Button>
              </div>
              {shareMessage && <p className="mt-3 text-xs text-slate-400">{shareMessage}</p>}
            </Card.Body>
          </Card>
        </aside>
      </div>
    </div>
  );
}
