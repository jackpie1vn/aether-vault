import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

// 加载环境变量
dotenv.config();

/**
 * 部署准备脚本
 * 检查所有部署前提条件
 */
async function main() {
  console.log("🚀 VeilArt 合约部署准备检查\n");
  console.log("=" .repeat(50));

  let allChecksPassed = true;

  // 1. 检查环境变量
  console.log("\n📋 检查 1: 环境变量配置");
  console.log("-".repeat(50));

  const requiredEnvVars = {
    SEPOLIA_RPC_URL: process.env.SEPOLIA_RPC_URL,
    PRIVATE_KEY: process.env.PRIVATE_KEY
  };

  for (const [key, value] of Object.entries(requiredEnvVars)) {
    if (!value || value.includes("your_") || value.includes("_here")) {
      console.log(`❌ ${key}: 未配置或使用了默认值`);
      allChecksPassed = false;
    } else if (key === "PRIVATE_KEY") {
      console.log(`✅ ${key}: 已配置 (${value.substring(0, 10)}...)`);
    } else {
      console.log(`✅ ${key}: ${value}`);
    }
  }

  // 2. 检查网络连接
  console.log("\n📋 检查 2: Sepolia 网络连接");
  console.log("-".repeat(50));

  try {
    const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
    const network = await provider.getNetwork();
    console.log(`✅ 网络连接成功`);
    console.log(`   Chain ID: ${network.chainId}`);
    console.log(`   Network Name: ${network.name}`);
  } catch (error) {
    console.log(`❌ 网络连接失败: ${error}`);
    allChecksPassed = false;
  }

  // 3. 检查部署账户
  console.log("\n📋 检查 3: 部署账户状态");
  console.log("-".repeat(50));

  try {
    const [deployer] = await ethers.getSigners();
    const address = deployer.address;
    const balance = await ethers.provider.getBalance(address);
    const balanceInEth = ethers.formatEther(balance);

    console.log(`✅ 部署账户: ${address}`);
    console.log(`   余额: ${balanceInEth} ETH`);

    const minBalance = ethers.parseEther("0.05");
    if (balance < minBalance) {
      console.log(`⚠️  警告: 余额低于建议最小值 0.05 ETH`);
      console.log(`   建议从水龙头获取更多测试 ETH`);
      allChecksPassed = false;
    }
  } catch (error) {
    console.log(`❌ 无法获取部署账户信息: ${error}`);
    allChecksPassed = false;
  }

  // 4. 检查合约编译
  console.log("\n📋 检查 4: 合约编译状态");
  console.log("-".repeat(50));

  const artifactsPath = path.join(__dirname, "../artifacts/contracts/ArtContest.sol/ArtContest.json");
  if (fs.existsSync(artifactsPath)) {
    console.log(`✅ 合约已编译`);
    const artifact = JSON.parse(fs.readFileSync(artifactsPath, "utf-8"));
    console.log(`   合约名称: ${artifact.contractName}`);
    console.log(`   编译器版本: ${artifact.compiler.version}`);
  } else {
    console.log(`❌ 合约未编译，请运行: npm run compile`);
    allChecksPassed = false;
  }

  // 5. 检查 Git 状态
  console.log("\n📋 检查 5: Git 安全检查");
  console.log("-".repeat(50));

  const gitignorePath = path.join(__dirname, "../../.gitignore");
  if (fs.existsSync(gitignorePath)) {
    const gitignore = fs.readFileSync(gitignorePath, "utf-8");
    if (gitignore.includes(".env") || gitignore.includes("*.env")) {
      console.log(`✅ .gitignore 包含 .env 文件保护`);
    } else {
      console.log(`⚠️  警告: .gitignore 可能未包含 .env 文件`);
      console.log(`   请确保不要将私钥提交到 Git`);
    }
  }

  // 6. 估算 Gas 费用
  console.log("\n📋 检查 6: Gas 费用估算");
  console.log("-".repeat(50));

  try {
    const feeData = await ethers.provider.getFeeData();
    const gasPrice = feeData.gasPrice || ethers.parseUnits("20", "gwei");
    const estimatedGas = 3000000n; // 估算部署 gas
    const estimatedCost = gasPrice * estimatedGas;

    console.log(`   当前 Gas Price: ${ethers.formatUnits(gasPrice, "gwei")} Gwei`);
    console.log(`   估算 Gas 用量: ${estimatedGas.toLocaleString()}`);
    console.log(`   预计部署成本: ${ethers.formatEther(estimatedCost)} ETH`);
  } catch (error) {
    console.log(`⚠️  无法获取 Gas 费用信息`);
  }

  // 总结
  console.log("\n" + "=".repeat(50));
  console.log("📊 检查总结");
  console.log("=".repeat(50));

  if (allChecksPassed) {
    console.log("✅ 所有检查通过！可以开始部署");
    console.log("\n📝 部署步骤:");
    console.log("   1. 确认账户余额充足");
    console.log("   2. 运行部署命令: npm run deploy");
    console.log("   3. 保存合约地址");
    console.log("   4. 更新前端 .env.local");
    console.log("   5. (可选) 在 Etherscan 验证合约");
  } else {
    console.log("❌ 部分检查未通过，请修复后再部署");
    console.log("\n🔧 修复建议:");
    console.log("   1. 检查 contract/.env 文件配置");
    console.log("   2. 确保 PRIVATE_KEY 正确（不含 0x 前缀）");
    console.log("   3. 从水龙头获取测试 ETH");
    console.log("   4. 确保网络连接正常");
  }

  console.log("\n" + "=".repeat(50));
  console.log("📚 更多信息请查看: CONTRACT_DEPLOYMENT_GUIDE.md");
  console.log("=".repeat(50) + "\n");

  process.exit(allChecksPassed ? 0 : 1);
}

main()
  .then(() => {})
  .catch((error) => {
    console.error("❌ 检查过程出错:", error);
    process.exit(1);
  });
