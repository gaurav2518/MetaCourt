import MetaCourtArtifact from "@/contracts/artifacts/contracts/MetaCourt.sol/MetaCourt.json";

export const CONTRACT = {
  NETWORK: "sepolia",
  CHAIN_ID: 11155111,
  CONTRACT_ADDRESS:
    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ||
    "0x2EEF0E99D24bD1529508607580B7ED1954C771cb",
  CONTRACT_ABI: MetaCourtArtifact.abi,
};
