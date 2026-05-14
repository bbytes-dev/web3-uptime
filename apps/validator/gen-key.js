const { Keypair } = require("@solana/web3.js");
const fs = require("fs");
const kp = Keypair.generate();
fs.writeFileSync("key.txt", JSON.stringify(Array.from(kp.secretKey)));
