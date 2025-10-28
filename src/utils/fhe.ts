/**
 * FHE SDK 初始化和加密工具
 * 基于 Zama FHE 完整开发指南的最佳实践
 */

import { createInstance, initSDK, SepoliaConfig } from '@zama-fhe/relayer-sdk/web';
import type { FhevmInstance } from '@zama-fhe/relayer-sdk/web';

// 全局单例实例
let fheInstance: FhevmInstance | null = null;
let initPromise: Promise<FhevmInstance> | null = null;

/**
 * 初始化 FHE SDK（单例模式）
 * ✅ 正确处理并发调用
 * ✅ 避免重复初始化
 * ✅ 使用 /bundle 路径导入
 */
export async function initializeFHE(): Promise<FhevmInstance> {
  // 如果已经初始化，直接返回
  if (fheInstance) {
    console.log('✅ FHE SDK 已初始化，返回现有实例');
    return fheInstance;
  }

  // 如果正在初始化，等待完成
  if (initPromise) {
    console.log('⏳ FHE SDK 正在初始化，等待完成...');
    return initPromise;
  }

  console.log('🚀 开始初始化 FHE SDK...');

  initPromise = (async () => {
    try {
      // 1. 初始化 WASM 模块（必须在 createInstance 之前）
      await initSDK();
      console.log('✅ WASM 模块加载成功');

      // 2. 创建 FHE 实例（使用 Sepolia 配置）
      const instance = await createInstance(SepoliaConfig);
      console.log('✅ FHE 实例创建成功');

      fheInstance = instance;
      return instance;
    } catch (error) {
      console.error('❌ FHE SDK 初始化失败:', error);
      initPromise = null; // 重置以允许重试
      throw error;
    }
  })();

  return initPromise;
}

/**
 * 获取当前 FHE 实例
 * 如果未初始化则返回 null
 */
export function getFHEInstance(): FhevmInstance | null {
  return fheInstance;
}

/**
 * 重置 FHE 实例（用于测试或网络切换）
 */
export function resetFHEInstance(): void {
  fheInstance = null;
  initPromise = null;
  console.log('🔄 FHE 实例已重置');
}

/**
 * 加密单个值的标准流程
 * @param value - 要加密的值
 * @param type - FHE 类型
 * @param contractAddress - 合约地址（必须是 checksum 格式）
 * @param userAddress - 用户地址
 * @returns handle 和 proof
 */
export async function encryptValue(
  value: number | bigint,
  type: 'uint8' | 'uint16' | 'uint32' | 'uint64',
  contractAddress: string,
  userAddress: string
): Promise<{ handle: Uint8Array; proof: Uint8Array }> {
  const fhe = await initializeFHE();

  // 创建加密输入
  const input = fhe.createEncryptedInput(contractAddress, userAddress);

  // 根据类型添加数据
  switch (type) {
    case 'uint8':
      input.add8(Number(value));
      break;
    case 'uint16':
      input.add16(Number(value));
      break;
    case 'uint32':
      input.add32(Number(value));
      break;
    case 'uint64':
      input.add64(BigInt(value));
      break;
    default:
      throw new Error(`不支持的类型: ${type}`);
  }

  // 加密
  const { handles, inputProof } = await input.encrypt();

  return {
    handle: handles[0],
    proof: inputProof
  };
}

/**
 * 加密多个值（共享 proof）
 * @param values - 要加密的值数组
 * @param contractAddress - 合约地址
 * @param userAddress - 用户地址
 * @returns handles 数组和共享的 proof
 */
export async function encryptMultipleValues(
  values: Array<{ value: number | bigint; type: 'uint8' | 'uint16' | 'uint32' | 'uint64' }>,
  contractAddress: string,
  userAddress: string
): Promise<{ handles: Uint8Array[]; proof: Uint8Array }> {
  const fhe = await initializeFHE();

  // 创建加密输入
  const input = fhe.createEncryptedInput(contractAddress, userAddress);

  // 按顺序添加所有值
  for (const { value, type } of values) {
    switch (type) {
      case 'uint8':
        input.add8(Number(value));
        break;
      case 'uint16':
        input.add16(Number(value));
        break;
      case 'uint32':
        input.add32(Number(value));
        break;
      case 'uint64':
        input.add64(BigInt(value));
        break;
    }
  }

  // 一次性加密所有值
  const { handles, inputProof } = await input.encrypt();

  return {
    handles,
    proof: inputProof
  };
}

/**
 * 检查 FHE 是否已初始化
 */
export function isFHEInitialized(): boolean {
  return fheInstance !== null;
}
