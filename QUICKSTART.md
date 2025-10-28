# 🚀 VeilArt 快速启动指南

最快 5 分钟上手 VeilArt 平台！

## ⚡ 一键安装和配置

### 步骤 1: 准备工作（1 分钟）

**需要准备**:
- ✅ 已安装 MetaMask
- ✅ 在 Sepolia 测试网有 >0.05 ETH

**获取测试 ETH**:
访问 https://sepoliafaucet.com/ 获取免费测试币

### 步骤 2: 安装依赖（2 分钟）

复制粘贴以下命令到终端：

\`\`\`bash
# 克隆项目
git clone <your-repo-url>
cd veil-art-unveiled

# 安装所有依赖（前端 + 合约）
npm install && cd contract && npm install && cd ..

# 完成！
\`\`\`

### 步骤 3: 快速配置（1 分钟）

#### 3.1 配置合约环境变量

\`\`\`bash
cd contract
echo "SEPOLIA_RPC_URL=https://ethereum-sepolia-rpc.publicnode.com
PRIVATE_KEY=你的测试账户私钥" > .env
cd ..
\`\`\`

**获取私钥**: MetaMask → 账户详情 → 导出私钥

⚠️ **只使用测试账户！**

#### 3.2 配置前端环境变量

\`\`\`bash
echo "VITE_SEPOLIA_RPC_URL=https://ethereum-sepolia-rpc.publicnode.com
VITE_SEPOLIA_CHAIN_ID=11155111
VITE_CONTRACT_ADDRESS=待部署后填写
VITE_IPFS_GATEWAY=https://ipfs.io/ipfs/" > .env.local
\`\`\`

### 步骤 4: 部署合约（1 分钟）

\`\`\`bash
cd contract
npm run deploy
\`\`\`

**记下输出的合约地址**，例如：`0xAbCd...EfGh`

然后更新前端配置：

\`\`\`bash
cd ..
# 编辑 .env.local，将 VITE_CONTRACT_ADDRESS 设置为你的合约地址
\`\`\`

或使用命令（Mac/Linux）：

\`\`\`bash
sed -i '' 's/VITE_CONTRACT_ADDRESS=.*/VITE_CONTRACT_ADDRESS=你的合约地址/' .env.local
\`\`\`

### 步骤 5: 启动应用（10 秒）

\`\`\`bash
npm run dev
\`\`\`

打开浏览器访问: http://localhost:5173

## 🎮 快速体验流程

### 1. 连接钱包（10 秒）

1. 点击右上角"连接钱包"
2. 选择 MetaMask 账户
3. 等待 FHE SDK 初始化完成
   - 看到 ✅ "FHE SDK 已就绪" 即可

### 2. 提交第一个作品（30 秒）

1. 点击导航栏"Submit Artwork"
2. 快速填写：
   - 标题: `My First NFT`
   - 描述: `Testing VeilArt platform`
   - 上传任意图片
   - 选择类别: `Digital Art`
3. 点击"Submit Artwork"
4. 在 MetaMask 确认交易
5. 等待交易确认（约 10-15 秒）

**预期**: 看到 "Artwork submitted successfully! Entry ID: 1"

### 3. 给作品评分（15 秒）

1. 回到首页查看刚提交的作品
2. 点击"Score This Artwork"
3. 确认 MetaMask 交易
4. 等待确认

**预期**: 看到 "Score submitted successfully!"

### 4. 投票（15 秒）

1. 在作品卡片上选择类别: `Digital Art`
2. 点击"Vote"
3. 确认交易

**预期**: 看到 "Vote submitted successfully for Digital Art!"

### 5. 查看加密数据（10 秒）

1. 进入你提交的作品详情页
2. 在"Category Votes"部分看到各类别的加密数据
3. 点击"Decrypt"按钮（只有你作为参赛者可以）
4. 查看解密后的真实投票数

**预期**: 显示投票数字（如 1）

## 🎯 完整体验清单

- [ ] 连接钱包成功
- [ ] FHE SDK 初始化成功
- [ ] 提交一个作品
- [ ] 给作品评分
- [ ] 给作品投票
- [ ] 解密查看投票数据
- [ ] 在 Etherscan 查看交易记录

## 📊 预期效果

完成上述步骤后，你应该：

1. **在区块链上**:
   - 1 个 submitEntry 交易
   - 1 个 scoreEntry 交易
   - 1 个 voteEntry 交易

2. **总花费**: 约 0.002 - 0.005 ETH

3. **在应用中**:
   - 作品列表显示你的作品
   - 评分计数器已更新（加密）
   - 投票计数器已更新（加密）
   - 你可以解密查看真实数据

## 🔍 验证部署

### 检查合约

访问 Sepolia Etherscan:
\`\`\`
https://sepolia.etherscan.io/address/<你的合约地址>
\`\`\`

应该看到：
- ✅ 3+ 笔交易
- ✅ Events 标签下有事件日志
- ✅ Code 标签（如果已验证合约）

### 检查前端

1. 打开浏览器控制台（F12）
2. 查看 Console 标签
3. 应该看到：
   ```
   ✅ FHE SDK 已初始化
   ✅ WASM 模块加载成功
   ✅ FHE 实例创建成功
   ```

## 🐛 遇到问题？

### FHE SDK 初始化失败

**解决**:
1. 刷新页面
2. 检查网络连接
3. 清除浏览器缓存

### 交易失败

**解决**:
1. 确认账户有足够 ETH（>0.05 ETH）
2. 检查是否在 Sepolia 网络
3. 查看 MetaMask 错误信息

### 合约地址未配置

**解决**:
```bash
# 检查 .env.local
cat .env.local | grep CONTRACT_ADDRESS

# 应该看到类似:
# VITE_CONTRACT_ADDRESS=0xAbCd...
```

如果为空，重新部署合约并更新配置。

## 💡 下一步

成功体验后，你可以：

1. **邀请朋友测试**
   - 分享应用链接
   - 让他们投票给你的作品

2. **探索更多功能**
   - 提交多个作品
   - 测试不同类别
   - 查看排行榜

3. **自定义开发**
   - 修改 UI 样式
   - 添加新功能
   - 集成真实 IPFS

4. **深入学习**
   - 阅读 [FHE 开发指南](./FHE_COMPLETE_GUIDE_FULL_CN(1).md)
   - 查看 [完整部署文档](./DEPLOYMENT.md)
   - 访问 [Zama 官方文档](https://docs.zama.ai/)

## 🎉 完成！

恭喜你成功部署和体验了 VeilArt 平台！

现在你已经掌握了：
- ✅ FHE 智能合约部署
- ✅ 前端 Web3 集成
- ✅ 加密数据操作
- ✅ ACL 权限管理

继续探索更多可能性吧！🚀

---

需要帮助？查看 [常见问题](./DEPLOYMENT.md#常见问题) 或提交 Issue。
