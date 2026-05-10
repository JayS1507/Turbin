#!/bin/bash
set -euo pipefail

# Usage: bash scripts/spl_mint.sh
# Requires: solana-cli, spl-token, SOL in wallet (devnet)

# Ensure devnet
solana config set --url https://api.devnet.solana.com

# Ensure keypair env or default
KEYPAIR=${SOLANA_KEYPAIR:-~/.config/solana/id.json}
echo "Using keypair: $KEYPAIR"

# show balance
solana balance --keypair $KEYPAIR

# Create new mint (prints mint address)
MINT=$(spl-token create-token --owner $KEYPAIR | awk '/Creating token/ {print $3}' | tr -d '\r')
if [ -z "$MINT" ]; then
  echo "Could not parse mint address. Run spl-token create-token manually to debug." && exit 1
fi

# Create token account for owner
RECIPIENT=$(solana-keygen pubkey $KEYPAIR)
TOKEN_ACCOUNT=$(spl-token create-account $MINT --owner $KEYPAIR | awk '/Creating account/ {print $3}' | tr -d '\r')

# Mint some tokens to owner
spl-token mint $MINT 1000 $TOKEN_ACCOUNT --owner $KEYPAIR

echo "Mint created: $MINT"
echo "Token account: $TOKEN_ACCOUNT"

# Print supply
spl-token supply $MINT
