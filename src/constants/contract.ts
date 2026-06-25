import MetaCourtArtifact from "@/contracts/artifacts/contracts/MetaCourt.sol/MetaCourt.json";
export const CONTRACT = {
  NETWORK: "localhost",
  CHAIN_ID: 31337,
  CONTRACT_ADDRESS: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "" ,
  CONTRACT_ABI: MetaCourtArtifact.abi,
};