# 🚀 VeilArt 合约部署指南

本指南将帮助你将 ArtContest 合约部署到 Sepolia 测试网。

---

## 📋 部署前准备

### 1. 环境要求

- ✅ Node.js (v18+)
- ✅ npm 或 yarn
- ✅ MetaMask 钱包
- ✅ Sepolia 测试网 ETH

### 2. 获取 Sepolia 测试网 ETH

你需要一些 Sepolia ETH 来支付 gas 费用。可以从以下水龙头获取：

1. **Alchemy Sepolia Faucet**: https://sepoliafaucet.com/
2. **Infura Sepolia Faucet**: https://www.infura.io/faucet/sepolia
3. **Chainlink Sepolia Faucet**: https://faucets.chain.link/sepolia

**建议余额**: 至少 0.1 ETH（部署成本约 0.02-0.05 ETH）

### 3. 准备私钥

⚠️ **安全提醒**:
- 永远不要使用你的主钱包私钥
- 为测试创建一个新的钱包地址
- 不要将 `.env` 文件提交到 Git

**获取 MetaMask 私钥**:
1. 打开 MetaMask
2. 点击账户菜单 → 账户详情
3. 导出私钥
4. 复制私钥（不包含 `0x` 前缀）

---

## 🔧 配置步骤

### 步骤 1: 创建环境变量文件

在 `contract/` 目录下创建 `.env` 文件：

```bash
cd contract
cp .env.example .env
```

### 步骤 2: 编辑 `.env` 文件

```bash
# Sepolia测试网配置
SEPOLIA_RPC_URL=https://ethereum-sepolia-rpc.publicnode.com
PRIVATE_KEY=your_private_key_here_without_0x_prefix

# 合约地址（部署后会自动填写）
CONTRACT_ADDRESS=
```

**替换内容**:
- `your_private_key_here_without_0x_prefix` → 你的钱包私钥（不要包含 `0x`）

### 步骤 3: 检查钱包余额

运行以下命令检查部署账户的余额：

```bash
cd contract
npx hardhat console --network sepolia
```

在控制台中输入：
```javascript
const [deployer] = await ethers.getSigners();
console.log("账户:", deployer.address);
console.log("余额:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "ETH");
```

确保余额 > 0.05 ETH

---

## 📦 编译合约

在部署前，先编译合约以确保没有错误：

```bash
cd contract
npm run compile
```

**预期输出**:
```
Compiled 1 Solidity file successfully
```

如果遇到错误，请检查：
1. Solidity 版本是否为 0.8.27
2. 依赖是否正确安装 (`@fhevm/solidity`)
3. 是否有语法错误

---

## 🚀 部署合约

### 方法 1: 使用 npm 脚本（推荐）

```bash
cd contract
npm run deploy
```

### 方法 2: 使用 Hardhat 命令

```bash
cd contract
npx hardhat run scripts/deploy.ts --network sepolia
```

### 预期输出

```
开始部署 ArtContest 合约...
部署账户: 0x1234567890abcdef1234567890abcdef12345678
账户余额: 0.1234 ETH

✅ ArtContest 合约已部署到: 0xABCDEF1234567890ABCDEF1234567890ABCDEF12

请将以下地址保存到 .env 文件:
CONTRACT_ADDRESS=0xABCDEF1234567890ABCDEF1234567890ABCDEF12

验证合约命令:
npx hardhat verify --network sepolia 0xABCDEF1234567890ABCDEF1234567890ABCDEF12
```

### 保存合约地址

**重要**: 复制输出的合约地址，你需要在以下地方使用它：

1. **更新 contract/.env**:
   ```bash
   CONTRACT_ADDRESS=0xABCDEF1234567890ABCDEF1234567890ABCDEF12
   ```

2. **更新前端 .env.local**:
   ```bash
   VITE_CONTRACT_ADDRESS=0xABCDEF1234567890ABCDEF1234567890ABCDEF12
   VITE_SEPOLIA_RPC_URL=https://ethereum-sepolia-rpc.publicnode.com
   VITE_SEPOLIA_CHAIN_ID=11155111
   ```

---

## ✅ 验证合约（可选但推荐）

合约验证让你的合约源码在 Etherscan 上可见，增加透明度和信任度。

### 步骤 1: 获取 Etherscan API Key

1. 访问 https://etherscan.io/
2. 注册/登录账户
3. 创建 API Key: https://etherscan.io/myapikey

### 步骤 2: 添加 API Key 到 .env

```bash
ETHERSCAN_API_KEY=your_etherscan_api_key_here
```

### 步骤 3: 更新 hardhat.config.ts

在 `contract/hardhat.config.ts` 中添加：

```typescript
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-verify";

const config: HardhatUserConfig = {
  // ... 现有配置
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  }
};
```

### 步骤 4: 验证合约

```bash
cd contract
npx hardhat verify --network sepolia <CONTRACT_ADDRESS>
```

**预期输出**:
```
Successfully submitted source code for contract
contracts/veil.sol:ArtContest at 0xABCDEF...
for verification on the block explorer. Waiting for verification result...

Successfully verified contract ArtContest on Etherscan.
https://sepolia.etherscan.io/address/0xABCDEF...#code
```

---

## 🔗 更新前端配置

### 步骤 1: 更新 .env.local

在项目根目录（不是 contract 目录）创建/更新 `.env.local`:

```bash
VITE_CONTRACT_ADDRESS=0xYOUR_DEPLOYED_CONTRACT_ADDRESS
VITE_SEPOLIA_RPC_URL=https://ethereum-sepolia-rpc.publicnode.com
VITE_SEPOLIA_CHAIN_ID=11155111
```

### 步骤 2: 重启开发服务器

```bash
npm run dev
```

### 步骤 3: 测试连接

1. 打开浏览器访问 http://localhost:5173
2. 连接 MetaMask 钱包
3. 切换到 Sepolia 测试网
4. 尝试提交一个测试作品

---

## 🧪 测试部署的合约

### 使用 Hardhat Console 测试

```bash
cd contract
npx hardhat console --network sepolia
```

在控制台中测试：

```javascript
// 1. 获取合约实例
const ArtContest = await ethers.getContractFactory("ArtContest");
const contract = ArtContest.attach("0xYOUR_CONTRACT_ADDRESS");

// 2. 提交测试作品
const tx = await contract.submitEntry(
  "Test Artwork",
  "QmTestDescriptionHash",
  "QmTestFileHash",
  ["test", "demo"],
  ["Digital Art"]
);
await tx.wait();
console.log("✅ Entry submitted");

// 3. 获取所有作品
const entries = await contract.getAllEntries();
console.log("Total entries:", entries.length);

// 4. 获取作品详情
const entry = await contract.getEntry(1);
console.log("Entry title:", entry.title);
```

### 使用前端测试

1. 访问首页，应该能看到提交的测试作品
2. 点击"Submit Artwork"提交新作品
3. 查看作品详情页
4. 尝试评分和投票功能
5. 访问"My Submissions"查看自己的作品

---

## 🐛 常见问题排查

### 问题 1: "insufficient funds for gas"

**原因**: 账户余额不足

**解决方案**:
- 从水龙头获取更多 Sepolia ETH
- 检查是否在正确的网络（Sepolia）
- 查看账户余额: `npx hardhat console --network sepolia`

### 问题 2: "nonce has already been used"

**原因**: Nonce 冲突

**解决方案**:
```bash
# 清除 Hardhat 缓存
rm -rf contract/cache contract/artifacts
npm run compile
```

### 问题 3: 合约部署成功但前端无法连接

**检查清单**:
- [ ] `.env.local` 中的合约地址是否正确
- [ ] 是否重启了开发服务器
- [ ] MetaMask 是否连接到 Sepolia 网络
- [ ] 浏览器控制台是否有错误信息

### 问题 4: "Contract not found" 错误

**原因**: 合约地址配置错误或网络不匹配

**解决方案**:
1. 确认合约地址格式正确（42个字符，以 `0x` 开头）
2. 确认 MetaMask 连接到 Sepolia
3. 在 Sepolia Etherscan 查看合约是否存在

### 问题 5: FHE 相关错误

**检查**:
- FHE SDK 是否正确初始化
- 是否使用了正确的网络配置（SepoliaConfig）
- 查看浏览器控制台的详细错误信息

---

## 📊 Gas 费用估算

| 操作 | 预估 Gas | 预估费用 (假设 20 Gwei) |
|------|---------|------------------------|
| 部署合约 | ~3,000,000 | ~0.06 ETH |
| 提交作品 | ~200,000 | ~0.004 ETH |
| 评分 | ~100,000 | ~0.002 ETH |
| 投票 | ~120,000 | ~0.0024 ETH |

**注意**: 实际费用会根据网络拥堵情况波动。

---

## 🔍 查看合约信息

### Sepolia Etherscan

访问: https://sepolia.etherscan.io/address/YOUR_CONTRACT_ADDRESS

你可以查看：
- 合约代码（如果已验证）
- 交易历史
- 事件日志
- 合约状态

### 读取合约数据

```javascript
// 使用 ethers.js
const provider = new ethers.JsonRpcProvider("https://ethereum-sepolia-rpc.publicnode.com");
const contract = new ethers.Contract(contractAddress, abi, provider);

// 读取数据
const entries = await contract.getAllEntries();
const entry = await contract.getEntry(1);
```

---

## 📝 部署检查清单

在正式部署前，确认以下事项：

- [ ] 合约代码已审计（至少代码审查）
- [ ] 所有测试用例通过
- [ ] 私钥安全存储（不是主钱包）
- [ ] 账户有足够的 Sepolia ETH (> 0.1 ETH)
- [ ] `.env` 文件配置正确
- [ ] `.gitignore` 包含 `.env` 文件
- [ ] 合约编译无错误
- [ ] 了解 Gas 费用成本
- [ ] 准备好在 Etherscan 上验证合约
- [ ] 有备份部署脚本和配置

---

## 🎯 部署后步骤

### 1. 记录合约信息

创建一个 `DEPLOYMENT_INFO.md` 文件记录：

```markdown
# 部署信息

- **合约地址**: 0xABCDEF...
- **部署账户**: 0x123456...
- **部署时间**: 2025-10-26 14:00 UTC
- **网络**: Sepolia Testnet
- **区块高度**: 1234567
- **交易哈希**: 0xabcdef...
- **Gas 使用**: 3,000,000
- **部署费用**: 0.06 ETH
- **Etherscan**: https://sepolia.etherscan.io/address/0xABCDEF...
```

### 2. 更新文档

更新项目 README 和文档中的合约地址。

### 3. 通知团队

如果是团队项目，通知所有成员新的合约地址。

### 4. 监控合约

定期检查：
- 交易活动
- Gas 使用情况
- 错误日志
- 用户反馈

---

## 🚨 紧急情况处理

### 合约有严重 Bug 怎么办？

由于智能合约不可修改，如果发现严重问题：

1. **立即停止使用** - 通知所有用户
2. **部署新版本** - 修复 bug 后重新部署
3. **迁移数据** - 如果需要，迁移重要数据
4. **更新前端** - 指向新合约地址

### 升级策略

考虑使用代理模式（Proxy Pattern）实现可升级合约：
- Transparent Proxy
- UUPS Proxy
- Beacon Proxy

**注意**: 当前合约不支持升级，未来版本可以考虑添加。

---

## 📚 相关资源

- **Hardhat 文档**: https://hardhat.org/docs
- **Zama fhEVM 文档**: https://docs.zama.ai/fhevm
- **Sepolia Testnet**: https://sepolia.etherscan.io/
- **Ethers.js 文档**: https://docs.ethers.org/v6/
- **Solidity 文档**: https://docs.soliditylang.org/

---

## 🎉 部署完成

恭喜！你的 VeilArt 合约已经成功部署到 Sepolia 测试网。

**下一步**:
1. 在前端测试所有功能
2. 邀请朋友测试
3. 收集反馈
4. 优化和改进
5. 准备主网部署

**主网部署注意事项**:
- 进行完整的安全审计
- 增加测试覆盖率
- 获取更多的测试反馈
- 准备充足的 Gas 费用（主网 ETH）
- 考虑购买合约保险

---

**最后更新**: 2025-10-26
**版本**: v1.0.0

祝你部署顺利！🚀
