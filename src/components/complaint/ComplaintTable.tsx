"use client";

import Link from "next/link";
import Table, { type TableColumn } from "@/components/ui/Table";
import ComplaintStatus from "./ComplaintStatus";
import Button from "@/components/ui/Button";

type ComplaintSummary = {
  caseId: string;
  title: string;
  status: string;
  category?: string;
  createdAt?: string;
  id?: string;
  _id?: string;
};

type Props = {
  complaints: ComplaintSummary[];
  isLoading?: boolean;
};

export default function ComplaintTable({ complaints, isLoading = false }: Props) {
  const columns: TableColumn<ComplaintSummary>[] = [
    { key: "caseId", label: "Case", headerClassName: "w-2/12", render: (item) => item.caseId },
    { key: "title", label: "Title", headerClassName: "w-6/12", render: (item) => item.title },
    { key: "category", label: "Category", headerClassName: "w-2/12", render: (item) => item.category ?? "—" },
    { key: "status", label: "Status", headerClassName: "w-1/12", render: (item) => <ComplaintStatus status={item.status} /> },
    {
      key: "actions",
      label: "",
      headerClassName: "w-1/12",
      render: (item) => (
        <div className="flex items-center gap-2">
          <Link href={`/complainant/cases/${item.caseId}`}>
            <Button variant="ghost">View</Button>
          </Link>
        </div>
      ),
    },
  ];

  return <Table columns={columns} data={complaints} isLoading={isLoading} />;
}
