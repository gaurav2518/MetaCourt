import hardhatEthers from "@nomicfoundation/hardhat-ethers";
import hardhatIgnitionEthers from "@nomicfoundation/hardhat-ignition-ethers";
import { defineConfig } from "hardhat/config";

export default defineConfig({
  plugins: [hardhatEthers, hardhatIgnitionEthers],
  solidity: {
    profiles: {
      default: {
        version: "0.8.19",
      },
    },
  },
  paths: {
    artifacts: "src/contracts/artifacts",
  },
  networks: {
    localhost: {
      type: "http",
      chainType: "l1",
      url: "http://127.0.0.1:8545",
    },
  },
});
