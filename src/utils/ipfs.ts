/**
 * IPFS 上传和加载工具
 * 支持多种 IPFS 服务
 */

export interface IPFSUploadResult {
  hash: string;
  url: string;
}

/**
 * 上传文件到 IPFS (使用免费公共网关)
 * 注意：这是一个简化的实现，生产环境建议使用 Pinata、NFT.Storage 或 Web3.Storage
 */
export async function uploadToIPFS(file: File): Promise<IPFSUploadResult> {
  // 选项 1: 使用 Pinata (需要 API Key)
  if (import.meta.env.VITE_PINATA_API_KEY && import.meta.env.VITE_PINATA_SECRET_KEY) {
    return uploadToPinata(file);
  }

  // 选项 2: 使用 Web3.Storage (需要 API Token)
  if (import.meta.env.VITE_WEB3_STORAGE_TOKEN) {
    return uploadToWeb3Storage(file);
  }

  // 选项 3: 本地模拟（开发环境）
  console.warn('No IPFS service configured, using mock upload');
  return mockUpload(file);
}

/**
 * 上传到 Pinata
 */
async function uploadToPinata(file: File): Promise<IPFSUploadResult> {
  const formData = new FormData();
  formData.append('file', file);

  const metadata = JSON.stringify({
    name: file.name,
  });
  formData.append('pinataMetadata', metadata);

  const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
    method: 'POST',
    headers: {
      'pinata_api_key': import.meta.env.VITE_PINATA_API_KEY!,
      'pinata_secret_api_key': import.meta.env.VITE_PINATA_SECRET_KEY!,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to upload to Pinata');
  }

  const data = await response.json();
  const hash = data.IpfsHash;

  return {
    hash,
    url: `https://gateway.pinata.cloud/ipfs/${hash}`,
  };
}

/**
 * 上传到 Web3.Storage
 */
async function uploadToWeb3Storage(file: File): Promise<IPFSUploadResult> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('https://api.web3.storage/upload', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${import.meta.env.VITE_WEB3_STORAGE_TOKEN}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to upload to Web3.Storage');
  }

  const data = await response.json();
  const hash = data.cid;

  return {
    hash,
    url: `https://w3s.link/ipfs/${hash}`,
  };
}

/**
 * 模拟上传（开发/测试环境）
 */
async function mockUpload(file: File): Promise<IPFSUploadResult> {
  // 模拟上传延迟
  await new Promise(resolve => setTimeout(resolve, 1000));

  // 生成一个看起来真实的 IPFS 哈希
  const randomHash = 'Qm' + Array.from({ length: 44 }, () =>
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.charAt(
      Math.floor(Math.random() * 62)
    )
  ).join('');

  return {
    hash: randomHash,
    url: `https://ipfs.io/ipfs/${randomHash}`,
  };
}

/**
 * 上传文本内容到 IPFS
 */
export async function uploadTextToIPFS(content: string): Promise<IPFSUploadResult> {
  const blob = new Blob([content], { type: 'text/plain' });
  const file = new File([blob], 'content.txt', { type: 'text/plain' });
  return uploadToIPFS(file);
}

/**
 * 上传 JSON 数据到 IPFS
 */
export async function uploadJSONToIPFS(data: any): Promise<IPFSUploadResult> {
  const content = JSON.stringify(data, null, 2);
  const blob = new Blob([content], { type: 'application/json' });
  const file = new File([blob], 'metadata.json', { type: 'application/json' });
  return uploadToIPFS(file);
}

/**
 * 从 IPFS 获取图片 URL
 */
export function getIPFSImageUrl(hash: string): string {
  if (!hash) return '/placeholder.svg';

  // 如果已经是完整 URL，直接返回
  if (hash.startsWith('http://') || hash.startsWith('https://')) {
    return hash;
  }

  // 使用配置的网关或默认网关
  const gateway = import.meta.env.VITE_IPFS_GATEWAY || 'https://ipfs.io/ipfs/';
  return `${gateway}${hash}`;
}

/**
 * 从 IPFS 加载 JSON 数据
 */
export async function loadJSONFromIPFS(hash: string): Promise<any> {
  const url = getIPFSImageUrl(hash);
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Failed to load data from IPFS');
  }

  return response.json();
}

/**
 * 从 IPFS 加载文本内容
 */
export async function loadTextFromIPFS(hash: string): Promise<string> {
  const url = getIPFSImageUrl(hash);
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Failed to load text from IPFS');
  }

  return response.text();
}

/**
 * 检查 IPFS 哈希是否有效
 */
export function isValidIPFSHash(hash: string): boolean {
  // IPFS CID v0 格式: Qm... (46个字符)
  // IPFS CID v1 格式: bafy... 或其他
  return /^Qm[1-9A-HJ-NP-Za-km-z]{44}$/.test(hash) ||
         /^bafy[a-z0-9]{55,}$/.test(hash) ||
         /^bafk[a-z0-9]{55,}$/.test(hash);
}
