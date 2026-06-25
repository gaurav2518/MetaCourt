import "server-only";

import { Contract, JsonRpcProvider, Wallet } from "ethers";
import { CONTRACT } from "@/constants/contract";

let contractInstance: Contract | null = null;

export function getContract() {
  if (contractInstance) {
    return contractInstance;
  }

  const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL;
  const privateKey = process.env.PRIVATE_KEY;

  if (!rpcUrl) {
    throw new Error("NEXT_PUBLIC_RPC_URL is missing");
  }

  if (!privateKey) {
    throw new Error("PRIVATE_KEY is missing");
  }

  if (!CONTRACT.CONTRACT_ADDRESS) {
    throw new Error("NEXT_PUBLIC_CONTRACT_ADDRESS is missing");
  }

  const provider = new JsonRpcProvider(rpcUrl);
  const wallet = new Wallet(privateKey, provider);

  contractInstance = new Contract(CONTRACT.CONTRACT_ADDRESS, CONTRACT.CONTRACT_ABI, wallet);

  return contractInstance;
}