import { network } from "hardhat";

const { ethers } = await network.create();

async function main() {
  const MetaCourt = await ethers.getContractFactory("MetaCourt");
  const metaCourt = await MetaCourt.deploy();

  await metaCourt.waitForDeployment();

  console.log("MetaCourt deployed to:", await metaCourt.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
