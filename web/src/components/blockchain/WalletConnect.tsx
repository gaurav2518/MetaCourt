"use client";

import { useWeb3 } from "@/context/Web3Context";

function truncateAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export default function WalletConnect() {
  const { walletAddress, connecting, connectWallet, disconnectWallet } =
    useWeb3();

  if (walletAddress) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-3 py-2 text-sm text-[var(--color-text-primary)]">
        <span className="font-mono text-[var(--color-text-secondary)]">
          {truncateAddress(walletAddress)}
        </span>

        <button
          type="button"
          onClick={disconnectWallet}
          className="text-[var(--color-danger)]"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={connectWallet}
      disabled={connecting}
      className="rounded-lg bg-[var(--color-accent-primary)] px-4 py-2 text-sm font-medium text-white transition hover:bg-[var(--color-accent-hover)] disabled:opacity-60"
    >
      {connecting ? "Connecting..." : "Connect Wallet"}
    </button>
  );
}
