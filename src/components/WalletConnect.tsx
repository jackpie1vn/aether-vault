/**
 * 钱包连接组件
 * 支持 MetaMask 连接和网络切换
 */

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Wallet, CheckCircle2, AlertCircle } from 'lucide-react';
import { getProviderAndSigner, checkNetwork, switchToSepolia } from '@/utils/contract';
import { useAutoInitFHE } from '@/hooks/useFHE';

interface WalletConnectProps {
  onConnected?: (address: string) => void;
}

export function WalletConnect({ onConnected }: WalletConnectProps) {
  const [address, setAddress] = useState<string>('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string>('');
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(true);

  const { isInitialized: isFHEInitialized, isInitializing: isFHEInitializing, error: fheError } = useAutoInitFHE();

  // 检查钱包是否已连接
  useEffect(() => {
    checkWalletConnection();
  }, []);

  // 监听账户和网络变化
  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, []);

  const checkWalletConnection = async () => {
    if (typeof window.ethereum === 'undefined') {
      return;
    }

    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts.length > 0) {
        setAddress(accounts[0]);
        const networkOk = await checkNetwork();
        setIsCorrectNetwork(networkOk);
        if (onConnected) {
          onConnected(accounts[0]);
        }
      }
    } catch (err) {
      console.error('检查钱包连接失败:', err);
    }
  };

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      setAddress('');
    } else {
      setAddress(accounts[0]);
      if (onConnected) {
        onConnected(accounts[0]);
      }
    }
  };

  const handleChainChanged = () => {
    window.location.reload();
  };

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      setError('请安装 MetaMask 钱包');
      return;
    }

    setIsConnecting(true);
    setError('');

    try {
      const { address: userAddress } = await getProviderAndSigner();
      setAddress(userAddress);

      // 检查网络
      const networkOk = await checkNetwork();
      setIsCorrectNetwork(networkOk);

      if (!networkOk) {
        setError('请切换到 Sepolia 测试网络');
      } else if (onConnected) {
        onConnected(userAddress);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : '连接钱包失败';
      setError(errorMsg);
      console.error('连接钱包失败:', err);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSwitchNetwork = async () => {
    try {
      await switchToSepolia();
      setIsCorrectNetwork(true);
      setError('');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : '切换网络失败';
      setError(errorMsg);
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  // 如果已连接，显示地址卡片
  if (address) {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wallet className="w-5 h-5" />
              <div>
                <p className="text-sm text-muted-foreground">已连接</p>
                <p className="font-mono font-medium">{formatAddress(address)}</p>
              </div>
            </div>
            {isCorrectNetwork ? (
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={handleSwitchNetwork}
              >
                切换网络
              </Button>
            )}
          </div>

          {/* FHE 初始化状态 */}
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">FHE SDK</span>
              {isFHEInitializing && <span className="text-yellow-600">初始化中...</span>}
              {isFHEInitialized && <span className="text-green-600 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                已就绪
              </span>}
              {fheError && <span className="text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                初始化失败
              </span>}
            </div>
          </div>

          {!isCorrectNetwork && (
            <Alert className="mt-4" variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                请切换到 Sepolia 测试网络
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    );
  }

  // 未连接，显示连接按钮
  return (
    <div className="space-y-4 w-full max-w-md">
      <Card>
        <CardContent className="pt-6">
          <Button
            onClick={connectWallet}
            disabled={isConnecting}
            className="w-full"
            size="lg"
          >
            <Wallet className="w-5 h-5 mr-2" />
            {isConnecting ? '连接中...' : '连接钱包'}
          </Button>

          {/* FHE 初始化状态 */}
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">FHE SDK</span>
              {isFHEInitializing && <span className="text-yellow-600">初始化中...</span>}
              {isFHEInitialized && <span className="text-green-600 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                已就绪
              </span>}
              {fheError && <span className="text-red-600">初始化失败</span>}
            </div>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {typeof window.ethereum === 'undefined' && (
        <Alert>
          <AlertDescription>
            请安装{' '}
            <a
              href="https://metamask.io/download/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-medium"
            >
              MetaMask 钱包
            </a>{' '}
            以使用此应用
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
