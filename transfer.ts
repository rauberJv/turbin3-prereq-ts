import { Transaction, SystemProgram, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, sendAndConfirmTransaction } from "@solana/web3.js";
import wallet from "./dev-wallet.json";

const from = Keypair.fromSecretKey(new Uint8Array(wallet));

const to = new PublicKey("CJM2LnrH6byLP2ExkwvZRgTyhAM1xaJffHRS5Q3A68S");

const connection = new Connection("https://api.devnet.solana.com");

async function transact(from: Keypair, to: PublicKey): Promise<void> {
    try {
        const balance = await connection.getBalance(from.publicKey);

        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: from.publicKey,
                toPubkey: to,
                lamports: balance
            })
        );

        transaction.recentBlockhash = (await connection.getLatestBlockhash('confirmed')).blockhash;
        transaction.feePayer = from.publicKey;

        const fee = (await connection.getFeeForMessage(transaction.compileMessage(), 'confirmed')).value || 0;

        transaction.instructions.pop();

        transaction.add(
            SystemProgram.transfer({
                fromPubkey: from.publicKey,
                toPubkey: to,
                lamports: balance - fee,
            }),
        );

        const signature = await sendAndConfirmTransaction(
            connection,
            transaction,
            [from],
        );
        const txLink = `https://explorer.solana.com/tx/${signature}?cluster=devnet`;

        console.log(`Success! Check out your TX here: ${txLink}`)
    } catch (error) {
        console.error(`Oops, something went wrong: ${error}`);
    }
}

transact(from, to);