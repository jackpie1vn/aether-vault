import { ethers } from "hardhat";

async function main() {
  console.log("开始部署 ArtContest 合约...");

  // 获取部署者账户
  const [deployer] = await ethers.getSigners();
  console.log("部署账户:", deployer.address);
  console.log("账户余额:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "ETH");

  // 部署合约
  const ArtContest = await ethers.getContractFactory("ArtContest");
  const artContest = await ArtContest.deploy();

  await artContest.waitForDeployment();
  const contractAddress = await artContest.getAddress();

  console.log("✅ ArtContest 合约已部署到:", contractAddress);
  console.log("\n请将以下地址保存到 .env 文件:");
  console.log(`CONTRACT_ADDRESS=${contractAddress}`);
  console.log("\n验证合约命令:");
  console.log(`npx hardhat verify --network sepolia ${contractAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
