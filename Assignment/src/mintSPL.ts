import {
  Connection,
  Keypair,
  PublicKey,
  clusterApiUrl,
} from "@solana/web3.js";
import {
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
  getAccount,
} from "@solana/spl-token";
import * as fs from "fs";

async function mintSPLToken() {
  // 1. Load wallet
  const secretKey = Uint8Array.from(
    JSON.parse(fs.readFileSync("./wallet.json", "utf-8"))
  );
  const payer = Keypair.fromSecretKey(secretKey);

  // 2. Connect to devnet
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  console.log("✅ Connected to Devnet");
  console.log("👛 Wallet:", payer.publicKey.toBase58());

  // 3. Create the Mint (the token itself)
  const mint = await createMint(
    connection,
    payer,           // payer of transaction fees
    payer.publicKey, // mint authority
    payer.publicKey, // freeze authority
    9                // decimals (like SOL uses 9)
  );
  console.log("🪙 Mint Address:", mint.toBase58());

  // 4. Create an Associated Token Account (ATA) to hold the tokens
  const tokenAccount = await getOrCreateAssociatedTokenAccount(
    connection,
    payer,
    mint,
    payer.publicKey
  );
  console.log("📦 Token Account:", tokenAccount.address.toBase58());

  // 5. Mint 1,000,000 tokens into the ATA
  const AMOUNT = 1_000_000 * 10 ** 9; // 1 million tokens with 9 decimals
  await mintTo(
    connection,
    payer,
    mint,
    tokenAccount.address,
    payer.publicKey,
    AMOUNT
  );
  console.log(`✅ Minted 1,000,000 tokens!`);

  // 6. Verify
  const accountInfo = await getAccount(connection, tokenAccount.address);
  console.log(
    "💰 Token Balance:",
    Number(accountInfo.amount) / 10 ** 9,
    "tokens"
  );

  console.log("\n🔗 View on Explorer:");
  console.log(
    `https://explorer.solana.com/address/${mint.toBase58()}?cluster=devnet`
  );
}

mintSPLToken().catch(console.error);
