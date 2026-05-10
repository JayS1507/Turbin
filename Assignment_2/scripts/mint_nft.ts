import fs from 'fs';
import { readFile } from 'fs/promises';
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { Metaplex, keypairIdentity, mockStorage } from '@metaplex-foundation/js';

// Uses local metadata files in ./metadata/
const KEYPAIR_PATH = process.env.SOLANA_KEYPAIR || `${process.cwd()}/wallet.json`;
const RPC = 'https://api.devnet.solana.com';
const METADATA_FILE = './metadata/sample-metadata.json';
const COLLECTION_METADATA_FILE = './metadata/sample-metadata.json'; // reuse same for collection

async function loadKeypair(path: string) {
  if (!fs.existsSync(path)) throw new Error('Keypair not found: ' + path);
  const raw = JSON.parse(fs.readFileSync(path, 'utf8'));
  return Keypair.fromSecretKey(Uint8Array.from(raw));
}

async function main() {
  const payer = await loadKeypair(KEYPAIR_PATH);
  const connection = new Connection(RPC, 'confirmed');
  const metaplex = Metaplex.make(connection).use(keypairIdentity(payer)).use(mockStorage());

  console.log('Payer:', payer.publicKey.toBase58());

  // Upload collection metadata and create a collection NFT
  console.log('Uploading collection metadata...');
  const collectionMetadata = JSON.parse(await readFile(COLLECTION_METADATA_FILE, 'utf8'));
  const collectionUri = await metaplex.storage().upload(collectionMetadata);
  console.log('Collection metadata uploaded to:', collectionUri);

  console.log('Creating collection NFT...');
  const { nft: collectionNft } = await metaplex.nfts().create({
    uri: collectionUri,
    name: (collectionMetadata.name || 'Assignment2 Collection'),
    sellerFeeBasisPoints: collectionMetadata.seller_fee_basis_points || 0,
  });
  console.log('Collection NFT mint:', collectionNft.address.toBase58());

  // Upload item metadata
  console.log('Uploading item metadata...');
  const itemMetadata = JSON.parse(await readFile(METADATA_FILE, 'utf8'));
  itemMetadata.collection = { name: collectionMetadata.name || 'Assignment2 Collection' };
  const itemUri = await metaplex.storage().upload(itemMetadata);
  console.log('Item metadata uploaded to:', itemUri);

  // Create NFT and link to collection
  console.log('Creating NFT linked to collection (will attempt to set collection)...');
  const { nft } = await metaplex.nfts().create({
    uri: itemUri,
    name: itemMetadata.name || 'Assignment2 Item',
    sellerFeeBasisPoints: itemMetadata.seller_fee_basis_points || 0,
    collection: { address: collectionNft.address, verified: false },
  });

  console.log('NFT created:', nft.address.toBase58());
  console.log('NFT metadata URI:', nft.jsonUri);

  try {
    await metaplex.nfts().verifyCollection({ mintAddress: nft.address, collectionMintAddress: collectionNft.address });
    console.log('Collection verified on-chain for NFT');
  } catch (err: any) {
    console.warn('Could not verify collection automatically:', err.message || err);
    console.log('You may need to run a separate collection verification step using the collection authority.');
  }
}

main().catch((err) => { console.error(err); process.exit(1); });
