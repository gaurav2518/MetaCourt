import "server-only";

import { Contract, JsonRpcProvider, Wallet } from "ethers";
import { CONTRACT } from "@/constants/contract";

let contractInstance: Contract | null = null;
let readOnlyContractInstance: Contract | null = null;

const DEFAULT_RPC_URL = "https://ethereum-sepolia-rpc.publicnode.com";
const DEFAULT_CONTRACT_ADDRESS = "0x2EEF0E99D24bD1529508607580B7ED1954C771cb";

export function getRpcUrl(): string {
  return (
    process.env.NEXT_PUBLIC_RPC_URL ||
    process.env.SEPOLIA_RPC_URL ||
    DEFAULT_RPC_URL
  );
}

export function getContractAddress(): string {
  return (
    CONTRACT.CONTRACT_ADDRESS ||
    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ||
    DEFAULT_CONTRACT_ADDRESS
  );
}

// Read-only contract instance for verification / view calls (does NOT require PRIVATE_KEY)
export function getReadOnlyContract(): Contract {
  if (readOnlyContractInstance) {
    return readOnlyContractInstance;
  }

  const rpcUrl = getRpcUrl();
  const address = getContractAddress();
  const provider = new JsonRpcProvider(rpcUrl);

  readOnlyContractInstance = new Contract(address, CONTRACT.CONTRACT_ABI, provider);
  return readOnlyContractInstance;
}

// Full contract instance with signer (for write transactions: fileCase, castVote, finalizeDecision)
export function getContract(): Contract {
  if (contractInstance) {
    return contractInstance;
  }

  const rpcUrl = getRpcUrl();
  const privateKey = process.env.PRIVATE_KEY;
  const address = getContractAddress();

  if (!privateKey) {
    throw new Error("PRIVATE_KEY is missing in environment variables");
  }

  const provider = new JsonRpcProvider(rpcUrl);
  const wallet = new Wallet(privateKey, provider);

  contractInstance = new Contract(address, CONTRACT.CONTRACT_ABI, wallet);
  return contractInstance;
}
