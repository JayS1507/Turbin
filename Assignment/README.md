# Solana Assignment 2 — SPL Token & NFT Minting

## Overview
This project demonstrates:
1. **SPL Token Minting** — Creating a fungible token on Solana devnet using `@solana/spl-token`
2. **MPL Core NFT** — Minting an NFT using Metaplex Core with the **Attributes plugin**

## Tech Stack
- `@solana/web3.js`
- `@solana/spl-token`
- `@metaplex-foundation/mpl-core`
- `@metaplex-foundation/umi`
- TypeScript + ts-node

---

## Setup

### Prerequisites
- Node.js v18+
- Solana CLI installed

### Install dependencies
```bash
npm install
```

### Generate Wallet & Fund with Devnet SOL
```bash
solana-keygen new --outfile ./wallet.json --no-bip39-passphrase
solana airdrop 2 $(solana-keygen pubkey ./wallet.json)
```

---

## Scripts

### 1. Mint SPL Token
```bash
npx ts-node src/mintSPL.ts
```
- Creates a **Mint account** (the token itself)
- Creates an **Associated Token Account (ATA)** for the wallet
- Mints **1,000,000 tokens** with 9 decimals into the ATA

**Result:**
- Mint Address: `G7Fpoxas6idVmGPwgSXUgtL3hxQWxZddKfTqqZsRgtQh`
- Explorer: https://explorer.solana.com/address/G7Fpoxas6idVmGPwgSXUgtL3hxQWxZddKfTqqZsRgtQh?cluster=devnet

---

### 2. Mint NFT (MPL Core + Attributes Plugin)
```bash
npx ts-node src/mintNFT.ts
```
- Mints an NFT using **Metaplex Core** (`create` from `@metaplex-foundation/mpl-core`)
- Attaches the **Attributes plugin** to store on-chain key-value traits

**Result:**
- NFT Address: `BXcjvAQez6VhkKKCXXCCn3NNhSREMJtfYZUUHmCcPx73`
- Explorer: https://explorer.solana.com/address/BXcjvAQez6VhkKKCXXCCn3NNhSREMJtfYZUUHmCcPx73?cluster=devnet

---

## MPL Core Plugin Used: Attributes
The **Attributes plugin** stores structured on-chain metadata as key-value pairs directly on the NFT asset.

| Key        | Value      |
|------------|------------|
| Background | Blue       |
| Rarity     | Legendary  |
| Level      | 42         |
| Creator    | YourName   |

This avoids off-chain dependency for trait data and makes attributes queryable on-chain.
