// hardhat.config.js
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({ path: ".env.local" });

module.exports = {
  solidity: "0.8.19",
  networks: {
    sepolia: {
      url: process.env.NEXT_PUBLIC_RPC_URL,
      accounts: [process.env.PRIVATE_KEY]
    },
    localhost: {
      url: "http://127.0.0.1:8545"
    }
  },
  paths: {
    sources: "./contracts",
    artifacts: "./src/contracts/artifacts"  // puts ABI inside src
  }
};