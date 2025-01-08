import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import { Program, Wallet, AnchorProvider } from "@coral-xyz/anchor";
import { Turbin3Prereq } from "./programs/wba_prereq";
import idl from "./programs/wba_prereq.json"
import wallet from "./Turbin3-wallet.json";

const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

const github = Buffer.from("rauberJv", "utf8");

const connection = new Connection("https://api.devnet.solana.com");

const provider = new AnchorProvider(connection, new Wallet(keypair), {
    commitment: "confirmed"
});
const idl_string = JSON.stringify(idl);
const idl_object = JSON.parse(idl_string);

const program = new Program<Turbin3Prereq>(idl_object, provider);

const enrollment_seeds = [Buffer.from("prereq"), keypair.publicKey.toBuffer()];
const [enrollment_key, _bump] = PublicKey.findProgramAddressSync(enrollment_seeds, program.programId);

(async () => {
    try {
        const txhash = await program.methods.complete(github)
        .accounts({
            signer: keypair.publicKey,
            // @ts-ignore
            prereq: enrollment_key,
        })
            .signers([
                keypair
            ])
            .rpc();
        const txLink = `https://explorer.solana.com/tx/${txhash}?cluster=devnet`;
        console.log(`Success! Check out your TX here: ${txLink}`);
    } catch (error) {
        console.error(`Ooops, something went wrong: ${error}`);
    }
})()