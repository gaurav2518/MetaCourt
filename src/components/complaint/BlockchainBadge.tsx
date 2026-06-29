"use client";

type BlockchainBadgeProps = {
  complaintHash?: string | null;
  blockchainTxHash?: string | null;
};

export default function BlockchainBadge({
  complaintHash,
  blockchainTxHash,
}: BlockchainBadgeProps) {
  const isRegistered = Boolean(complaintHash && blockchainTxHash);

  return (
    <div
      className={`rounded-full px-3 py-1 text-xs font-medium ${
        isRegistered
          ? "bg-[rgba(16,185,129,0.15)] text-[var(--color-success)]"
          : "bg-[rgba(245,158,11,0.15)] text-[var(--color-warning)]"
      }`}
    >
      {isRegistered ? "Blockchain registered" : "Pending blockchain registration"}
    </div>
  );
}
