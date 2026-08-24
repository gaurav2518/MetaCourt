"use client";

import Badge from "@/components/ui/Badge";

type Props = {
  status: string;
};

export default function ComplaintStatus({ status }: Props) {
  return <Badge value={status} type="status" />;
}
