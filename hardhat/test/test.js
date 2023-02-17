require("dotenv").config();
const { time } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");
const { ethers } = require("hardhat");
// Helpers
const toWei = (amt) => ethers.utils.parseEther(amt.toString());
const fromWei = (amt) => ethers.utils.formatEther(amt);
// Uniswap Router
const abi = require("../abi/abi");

// TEST
describe("Test", function () {
  let SNSContract,
    provider,
    deployer,
    pairAddress,
    account1,
    account2,
    account3;

  before("deploy", async function () {
    // Get Signers
    [deployer, account1, account2, account3] = await hre.ethers.getSigners();
    provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545/");
    const wallet = new ethers.Wallet(process.env.PK, provider);
    // Deploy
    const SNS = await hre.ethers.getContractFactory("SNS");
    SNSContract = await SNS.deploy();
    await SNSContract.deployed();

    pairAddress = SNSContract.uniswapV2Pair();

    /* await wallet.sendTransaction({
      to: SNSContract.address,
      value: ethers.utils.parseEther("10"),
    }); */
  });
  // Check owners Address
  it("Deployed with correct Owner", async function () {
    expect(await SNSContract.owner()).to.equal(deployer.address);
  });
  it("Adds Liquidity", async function () {
    await SNSContract.addLiq({ value: toWei(20) });
    expect(Number(fromWei(await SNSContract.balanceOf(pairAddress)))).to.equal(
      100000000000
    );
    const weth = new ethers.Contract(abi.WETHAddress, abi.ERCABI, provider);
  });
  it("Max Transaction limit", async function () {
    // Account 1 buys more than the max tx limit
    const router = new ethers.Contract(
      abi.routerAddress,
      abi.routerAbi,
      account1
    );

    const deadline = Math.floor(Date.now() / 1000) + 60 * 10;

    await expect(
      router.swapExactETHForTokens(
        0,
        [abi.WETHAddress, SNSContract.address],
        account1.address,
        deadline,
        { value: toWei(0.3) }
      )
    ).to.be.reverted;
  });
  it("Max Wallet limit", async function () {
    // Account 2 buys 3 times and goes over the max wallet limit
    const router = new ethers.Contract(
      abi.routerAddress,
      abi.routerAbi,
      account2
    );

    const deadline = Math.floor(Date.now() / 1000) + 60 * 10;

    await router.swapExactETHForTokens(
      0,
      [abi.WETHAddress, SNSContract.address],
      account2.address,
      deadline,
      { value: toWei(0.2) }
    );
    await router.swapExactETHForTokens(
      0,
      [abi.WETHAddress, SNSContract.address],
      account2.address,
      deadline,
      { value: toWei(0.2) }
    );

    await expect(
      router.swapExactETHForTokens(
        0,
        [abi.WETHAddress, SNSContract.address],
        account2.address,
        deadline,
        { value: toWei(0.1) }
      )
    ).to.be.reverted;
  });
});
