const hre = require("hardhat");

async function main() {
  const MetaCourt = await hre.ethers.getContractFactory("MetaCourt");

  const metaCourt = await MetaCourt.deploy();

  await metaCourt.waitForDeployment();

  const address = await metaCourt.getAddress();

  console.log("MetaCourt deployed to:", address);
  console.log("Copy this address to NEXT_PUBLIC_CONTRACT_ADDRESS");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});