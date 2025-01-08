"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const web3_js_1 = require("@solana/web3.js");
const anchor_1 = require("@coral-xyz/anchor");
const Turbin3_prereq_1 = require("./programs/Turbin3-prereq");
const Turbin3_wallet_json_1 = __importDefault(require("./Turbin3-wallet.json"));
const keypair = web3_js_1.Keypair.fromSecretKey(new Uint8Array(Turbin3_wallet_json_1.default));
const github = Buffer.from("rauberJv", "utf8");
const connection = new web3_js_1.Connection("https://api.devnet.solana.com");
const provider = new anchor_1.AnchorProvider(connection, new anchor_1.Wallet(keypair), {
    commitment: "confirmed"
});
const program = new anchor_1.Program(Turbin3_prereq_1.IDL, provider);
const enrollment_seeds = [Buffer.from("prereq"), keypair.publicKey.toBuffer()];
const [enrollment_key, _bump] = web3_js_1.PublicKey.findProgramAddressSync(enrollment_seeds, program.programId);
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const txhash = yield program.methods.complete(github)
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
    }
    catch (error) {
        console.error(`Ooops, something went wrong: ${error}`);
    }
}));
