/**
 * FHE React Hook
 * 管理 FHE SDK 的初始化状态和实例
 */

import { useState, useEffect, useCallback } from 'react';
import { initializeFHE, getFHEInstance, isFHEInitialized } from '@/utils/fhe';
import type { FhevmInstance } from '@zama-fhe/relayer-sdk/web';

interface UseFHEReturn {
  fhe: FhevmInstance | null;
  isInitialized: boolean;
  isInitializing: boolean;
  error: Error | null;
  initialize: () => Promise<void>;
}

/**
 * useFHE Hook
 *
 * 使用示例:
 * ```tsx
 * const { fhe, isInitialized, initialize } = useFHE();
 *
 * useEffect(() => {
 *   if (!isInitialized) {
 *     initialize();
 *   }
 * }, [isInitialized, initialize]);
 * ```
 */
export function useFHE(): UseFHEReturn {
  const [fhe, setFhe] = useState<FhevmInstance | null>(getFHEInstance());
  const [isInitializing, setIsInitializing] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // 初始化函数
  const initialize = useCallback(async () => {
    // 避免重复初始化
    if (isFHEInitialized() || isInitializing) {
      return;
    }

    setIsInitializing(true);
    setError(null);

    try {
      const instance = await initializeFHE();
      setFhe(instance);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('FHE 初始化失败');
      setError(error);
      console.error('❌ FHE Hook 初始化失败:', error);
    } finally {
      setIsInitializing(false);
    }
  }, [isInitializing]);

  // 组件挂载时检查是否已初始化
  useEffect(() => {
    const instance = getFHEInstance();
    if (instance) {
      setFhe(instance);
    }
  }, []);

  return {
    fhe,
    isInitialized: fhe !== null,
    isInitializing,
    error,
    initialize
  };
}

/**
 * 自动初始化的 FHE Hook
 * 组件挂载时自动初始化 FHE
 */
export function useAutoInitFHE(): UseFHEReturn {
  const fheState = useFHE();

  useEffect(() => {
    if (!fheState.isInitialized && !fheState.isInitializing) {
      fheState.initialize();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fheState.isInitialized, fheState.isInitializing]);

  return fheState;
}
