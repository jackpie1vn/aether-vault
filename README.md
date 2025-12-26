# AetherVault - Encrypted Art Sanctuary

A decentralized art contest platform with FHE-powered private voting, built on the Zama Protocol.

## Overview

AetherVault enables artists to submit artwork and receive encrypted votes using Fully Homomorphic Encryption (FHE). This ensures complete voting privacy while maintaining on-chain transparency and verifiability.

## Features

- **Private Voting**: Vote counts are encrypted using FHE, ensuring voter privacy
- **On-chain Art Submissions**: Submit artwork with metadata stored on IPFS
- **Category-based Contests**: Organize artwork into multiple categories
- **Encrypted Leaderboards**: Rankings computed on encrypted data
- **Web3 Wallet Integration**: Connect with MetaMask or compatible wallets

## Technology Stack

### Smart Contracts
- **Solidity** ^0.8.27
- **fhEVM** v0.10.0 - Zama's FHE library for encrypted computations
- **Hardhat** - Development environment
- **Zama Protocol** - ZamaEthereumConfig for network configuration

### Frontend
- **React** 18 + TypeScript
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **@zama-fhe/relayer-sdk** 0.3.0-8 - FHE relayer integration
- **ethers.js** v6 - Ethereum interactions

## Smart Contract Architecture

The `ArtContest` contract inherits from `ZamaEthereumConfig` and provides:

```solidity
contract ArtContest is ZamaEthereumConfig {
    // Encrypted vote storage using FHE
    euint32 scoresEnc;  // Encrypted score counter

    // Key functions:
    function submitEntry(...) external returns (uint256 entryId)
    function scoreEntry(uint256 entryId) external
    function voteEntry(uint256 entryId, string category) external
}
```

### FHE Operations

- **Encrypted Addition**: `FHE.add(entry.scoresEnc, 1)` - Increment votes without revealing count
- **Access Control**: `FHE.allow()` / `FHE.allowTransient()` - Manage decryption permissions
- **Coprocessor Integration**: Automatic setup via `ZamaEthereumConfig`

## Getting Started

### Prerequisites

- Node.js >= 18
- npm or yarn
- MetaMask wallet

### Installation

```bash
# Clone the repository
git clone https://github.com/jackpie1vn/aether-vault.git
cd aether-vault

# Install frontend dependencies
npm install

# Install contract dependencies
cd contract
npm install
```

### Environment Setup

Create `.env` file in root directory:
```env
VITE_CONTRACT_ADDRESS=<deployed_contract_address>
VITE_ZAMA_RPC_URL=https://devnet.zama.ai
VITE_ZAMA_CHAIN_ID=9000
VITE_IPFS_GATEWAY=https://ipfs.io/ipfs/
```

Create `.env` file in contract directory:
```env
PRIVATE_KEY=<your_private_key>
ZAMA_RPC_URL=https://devnet.zama.ai
```

### Running the Application

```bash
# Start frontend development server
npm run dev

# Compile contracts
cd contract
npm run compile

# Deploy to Zama network
npm run deploy
```

## Network Configuration

| Network | Chain ID | RPC URL |
|---------|----------|---------|
| Zama Devnet | 9000 | https://devnet.zama.ai |
| Sepolia (testing) | 11155111 | https://ethereum-sepolia-rpc.publicnode.com |

## Project Structure

```
aether-vault/
├── src/
│   ├── components/     # React components
│   ├── pages/          # Page components
│   ├── utils/          # Utility functions
│   └── hooks/          # Custom React hooks
├── contract/
│   ├── contracts/      # Solidity contracts
│   ├── scripts/        # Deployment scripts
│   └── hardhat.config.ts
└── public/             # Static assets
```

## How It Works

1. **Submit Artwork**: Artists connect wallet and submit artwork with IPFS hash
2. **Private Voting**: Users cast encrypted votes using FHE
3. **Encrypted Tallying**: Vote counts remain encrypted on-chain
4. **Decryption**: Only authorized parties can decrypt vote counts via ACL

## Dependencies

### Contract
- `@fhevm/solidity`: 0.10.0
- `@fhevm/hardhat-plugin`: 0.3.0-4
- `hardhat`: ^2.26.3

### Frontend
- `@zama-fhe/relayer-sdk`: 0.3.0-8
- `ethers`: ^6.15.0
- `react`: ^18.3.1

## License

MIT

## Links

- [Zama Protocol Documentation](https://docs.zama.org/protocol)
- [fhEVM Solidity Library](https://github.com/zama-ai/fhevm-solidity)
- [Live Demo](https://aether-vault.vercel.app)

---

Built with Zama fhEVM for the Zama Developer Program
