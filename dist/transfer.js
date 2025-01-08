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
const dev_wallet_json_1 = __importDefault(require("./dev-wallet.json"));
const from = web3_js_1.Keypair.fromSecretKey(new Uint8Array(dev_wallet_json_1.default));
const to = new web3_js_1.PublicKey("CJM2LnrH6byLP2ExkwvZRgTyhAM1xaJffHRS5Q3A68S");
const connection = new web3_js_1.Connection("https://api.devnet.solana.com");
function transact(from, to) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const balance = yield connection.getBalance(from.publicKey);
            const transaction = new web3_js_1.Transaction().add(web3_js_1.SystemProgram.transfer({
                fromPubkey: from.publicKey,
                toPubkey: to,
                lamports: balance
            }));
            transaction.recentBlockhash = (yield connection.getLatestBlockhash('confirmed')).blockhash;
            transaction.feePayer = from.publicKey;
            const fee = (yield connection.getFeeForMessage(transaction.compileMessage(), 'confirmed')).value || 0;
            transaction.instructions.pop();
            transaction.add(web3_js_1.SystemProgram.transfer({
                fromPubkey: from.publicKey,
                toPubkey: to,
                lamports: balance - fee,
            }));
            const signature = yield (0, web3_js_1.sendAndConfirmTransaction)(connection, transaction, [from]);
            const txLink = `https://explorer.solana.com/tx/${signature}?cluster=devnet`;
            console.log(`Success! Check out your TX here: ${txLink}`);
        }
        catch (error) {
            console.error(`Oops, something went wrong: ${error}`);
        }
    });
}
transact(from, to);
