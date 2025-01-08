"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const web3_js_1 = require("@solana/web3.js");
let kp = web3_js_1.Keypair.generate();
console.log(`You have generated a new Solana Wallet: ${kp.publicKey.toBase58()}`);
console.log(`[${kp.secretKey}]`);
