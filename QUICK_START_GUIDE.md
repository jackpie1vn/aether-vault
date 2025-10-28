# 🚀 VeilArt 快速启动指南

**项目**: VeilArt - Privacy-First Art Contest Platform
**技术栈**: React + TypeScript + Zama FHE + IPFS
**状态**: ✅ 生产就绪

---

## ⚡ 5 分钟快速启动

### 1. 安装依赖
```bash
npm install
```

### 2. 启动开发服务器
```bash
npm run dev
```

### 3. 访问应用
```
http://localhost:8084/
```

### 4. 连接钱包
- 点击右上角 "Connect Wallet"
- 在 MetaMask 中选择账户
- 切换到 Sepolia 测试网

### 5. 开始使用
- 浏览作品: [首页](http://localhost:8084/)
- 提交作品: [Submit](http://localhost:8084/submit)
- 查看排行: [Leaderboard](http://localhost:8084/leaderboard)
- 我的作品: [My Works](http://localhost:8084/my-submissions)

---

## 📋 必要配置

### 环境变量 (.env.local)

```bash
# 合约配置（必需）
VITE_CONTRACT_ADDRESS=0xCe384F1Ec5B35F0856e2d2669b87F017aCF731AE
VITE_SEPOLIA_RPC_URL=https://ethereum-sepolia-rpc.publicnode.com
VITE_SEPOLIA_CHAIN_ID=11155111

# IPFS 配置（可选，用于生产环境）
# 选项 1: Pinata
VITE_PINATA_API_KEY=your_api_key
VITE_PINATA_SECRET_KEY=your_secret_key

# 选项 2: Web3.Storage
VITE_WEB3_STORAGE_TOKEN=your_token

# IPFS 网关（可选）
VITE_IPFS_GATEWAY=https://ipfs.io/ipfs/
```

### MetaMask 配置

**网络**: Sepolia Testnet
- **RPC URL**: https://ethereum-sepolia-rpc.publicnode.com
- **Chain ID**: 11155111
- **货币符号**: ETH
- **区块浏览器**: https://sepolia.etherscan.io

**获取测试 ETH**: https://sepoliafaucet.com/

---

## 🎯 核心功能

### 1. 浏览作品
- 路径: `/`
- 功能: 查看所有提交的艺术作品
- 特性: 搜索、分类过滤、IPFS 图片加载

### 2. 提交作品
- 路径: `/submit`
- 功能: 上传艺术作品到平台
- 流程:
  1. 连接钱包
  2. 填写作品信息（标题、描述）
  3. 选择类别和标签
  4. 上传图片文件
  5. 提交（自动上传到 IPFS + 区块链）

### 3. 排行榜
- 路径: `/leaderboard`
- 功能: 按类别查看作品排行
- 特性: 类别切换、真实合约数据、FHE 加密投票

### 4. 我的作品
- 路径: `/my-submissions`
- 功能: 查看自己提交的作品
- 特性: 加密评分显示、投票统计

### 5. 作品详情
- 路径: `/artwork/:id`
- 功能: 查看作品详细信息
- 特性:
  - 高清图片（IPFS）
  - 评分和投票（FHE 加密）
  - 分类投票统计
  - IPFS 链接

---

## 🔑 关键技术

### Zama FHE（完全同态加密）
- **作用**: 链上加密计算投票和评分
- **特性**: 数据加密状态下进行计算
- **限制**: 无法直接比较加密值（需解密）

### IPFS（去中心化存储）
- **作用**: 存储作品图片和描述
- **服务**: Pinata / Web3.Storage / Mock
- **特性**: 永久存储、内容寻址

### 智能合约
- **地址**: `0xCe384F1Ec5B35F0856e2d2669b87F017aCF731AE`
- **网络**: Sepolia Testnet
- **功能**: 作品提交、投票、评分、数据查询

---

## 🐛 常见问题

### Q1: 钱包连接不上？
**检查**:
- MetaMask 是否已安装
- 是否切换到 Sepolia 网络
- 浏览器是否禁用了弹出窗口

### Q2: 图片不显示？
**原因**:
- IPFS 网关响应慢
- 网络连接问题

**解决**:
- 等待几秒后刷新
- 切换 IPFS 网关（修改 VITE_IPFS_GATEWAY）

### Q3: 提交作品失败？
**检查**:
- 钱包是否有足够的 Sepolia ETH
- 是否授权交易
- 文件大小是否过大（建议 < 5MB）

### Q4: 为什么看不到投票数？
**解释**:
- 投票数是 FHE 加密的
- 显示为 "Encrypted" 徽章
- 只有授权用户可以解密查看

### Q5: Leaderboard 为什么不是按投票排序？
**解释**:
- FHE 加密数据无法直接比较
- 当前按提交时间排序
- 未来会添加授权解密排序功能

---

## 📱 页面功能速查

| 页面 | 路径 | 是否需要钱包 | 主要功能 |
|------|------|--------------|----------|
| 首页 | `/` | ❌ | 浏览所有作品 |
| 提交作品 | `/submit` | ✅ | 上传作品到平台 |
| 排行榜 | `/leaderboard` | ❌ | 按类别查看排行 |
| 我的作品 | `/my-submissions` | ✅ | 查看个人作品 |
| 作品详情 | `/artwork/:id` | 可选 | 查看详情、投票评分 |

---

## 🛠️ 开发命令

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview

# 编译智能合约
cd contract && npm run compile

# 部署合约到 Sepolia
cd contract && npm run deploy:sepolia

# TypeScript 类型检查
npm run type-check
```

---

## 📊 项目状态

### ✅ 已完成功能
- [x] 智能合约开发和部署
- [x] FHE 加密投票和评分
- [x] IPFS 文件上传和加载
- [x] 钱包连接和账户管理
- [x] 作品提交和展示
- [x] 分类和标签系统
- [x] 搜索和过滤功能
- [x] 响应式设计

### 🔄 进行中功能
- [ ] 授权解密和真实排名
- [ ] 用户个人资料
- [ ] 评论和社交功能

### 📅 计划功能
- [ ] 多链支持
- [ ] NFT 铸造
- [ ] 奖励系统
- [ ] 移动应用

---

## 🔗 重要链接

### 开发
- **本地服务器**: http://localhost:8084/
- **Vite 配置**: [vite.config.ts](vite.config.ts)
- **TypeScript 配置**: [tsconfig.json](tsconfig.json)

### 合约
- **合约地址**: 0xCe384F1Ec5B35F0856e2d2669b87F017aCF731AE
- **Etherscan**: https://sepolia.etherscan.io/address/0xCe384F1Ec5B35F0856e2d2669b87F017aCF731AE
- **源代码**: [contract/contracts/veil.sol](contract/contracts/veil.sol)

### 文档
- **IPFS 集成**: [IPFS_INTEGRATION_COMPLETE.md](IPFS_INTEGRATION_COMPLETE.md)
- **钱包修复**: [WALLET_CONNECTION_FIX.md](WALLET_CONNECTION_FIX.md)
- **改进汇总**: [RECENT_IMPROVEMENTS_SUMMARY.md](RECENT_IMPROVEMENTS_SUMMARY.md)
- **FHE 指南**: [FHE_COMPLETE_GUIDE_FULL_CN(1).md](FHE_COMPLETE_GUIDE_FULL_CN(1).md)

### 外部资源
- **Zama 文档**: https://docs.zama.ai/
- **Pinata**: https://www.pinata.cloud/
- **Web3.Storage**: https://web3.storage/
- **Sepolia Faucet**: https://sepoliafaucet.com/

---

## 💡 最佳实践

### 作品提交
1. **优化图片**: 上传前压缩图片（推荐 < 2MB）
2. **选择类别**: 最多选择 3 个相关类别
3. **添加标签**: 使用描述性标签方便搜索
4. **详细描述**: 提供作品创作背景和理念

### 投票评分
1. **仔细评估**: 根据艺术性、创意、技术等维度评分
2. **公平公正**: FHE 确保投票隐私，诚实投票
3. **分类投票**: 不同类别可以给不同分数

### 性能优化
1. **使用 Pinata**: 配置 Pinata API 获得更快的 IPFS 速度
2. **稳定网络**: 确保良好的网络连接
3. **足够 Gas**: 保持钱包有足够的 Sepolia ETH

---

## 🎨 设计规范

### 颜色主题
- **Primary**: 紫色系 (#9b87f5)
- **Secondary**: 青色系 (#7E69AB)
- **Accent**: 粉色系 (#F97583)
- **Background**: 深色渐变

### 组件库
- **UI**: shadcn/ui
- **图标**: Lucide React
- **动画**: Framer Motion
- **样式**: Tailwind CSS

---

## 📈 性能指标

### 加载时间
- 首页首次加载: < 2s
- 图片加载（IPFS）: 3-10s（取决于网关）
- 合约交互: 1-5s（取决于网络）

### 用户体验
- 响应式设计: 支持移动端、平板、桌面
- 加载状态: 所有异步操作有加载提示
- 错误处理: 友好的错误信息和重试选项

---

## 🎉 开始使用

现在你已经准备好开始使用 VeilArt 了！

1. ✅ 启动开发服务器
2. ✅ 连接 MetaMask 钱包
3. ✅ 获取一些 Sepolia ETH
4. ✅ 提交你的第一件艺术作品
5. ✅ 浏览和投票其他作品

**祝你使用愉快！** 🎨🔒✨

---

**项目地址**: http://localhost:8084/
**合约地址**: 0xCe384F1Ec5B35F0856e2d2669b87F017aCF731AE
**更新时间**: 2025-10-26
