import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  keypairIdentity,
  generateSigner,
} from "@metaplex-foundation/umi";
import {
  mplCore,
  create,
  fetchAsset,
} from "@metaplex-foundation/mpl-core";
import * as fs from "fs";

async function mintNFT() {
  // 1. Load wallet
  const secretKey = Uint8Array.from(
    JSON.parse(fs.readFileSync("./wallet.json", "utf-8"))
  );

  // 2. Create Umi instance with finalized commitment
  const umi = createUmi("https://api.devnet.solana.com", {
    commitment: "finalized",
  }).use(mplCore());

  const umiKeypair = umi.eddsa.createKeypairFromSecretKey(secretKey);
  umi.use(keypairIdentity(umiKeypair));

  console.log("👛 Wallet:", umiKeypair.publicKey);

  // 3. Generate NFT asset keypair
  const asset = generateSigner(umi);
  console.log("🎨 NFT Asset Address:", asset.publicKey);

  // 4. Mint NFT with Attributes plugin
  //    `create` uses pluginAuthorityPairV2 internally:
  //    { type, ...pluginFields } — attributeList goes at top level, no 'data' wrapper
  const result = await create(umi, {
    asset,
    name: "My Core NFT",
    uri: "https://arweave.net/abc123",
    plugins: [
      {
        type: "Attributes",
        attributeList: [
          { key: "Background", value: "Blue" },
          { key: "Rarity",     value: "Legendary" },
          { key: "Level",      value: "42" },
          { key: "Creator",    value: "YourName" },
        ],
      },
    ],
  }).sendAndConfirm(umi, { confirm: { commitment: "finalized" } });

  console.log("✅ NFT Minted!");
  console.log("📝 Signature:", Buffer.from(result.signature).toString("base64"));

  // 5. Fetch NFT — finalized commitment guarantees it exists
  console.log("⏳ Fetching asset...");
  const assetData = await fetchAsset(umi, asset.publicKey);

  console.log("\n📋 NFT Details:");
  console.log("  Name:  ", assetData.name);
  console.log("  URI:   ", assetData.uri);
  console.log("  Owner: ", assetData.owner);

  console.log("\n🔗 View on Explorer:");
  console.log(
    `https://explorer.solana.com/address/${asset.publicKey}?cluster=devnet`
  );
}

mintNFT().catch(console.error);
