Assignment 2 — SPL & NFT (Pre-Builder)

This repo contains templates and scripts to:

- Mint an SPL token (using solana-cli + spl-token)
- Mint an NFT using Metaplex JS (MPL Core) and attach a collection plugin

Prerequisites
- Node.js >=18, npm
- solana-cli and spl-token installed and configured
- devnet SOL for transactions (solana airdrop)

Quick steps
1) Configure Solana to devnet and create/load a keypair:
   solana config set --url https://api.devnet.solana.com
   solana-keygen new --outfile ~/.config/solana/id.json
   export SOLANA_KEYPAIR=~/.config/solana/id.json

2) Airdrop funds (devnet):
   solana airdrop 2 $(solana-keygen pubkey $SOLANA_KEYPAIR)

3) Mint an SPL token (run scripts/spl_mint.sh):
   bash scripts/spl_mint.sh

4) Mint an NFT (TypeScript + Metaplex):
   npm install
   # edit scripts/mint_nft.ts: replace KEYPAIR_PATH and JSON metadata URI
   npm run mint-nft

Notes
- The TS script uses @metaplex-foundation/js to create an NFT on devnet. It demonstrates using a collection plugin by specifying a collection address in the create call; replace with your collection or remove if not using collections.
- Fill in the placeholders in scripts before running.

References
- Metaplex Core plugins: https://www.metaplex.com/docs/smart-contracts/core/plugins
- Solana SPL token CLI: https://spl.solana.com/token

