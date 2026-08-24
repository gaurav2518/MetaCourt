"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import ComplaintTable from "@/components/complaint/ComplaintTable";
import ComplaintStatus from "@/components/complaint/ComplaintStatus";
import { STATUS } from "@/constants/status";
import { useComplaints } from "@/hooks/useComplaints";

export default function ComplainantDashboardPage() {
  const { fetchComplaints, loading } = useComplaints();
  const [complaints, setComplaints] = useState<any[]>([]);

  useEffect(() => {
    let mounted = true;

    fetchComplaints({ as: "complainant" })
      .then((data) => {
        if (mounted) setComplaints(data || []);
      })
      .catch(() => {
        if (mounted) setComplaints([]);
      });

    return () => {
      mounted = false;
    };
  }, [fetchComplaints]);

  const stats = useMemo(() => {
    const total = complaints.length;
    const underReview = complaints.filter((c) => c.status === STATUS.UNDER_REVIEW).length;
    const inVoting = complaints.filter((c) => c.status === STATUS.VOTING).length;
    const decided = complaints.filter((c) => c.status === STATUS.DECIDED).length;

    return { total, underReview, inVoting, decided };
  }, [complaints]);

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-[var(--color-text-primary)]">My Cases</h1>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">Manage complaints you have filed as a complainant.</p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/complainant/file">
            <Button>File New Complaint</Button>
          </Link>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <Card className="p-4">
          <Card.Body>
            <p className="text-sm text-[var(--color-text-secondary)]">Total Filed</p>
            <p className="mt-2 font-display text-2xl font-semibold text-[var(--color-text-primary)]">{stats.total}</p>
          </Card.Body>
        </Card>

        <Card className="p-4">
          <Card.Body>
            <p className="text-sm text-[var(--color-text-secondary)]">Under Review</p>
            <p className="mt-2 font-display text-2xl font-semibold text-[var(--color-text-primary)]">{stats.underReview}</p>
          </Card.Body>
        </Card>

        <Card className="p-4">
          <Card.Body>
            <p className="text-sm text-[var(--color-text-secondary)]">In Voting</p>
            <p className="mt-2 font-display text-2xl font-semibold text-[var(--color-text-primary)]">{stats.inVoting}</p>
          </Card.Body>
        </Card>

        <Card className="p-4">
          <Card.Body>
            <p className="text-sm text-[var(--color-text-secondary)]">Decided</p>
            <p className="mt-2 font-display text-2xl font-semibold text-[var(--color-text-primary)]">{stats.decided}</p>
          </Card.Body>
        </Card>
      </div>

      <section>
        <h2 className="mb-3 text-sm font-semibold text-[var(--color-text-primary)]">Your complaints</h2>

        <ComplaintTable complaints={complaints} isLoading={loading} />
      </section>
    </div>
  );
}
