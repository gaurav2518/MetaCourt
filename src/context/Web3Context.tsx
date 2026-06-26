"use client";

import { createContext, ReactNode, useContext, useState } from "react";

type Web3ContextType = {
  walletAddress: string | null;
  connecting: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
};

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export function Web3Provider({ children }: { children: ReactNode }) {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);

  async function connectWallet() {
    try {
      setConnecting(true);

      if (!window.ethereum) {
        alert("MetaMask is not installed");
        return;
      }

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      setWalletAddress(accounts[0]);
    } finally {
      setConnecting(false);
    }
  }

  function disconnectWallet() {
    setWalletAddress(null);
  }

  return (
    <Web3Context.Provider
      value={{
        walletAddress,
        connecting,
        connectWallet,
        disconnectWallet,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
}

export function useWeb3() {
  const context = useContext(Web3Context);

  if (!context) {
    throw new Error("useWeb3 must be used inside Web3Provider");
  }

  return context;
}