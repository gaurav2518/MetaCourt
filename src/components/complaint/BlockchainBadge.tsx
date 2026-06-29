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
          ? "bg-emerald-600/10 text-emerald-300"
          : "bg-amber-600/10 text-amber-300"
      }`}
    >
      {isRegistered ? "Blockchain registered" : "Pending blockchain registration"}
    </div>
  );
}
