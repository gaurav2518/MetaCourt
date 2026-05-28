"use client";

import Link from "next/link";
import Card from "@/components/ui/Card";
import ComplaintStatus from "./ComplaintStatus";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

type ComplaintCardProps = {
  complaint: {
    caseId: string;
    title: string;
    description?: string;
    status: string;
    category?: string;
    createdAt?: string;
  };
};

export default function ComplaintCard({ complaint }: ComplaintCardProps) {
  const { caseId, title, description, status, category, createdAt } = complaint;

  return (
    <Card variant="glass" className="p-4">
      <Card.Body>
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-lg font-semibold text-white">{title}</h3>
            {description && <p className="mt-2 text-sm text-slate-400 line-clamp-3">{description}</p>}

            <div className="mt-3 flex items-center gap-2">
              {category && <Badge value={category} type="category" />}
              <span className="text-xs text-slate-400">{createdAt ? new Date(createdAt).toLocaleString() : ""}</span>
            </div>
          </div>

          <div className="flex shrink-0 flex-col items-end gap-3">
            <div className="flex items-center gap-2">
              <ComplaintStatus status={status} />
            </div>

            <Link href={`/complainant/cases/${caseId}`} className="w-full">
              <Button variant="secondary" className="w-full">View</Button>
            </Link>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}
