# 部署指南

详细的 VeilArt 平台部署步骤。

## 📋 前置检查清单

在开始部署前，请确保：

- [ ] 已安装 Node.js 18+ 和 npm
- [ ] 已安装 MetaMask 钱包
- [ ] Sepolia 测试网账户有足够的 ETH（建议 >0.1 ETH）
- [ ] 已克隆项目代码
- [ ] 已安装所有依赖

## 🔧 步骤 1: 环境准备

### 1.1 获取 Sepolia 测试网 ETH

访问以下水龙头获取免费的测试 ETH：

- https://sepoliafaucet.com/
- https://www.alchemy.com/faucets/ethereum-sepolia
- https://faucet.quicknode.com/ethereum/sepolia

建议获取至少 0.1 ETH，因为 FHE 操作消耗较多 Gas。

### 1.2 准备私钥

从 MetaMask 导出私钥（测试账户）：

1. 打开 MetaMask
2. 点击账户菜单 → 账户详情
3. 点击"导出私钥"
4. 输入密码并复制私钥

⚠️ **安全提醒**: 只使用测试账户的私钥！永远不要使用主网账户！

## 🚀 步骤 2: 部署智能合约

### 2.1 配置合约环境变量

在 \`contract/\` 目录创建 \`.env\` 文件：

\`\`\`bash
cd contract
cp .env.example .env
\`\`\`

编辑 \`.env\` 文件：

\`\`\`env
SEPOLIA_RPC_URL=https://ethereum-sepolia-rpc.publicnode.com
PRIVATE_KEY=你的私钥（不要包含 0x 前缀）
\`\`\`

### 2.2 编译合约

\`\`\`bash
npm run compile
\`\`\`

预期输出：
\`\`\`
Compiled 1 Solidity file successfully
\`\`\`

### 2.3 部署合约到 Sepolia

\`\`\`bash
npm run deploy
\`\`\`

预期输出示例：
\`\`\`
开始部署 ArtContest 合约...
部署账户: 0x1234...5678
账户余额: 0.15 ETH

✅ ArtContest 合约已部署到: 0xAbCd...EfGh

请将以下地址保存到 .env 文件:
CONTRACT_ADDRESS=0xAbCd...EfGh

验证合约命令:
npx hardhat verify --network sepolia 0xAbCd...EfGh
\`\`\`

### 2.4 记录合约地址

**重要**: 复制输出的合约地址，你需要在以下位置配置它：

1. \`contract/.env\`:
   \`\`\`env
   CONTRACT_ADDRESS=0xAbCd...EfGh
   \`\`\`

2. 根目录 \`.env.local\`:
   \`\`\`env
   VITE_CONTRACT_ADDRESS=0xAbCd...EfGh
   \`\`\`

### 2.5 验证合约（可选但推荐）

\`\`\`bash
npx hardhat verify --network sepolia <合约地址>
\`\`\`

## 🖥️ 步骤 3: 配置和启动前端

### 3.1 配置前端环境变量

在项目根目录创建 \`.env.local\` 文件：

\`\`\`bash
cd ..  # 返回项目根目录
cp .env.example .env.local
\`\`\`

编辑 \`.env.local\` 文件：

\`\`\`env
VITE_SEPOLIA_RPC_URL=https://ethereum-sepolia-rpc.publicnode.com
VITE_SEPOLIA_CHAIN_ID=11155111
VITE_CONTRACT_ADDRESS=0xAbCd...EfGh  # 你的合约地址
VITE_IPFS_GATEWAY=https://ipfs.io/ipfs/
\`\`\`

### 3.2 安装前端依赖

\`\`\`bash
npm install
\`\`\`

### 3.3 启动开发服务器

\`\`\`bash
npm run dev
\`\`\`

预期输出：
\`\`\`
VITE v5.4.19  ready in 500 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
\`\`\`

### 3.4 访问应用

打开浏览器访问 http://localhost:5173

## ✅ 步骤 4: 功能测试

### 4.1 连接钱包

1. 点击页面上的"连接钱包"按钮
2. MetaMask 弹窗中选择测试账户
3. 确认连接
4. 等待 FHE SDK 初始化（约 2-3 秒）

预期结果：
- ✅ 显示钱包地址（0x1234...5678）
- ✅ 显示"FHE SDK 已就绪"绿色标识
- ✅ 网络显示为 Sepolia

### 4.2 测试提交作品

1. 访问"Submit Artwork"页面
2. 填写表单：
   - 标题: "Test Artwork"
   - 描述: "This is a test submission"
   - 上传任意图片文件
   - 选择至少一个类别
3. 点击"Submit Artwork"
4. 确认 MetaMask 交易

预期结果：
- ✅ Toast 提示"Uploading to IPFS..."
- ✅ Toast 提示"Submitting to blockchain..."
- ✅ MetaMask 弹出交易确认
- ✅ 交易确认后显示成功消息和 Entry ID

**Gas 费用参考**: submitEntry 约消耗 0.001-0.003 ETH

### 4.3 测试评分功能

1. 访问首页或作品详情页
2. 找到刚提交的作品
3. 点击"Score This Artwork"
4. 确认 MetaMask 交易

预期结果：
- ✅ Toast 提示"Submitting score..."
- ✅ 交易成功后显示交易哈希
- ✅ 评分计数器在链上加密更新

**Gas 费用参考**: scoreEntry 约消耗 0.0005-0.0015 ETH

### 4.4 测试投票功能

1. 在作品详情页选择一个类别
2. 点击"Vote"按钮
3. 确认 MetaMask 交易

预期结果：
- ✅ Toast 提示"Submitting vote..."
- ✅ 投票成功
- ✅ 该类别投票计数器加密更新

**Gas 费用参考**: voteEntry 约消耗 0.0005-0.0015 ETH

### 4.5 测试数据解密

作为参赛者（作品提交者）：

1. 访问自己提交的作品详情页
2. 在"Category Votes"部分看到"Decrypt"按钮
3. 点击"Decrypt"解密投票数据
4. 确认 MetaMask 签名请求（不消耗 Gas）

预期结果：
- ✅ 显示解密后的投票数值
- ✅ 非参赛者无法解密（按钮禁用）

## 📊 步骤 5: 区块链浏览器验证

### 5.1 查看合约

访问 Sepolia Etherscan:
\`\`\`
https://sepolia.etherscan.io/address/<你的合约地址>
\`\`\`

你应该能看到：
- ✅ 合约代码（如果已验证）
- ✅ 所有交易历史
- ✅ 事件日志（EntrySubmitted, EntryScored, EntryVoted）

### 5.2 验证交易

每次操作后，复制交易哈希访问：
\`\`\`
https://sepolia.etherscan.io/tx/<交易哈希>
\`\`\`

检查：
- ✅ 交易状态为 Success
- ✅ Gas 费用合理
- ✅ 事件日志正确

## 🌐 步骤 6: 生产部署（可选）

### 6.1 构建前端

\`\`\`bash
npm run build
\`\`\`

生成的文件在 \`dist/\` 目录。

### 6.2 部署到 Vercel

\`\`\`bash
# 安装 Vercel CLI
npm install -g vercel

# 部署
vercel
\`\`\`

按提示操作并配置环境变量。

### 6.3 部署到 Netlify

\`\`\`bash
# 安装 Netlify CLI
npm install -g netlify-cli

# 部署
netlify deploy --prod
\`\`\`

## 🐛 常见问题

### Q1: 部署合约时 Gas 费用过高

**A**: FHE 操作消耗的 Gas 确实比普通操作多。这是正常的。如果费用超过预期：
- 检查 Sepolia 网络拥堵情况
- 尝试在网络不繁忙时部署
- 确认 hardhat.config.ts 中的 optimizer 已启用

### Q2: FHE SDK 初始化失败

**A**: 检查：
- 导入路径是否正确（必须使用 \`/bundle\`）
- 网络连接是否正常
- 浏览器控制台是否有 WASM 加载错误

### Q3: MetaMask 交易一直 pending

**A**:
- 检查 Sepolia 网络状态
- 尝试加速交易（MetaMask 中点击"加速"）
- 如果长时间未确认，可以取消并重试

### Q4: 解密数据失败

**A**:
- 确认你是作品的参赛者（只有参赛者有权限）
- 检查 FHE SDK 是否正确初始化
- 查看浏览器控制台错误信息

## 📞 获取帮助

如果遇到问题：

1. 检查浏览器控制台错误
2. 查看 [FHE 完整开发指南](./FHE_COMPLETE_GUIDE_FULL_CN(1).md)
3. 访问 [Zama Discord](https://discord.gg/zama)
4. 提交 GitHub Issue

## ✨ 下一步

部署成功后，你可以：

- 邀请朋友测试
- 自定义 UI 主题
- 添加更多功能（如评论、分享等）
- 集成真实的 IPFS 上传
- 部署到主网（需要审计）

---

祝部署顺利！🎉
