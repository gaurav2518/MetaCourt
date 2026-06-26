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
      <div className="flex items-center gap-2 rounded-xl border bg-white px-3 py-2 text-sm">
        <span className="font-mono text-slate-700">
          {truncateAddress(walletAddress)}
        </span>

        <button
          type="button"
          onClick={disconnectWallet}
          className="text-red-600"
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
      className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
    >
      {connecting ? "Connecting..." : "Connect Wallet"}
    </button>
  );
}