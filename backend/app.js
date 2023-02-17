const express = require("express");
const fs = require("fs");
const fileSystem = require("fs");
const cors = require("cors");
const { ethers } = require("ethers");
const mongodb = require("mongodb");
const { MongoClient } = require("mongodb");
const saveMetadata = require("./generateMetadata");
const saveImage = require("./generateImage");

const PORT = process.env.PORT || 3000;
const app = express(),
  DEFAULT_PORT = process.env.PORT;
app.use(cors());
app.use(express.json());

/* ---- Web3 ----- */
const provider = new ethers.JsonRpcProvider("https://rpc.ankr.com/eth_goerli");
const { abi } = require("./abi");
const address = "0xAe3e2cA6E60BED2DBfFF0895877B11cf2c9B246a";
const contract = new ethers.Contract(address, abi, provider);
/* ---- Web3 ----- */

contract.on("mintedDomain", (minter, domain, tokenId) => {
  console.log(minter, domain, tokenId);
  saveImage(domain);
  saveMetadata(domain);
});

app.get(`/metadata/:name`, (req, res) => {
  const domain = req.params.name;

  const readStream = fileSystem.createReadStream(`./metadata/${domain}.json`);
  readStream.pipe(res);
});

app.get(`/images/:domain`, (req, res) => {
  res.setHeader("Content-Type", "application/json");
  console.log(req.params.domain);

  res
    .status(200)
    .sendFile(
      `/media/dippy/MAIN/Users/Dippy/coding/blockchaindev/sns/backend/images/${req.params.domain}`
    );
});

app.listen(PORT, function () {
  console.log("Listening On Port ", PORT);
});
