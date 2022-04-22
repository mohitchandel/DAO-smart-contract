// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";

async function main() {
  // Deploying flayer token 
  const VotingToken = await ethers.getContractFactory("VotingToken");
  const token = await VotingToken.deploy();
  await token.deployed();

  // deploying staking contract
  const Governance = await ethers.getContractFactory("Governance");
  const contract = await Governance.deploy(token.address);
  await contract.deployed();

  console.log("VotingToken deployed to:", token.address);
  console.log("Governance deployed to:", contract.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
