/**
 * 合约交互工具
 * 提供与 ArtContest 合约交互的便捷函数
 */

import { ethers, BrowserProvider, Contract, Signer } from 'ethers';
import { ART_CONTEST_ABI, type ContestEntry } from '@/lib/contract-abi';
import { initializeFHE } from './fhe';

// 从环境变量获取合约地址
export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || '';

/**
 * 获取合约实例
 */
export async function getContract(signer?: Signer): Promise<Contract> {
  if (!CONTRACT_ADDRESS) {
    throw new Error('合约地址未配置，请设置 VITE_CONTRACT_ADDRESS 环境变量');
  }

  if (signer) {
    return new Contract(CONTRACT_ADDRESS, ART_CONTEST_ABI, signer);
  }

  // 只读模式（使用公共 RPC）
  const provider = new ethers.JsonRpcProvider(
    import.meta.env.VITE_SEPOLIA_RPC_URL || 'https://ethereum-sepolia-rpc.publicnode.com'
  );
  return new Contract(CONTRACT_ADDRESS, ART_CONTEST_ABI, provider);
}

/**
 * 获取 Provider 和 Signer
 */
export async function getProviderAndSigner(): Promise<{
  provider: BrowserProvider;
  signer: Signer;
  address: string;
}> {
  if (typeof window.ethereum === 'undefined') {
    throw new Error('请安装 MetaMask 钱包');
  }

  const provider = new BrowserProvider(window.ethereum);
  await provider.send('eth_requestAccounts', []);
  const signer = await provider.getSigner();
  const address = await signer.getAddress();

  return { provider, signer, address };
}

/**
 * 提交参赛作品
 */
export async function submitEntry(
  title: string,
  descriptionHash: string,
  fileHash: string,
  tags: string[],
  categories: string[]
): Promise<{ entryId: bigint; txHash: string }> {
  const { signer } = await getProviderAndSigner();
  const contract = await getContract(signer);

  // 调用合约（不需要加密参数）
  const tx = await contract.submitEntry(
    title,
    descriptionHash,
    fileHash,
    tags,
    categories
  );

  const receipt = await tx.wait();

  // 从事件中获取 entryId
  const event = receipt.logs
    .map((log: any) => {
      try {
        return contract.interface.parseLog(log);
      } catch {
        return null;
      }
    })
    .find((e: any) => e && e.name === 'EntrySubmitted');

  const entryId = event ? event.args.entryId : 0n;

  return {
    entryId,
    txHash: receipt.hash
  };
}

/**
 * 给作品评分
 */
export async function scoreEntry(entryId: number | bigint): Promise<string> {
  const { signer } = await getProviderAndSigner();
  const contract = await getContract(signer);

  const tx = await contract.scoreEntry(entryId);
  const receipt = await tx.wait();

  return receipt.hash;
}

/**
 * 给作品投票（按类别）
 */
export async function voteForEntry(
  entryId: number | bigint,
  category: string
): Promise<string> {
  const { signer } = await getProviderAndSigner();
  const contract = await getContract(signer);

  const tx = await contract.voteEntry(entryId, category);
  const receipt = await tx.wait();

  return receipt.hash;
}

/**
 * 获取参赛作品详情
 */
export async function getEntryDetails(entryId: number | bigint): Promise<ContestEntry> {
  const contract = await getContract();

  const result = await contract.getEntry(entryId);

  return {
    id: result.id,
    contestant: result.contestant,
    title: result.title,
    descriptionHash: result.descriptionHash,
    fileHash: result.fileHash,
    tags: result.tags,
    categories: result.categories,
    timestamp: result.timestamp,
    scoresHandle: result.scoresHandle
  };
}

/**
 * 获取所有参赛作品 ID
 */
export async function getAllEntryIds(): Promise<bigint[]> {
  const contract = await getContract();
  return await contract.getAllEntries();
}

/**
 * 获取某类别的投票计数句柄
 */
export async function getCategoryVotesHandle(
  entryId: number | bigint,
  category: string
): Promise<bigint> {
  const contract = await getContract();
  return await contract.getCategoryVotes(entryId, category);
}

/**
 * 解密加密数据（需要 ACL 权限）
 * @param handle - 加密数据的句柄
 * @param contractAddress - 合约地址
 * @param userAddress - 用户地址
 */
export async function decryptHandle(
  handle: bigint,
  contractAddress: string,
  userAddress: string
): Promise<number> {
  const fhe = await initializeFHE();

  try {
    // 使用 FHE SDK 解密
    const decrypted = await fhe.decrypt(contractAddress, userAddress, handle.toString());
    return Number(decrypted);
  } catch (error) {
    console.error('解密失败:', error);
    throw new Error('解密失败，可能没有权限访问此数据');
  }
}

/**
 * 批量获取所有参赛作品
 */
export async function getAllEntries(): Promise<ContestEntry[]> {
  const ids = await getAllEntryIds();
  const entries = await Promise.all(
    ids.map(id => getEntryDetails(id))
  );
  return entries;
}

/**
 * 检查钱包网络是否正确
 */
export async function checkNetwork(): Promise<boolean> {
  if (typeof window.ethereum === 'undefined') {
    return false;
  }

  const provider = new BrowserProvider(window.ethereum);
  const network = await provider.getNetwork();
  const expectedChainId = BigInt(import.meta.env.VITE_SEPOLIA_CHAIN_ID || 11155111);

  return network.chainId === expectedChainId;
}

/**
 * 切换到 Sepolia 网络
 */
export async function switchToSepolia(): Promise<void> {
  if (typeof window.ethereum === 'undefined') {
    throw new Error('请安装 MetaMask 钱包');
  }

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0xaa36a7' }] // Sepolia chainId = 11155111 = 0xaa36a7
    });
  } catch (error: any) {
    // 如果网络不存在，添加网络
    if (error.code === 4902) {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: '0xaa36a7',
          chainName: 'Sepolia Test Network',
          nativeCurrency: {
            name: 'SepoliaETH',
            symbol: 'ETH',
            decimals: 18
          },
          rpcUrls: ['https://ethereum-sepolia-rpc.publicnode.com'],
          blockExplorerUrls: ['https://sepolia.etherscan.io']
        }]
      });
    } else {
      throw error;
    }
  }
}

// 扩展 Window 接口以支持 ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}
