import { Connection, Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js"
import wallet from "./dev-wallet.json";

const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

const connection = new Connection("https://api.devnet.solana.com");


async function airdropTokens(amount: number, wallet: Keypair): Promise<void> {
    try {
        const txhash = await connection.requestAirdrop(wallet.publicKey, amount * LAMPORTS_PER_SOL);
        const txLink = `https://explorer.solana.com/tx/${txhash}?cluster=devnet`;
        console.log(`Success! Check out your TX here: ${txLink}`);
    } catch (error) {
        console.error(`Oops, something went wrong: ${error}`);
    }
}

airdropTokens(2, keypair);