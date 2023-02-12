require("dotenv").config();
require("@nomicfoundation/hardhat-toolbox");
require("solidity-coverage");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  networks: {
    eth: {
      url: "https://rpc.ankr.com/eth",
      accounts: [process.env.PKDEPLOYER],
    },
    testnet: {
      url: "https://rpc.ankr.com/eth_goerli",
      accounts: [process.env.PKDEPLOYER],
    },
    hardhat: {
      forking: {
        url: "https://rpc.ankr.com/eth",
      },
    },
  },
  etherscan: {
    apiKey: "T1P35YUW7DSCXMY9YJ16KSI146JCR9YTYQ",
  },
};
