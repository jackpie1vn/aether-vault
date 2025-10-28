# 🔍 VeilArt 故障排查指南

## 快速修复步骤

如果遇到错误，请按以下顺序尝试：

### 1️⃣ 重启开发服务器

```bash
# 1. 停止服务器 (Ctrl+C)
# 2. 清理缓存
rm -rf node_modules/.vite
# 3. 重启
npm run dev
```

### 2️⃣ 硬刷新浏览器

- **Windows/Linux**: `Ctrl + Shift + R`
- **Mac**: `Cmd + Shift + R`

### 3️⃣ 检查控制台

打开浏览器控制台（F12），查看错误信息。

---

## 常见错误及解决方案

### ❌ 错误 1: `Cannot read properties of undefined (reading 'initSDK')`

**原因**: FHE SDK 导入路径错误

**解决方案**:
已修复！确保使用正确的导入：

```typescript
// ✅ 正确
import { createInstance, initSDK } from '@zama-fhe/relayer-sdk/web';

// ❌ 错误
import { createInstance, initSDK } from '@zama-fhe/relayer-sdk/bundle';
```

**文件**:
- `src/utils/fhe.ts`
- `src/hooks/useFHE.ts`

**详细文档**: [BUGFIX_FINAL.md](BUGFIX_FINAL.md)

---

### ❌ 错误 2: `global is not defined`

**原因**: Node.js 全局变量在浏览器中不存在

**解决方案**:
已修复！添加了 polyfill。

**必须重启服务器**:
```bash
# 停止服务器 (Ctrl+C)
npm run dev
```

然后硬刷新浏览器。

**文件**:
- `vite.config.ts` - 添加了 `define` 配置
- `index.html` - 添加了 polyfill script

**详细文档**: [BUGFIX_GLOBAL.md](BUGFIX_GLOBAL.md)

---

### ❌ 错误 3: `process is not defined`

**解决方案**: 同上（错误 2 的 polyfill 也会修复这个）

---

### ❌ 错误 4: FHE SDK 初始化超时

**现象**:
```
⏳ FHE SDK 正在初始化，等待完成...
```
长时间无响应。

**原因**:
- 网络连接问题
- WASM 文件下载失败

**解决方案**:
1. 检查网络连接
2. 查看 Network 标签，确认 WASM 文件加载
3. 尝试刷新页面
4. 如果在国内，可能需要代理

---

### ❌ 错误 5: MetaMask 连接失败

**现象**: "请安装 MetaMask 钱包"

**解决方案**:
1. 确认已安装 MetaMask 扩展
2. 确认 MetaMask 已解锁
3. 刷新页面
4. 检查浏览器控制台是否有其他错误

---

### ❌ 错误 6: 网络错误 (Wrong network)

**现象**: "请切换到 Sepolia 测试网络"

**解决方案**:
1. 点击"切换网络"按钮
2. 在 MetaMask 中确认网络切换
3. 如果没有 Sepolia 网络，会自动添加

---

### ❌ 错误 7: 合约地址未配置

**现象**: "合约地址未配置"

**解决方案**:
1. 确认 `.env.local` 文件存在
2. 检查 `VITE_CONTRACT_ADDRESS` 是否已设置
3. 重启开发服务器

```bash
# .env.local
VITE_CONTRACT_ADDRESS=0x你的合约地址
```

---

### ❌ 错误 8: 交易失败 (Insufficient funds)

**现象**: "insufficient funds for gas"

**解决方案**:
1. 访问 Sepolia 水龙头获取测试 ETH
   - https://sepoliafaucet.com/
   - https://www.alchemy.com/faucets/ethereum-sepolia
2. 确保至少有 0.05 ETH

---

### ❌ 错误 9: TypeScript 类型错误

**现象**: IDE 中显示类型错误

**解决方案**:
```bash
# 1. 清理并重新安装
rm -rf node_modules package-lock.json
npm install

# 2. 重启 TypeScript 服务器 (VSCode)
# Cmd/Ctrl + Shift + P -> "TypeScript: Restart TS Server"
```

---

### ❌ 错误 10: 构建失败

**现象**: `npm run build` 失败

**解决方案**:
1. 检查是否有 TypeScript 错误
2. 确保所有依赖已安装
3. 清理并重新构建

```bash
rm -rf node_modules package-lock.json dist
npm install
npm run build
```

---

## 完整的重置流程

如果所有方法都失败，执行完整重置：

```bash
# 1. 停止所有服务
# Ctrl+C 停止开发服务器

# 2. 清理所有缓存和依赖
rm -rf node_modules
rm -rf node_modules/.vite
rm -rf dist
rm package-lock.json

# 3. 重新安装
npm install

# 4. 清理浏览器
# - 清除浏览器缓存
# - 关闭所有相关标签页
# - 重新打开浏览器

# 5. 重启服务器
npm run dev

# 6. 浏览器硬刷新
# Ctrl+Shift+R 或 Cmd+Shift+R
```

---

## 检查清单

在报告问题前，请确认：

- [ ] 已重启开发服务器
- [ ] 已硬刷新浏览器
- [ ] 已检查浏览器控制台错误
- [ ] 已检查 Network 标签（WASM 文件是否加载）
- [ ] 已确认 MetaMask 安装并解锁
- [ ] 已确认在 Sepolia 网络
- [ ] 已确认 `.env.local` 配置正确
- [ ] 已确认有足够的测试 ETH

---

## 调试技巧

### 1. 查看详细日志

打开浏览器控制台（F12），所有 FHE 初始化步骤都会有日志：

```
🚀 开始初始化 FHE SDK...
✅ WASM 模块加载成功
✅ FHE 实例创建成功
```

### 2. 检查 Network 请求

1. 打开 DevTools → Network 标签
2. 刷新页面
3. 查找 `.wasm` 文件
4. 确认状态码为 200

### 3. 检查已安装的包

```bash
npm list @zama-fhe/relayer-sdk
# 应该显示: @zama-fhe/relayer-sdk@0.2.0

npm list ethers
# 应该显示: ethers@6.13.x
```

### 4. 验证环境变量

```bash
cat .env.local
# 应该包含:
# VITE_CONTRACT_ADDRESS=0x...
# VITE_SEPOLIA_RPC_URL=...
```

---

## 性能优化建议

### 1. FHE SDK 初始化较慢

**正常情况**:
- 首次加载需要 2-3 秒（下载 WASM）
- 后续加载更快（浏览器缓存）

**如果持续很慢**:
- 检查网络速度
- 查看是否有代理/VPN 影响
- 考虑使用 CDN（但不推荐）

### 2. 交易确认较慢

**Sepolia 测试网**:
- 平均 10-15 秒
- 网络拥堵时可能更久

**加速方法**:
- 在 MetaMask 中增加 Gas 费用
- 等待网络不繁忙时再试

---

## 获取帮助

如果以上方法都无法解决问题：

### 1. 收集信息

- 完整的错误信息（控制台截图）
- 浏览器和版本
- 操作系统
- 重现步骤

### 2. 查看文档

- [README_VEILART.md](README_VEILART.md) - 项目概述
- [QUICKSTART.md](QUICKSTART.md) - 快速开始
- [DEPLOYMENT.md](DEPLOYMENT.md) - 部署指南
- [BUGFIX_FINAL.md](BUGFIX_FINAL.md) - SDK 导入修复
- [BUGFIX_GLOBAL.md](BUGFIX_GLOBAL.md) - Global 变量修复

### 3. 社区资源

- [Zama Discord](https://discord.gg/zama)
- [GitHub Issues](https://github.com/zama-ai/fhevm)
- [Zama 文档](https://docs.zama.ai/)

---

## 已知问题

### 1. Safari 浏览器支持

**状态**: 部分支持

某些旧版本的 Safari 可能不支持 WASM。建议使用：
- Chrome 90+
- Firefox 88+
- Edge 90+

### 2. 私密/无痕模式

**状态**: 可能有问题

某些浏览器在私密模式下限制 WASM。建议在普通模式下测试。

---

**最后更新**: 2025-10-26
**版本**: v1.0.0
**状态**: ✅ 所有已知问题已修复

---

## 快速参考

| 问题 | 快速修复 | 详细文档 |
|-----|---------|---------|
| initSDK undefined | 重启服务器 | [BUGFIX_FINAL.md](BUGFIX_FINAL.md) |
| global not defined | 重启服务器 + 硬刷新 | [BUGFIX_GLOBAL.md](BUGFIX_GLOBAL.md) |
| 钱包连接失败 | 检查 MetaMask | - |
| 网络错误 | 切换到 Sepolia | - |
| 合约地址未配置 | 设置 .env.local | [DEPLOYMENT.md](DEPLOYMENT.md) |

🎉 **祝你使用愉快！**
