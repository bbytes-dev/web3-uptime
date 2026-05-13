import { Keypair } from "@solana/web3.js";
import { WebSocket } from "ws";
import nacl from "tweetnacl";
import chalk from "chalk";
import ora from "ora";
import boxen from "boxen";
import net from "net";
import { 
  type ValidateOutgoingMessage, 
  type SignupIncomingMessage, 
} from "common";

// --- CONFIGURATION ---
const HUB_URL = process.env.HUB_URL || "ws://localhost:8080";
const PRIVATE_KEY_STR = process.env.PRIVATE_KEY;

let keypair: Keypair;
let validatorId: string | null = null;
let checksPerformed = 0;
let totalEarnings = 0;
let heartbeatTimer: NodeJS.Timeout;

// --- INITIALIZATION ---
async function init() {
  console.clear();
  console.log(
    boxen(
      `${chalk.cyan.bold("WEB3 UPTIME")}\n${chalk.white("Professional Validator Agent v1.1.0")}\n\n${chalk.gray("Decentralized Network Health Infrastructure")}`,
      {
        padding: 1,
        margin: 1,
        borderStyle: "double",
        borderColor: "cyan",
        textAlignment: "center",
      }
    )
  );

  const spinner = ora("Booting validator engine...").start();

  try {
    if (!PRIVATE_KEY_STR) {
      spinner.fail(chalk.red("Configuration Error"));
      console.log(chalk.yellow("\nMissing PRIVATE_KEY in environment."));
      console.log(chalk.gray("Please add your Solana private key array to .env:\n"));
      console.log(chalk.white("PRIVATE_KEY=[1,2,3...]\n"));
      process.exit(1);
    }

    const secretKey = new Uint8Array(JSON.parse(PRIVATE_KEY_STR));
    keypair = Keypair.fromSecretKey(secretKey);
    
    spinner.succeed(chalk.green("Validator Engine Ready"));
    console.log(`${chalk.cyan("▶ Public Key:")} ${chalk.white(keypair.publicKey.toBase58())}`);
    console.log(`${chalk.cyan("▶ Hub URL:")}    ${chalk.white(HUB_URL)}\n`);

    connectToHub();
  } catch (err) {
    spinner.fail(chalk.red("Engine Initialization Failed"));
    console.error(err);
    process.exit(1);
  }
}

// --- NETWORK LOGIC ---
function connectToHub() {
  const spinner = ora(chalk.gray("Connecting to Hub...")).start();
  const ws = new WebSocket(HUB_URL);

  ws.on("open", async () => {
    spinner.succeed(chalk.green("Active on Network"));
    
    // Auto-detect IP/Location
    let ip = "unknown";
    try {
      const ipRes = await fetch("https://api.ipify.org?format=json");
      const ipData: any = await ipRes.json();
      ip = ipData.ip;
    } catch {}

    // Register node with cryptographic proof
    const signupData: SignupIncomingMessage = {
      type: "signup",
      publicKey: keypair.publicKey.toBase58(),
      ip: ip,
      signedMessage: await signMessage(keypair.publicKey.toBase58(), keypair),
      callbackId: `reg_${Date.now()}`,
    };
    ws.send(JSON.stringify(signupData));

    // Start Heartbeat
    if (heartbeatTimer) clearInterval(heartbeatTimer);
    heartbeatTimer = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.ping();
      }
    }, 30000);
  });

  ws.on("message", (data: string) => {
    try {
      const payload = JSON.parse(data);
      handleHubMessage(ws, payload);
    } catch (err) {
      // Ignore non-json
    }
  });

  ws.on("close", () => {
    console.log(chalk.yellow("\n⚠ Connection dropped. Attempting recovery..."));
    setTimeout(connectToHub, 5000);
  });
}

async function handleHubMessage(ws: WebSocket, payload: any) {
  if (payload.type === "signup") {
    validatorId = payload.data.validatorId;
    console.log(chalk.green(`\n✔ Registration Confirmed | Node ID: ${chalk.white(validatorId.slice(0, 8))}`));
    console.log(chalk.gray("--------------------------------------------------"));
    console.log(chalk.cyan("Listening for incoming validation tasks...\n"));
  } else if (payload.type === "validate") {
    await performValidationTask(ws, payload.data);
  }
}

async function performValidationTask(ws: WebSocket, data: ValidateOutgoingMessage) {
  const { url, callbackId, websiteId } = data;
  const checkSpinner = ora(`${chalk.gray("Validating")} ${chalk.white(url)}`).start();
  
  const signature = await signMessage(`Replying to ${callbackId}`, keypair);

  try {
    // Pro Feature: Measure pure TCP latency instead of high-level fetch
    const { latency, status } = await measureAccuracy(url);

    const isGood = status >= 200 && status < 300;
    
    ws.send(
      JSON.stringify({
        type: "validate",
        data: {
          callbackId,
          status: isGood ? "Good" : "Bad",
          latency,
          websiteId,
          validatorId,
          signedMessage: signature,
        },
      })
    );

    checksPerformed++;
    totalEarnings += 0.0001;

    if (isGood) {
      checkSpinner.succeed(`${chalk.green("UP")}   | ${chalk.white(url.padEnd(30))} | ${chalk.cyan(latency + "ms")}`);
    } else {
      checkSpinner.fail(`${chalk.red("DOWN")} | ${chalk.white(url.padEnd(30))} | ${chalk.red("Err: " + status)}`);
    }

    updateLiveDashboard();
  } catch (err) {
    checkSpinner.fail(chalk.red(`System error during validation: ${url}`));
  }
}

async function measureAccuracy(targetUrl: string): Promise<{ latency: number; status: number }> {
  const startTime = Date.now();
  try {
    const url = new URL(targetUrl);
    const port = url.port || (url.protocol === "https:" ? 443 : 80);
    
    // 1. First measure raw TCP handshake latency (Industry Standard)
    await new Promise((resolve, reject) => {
      const socket = net.connect(Number(port), url.hostname, () => {
        socket.end();
        resolve(true);
      });
      socket.setTimeout(3000);
      socket.on("timeout", () => { socket.destroy(); reject(new Error("timeout")); });
      socket.on("error", reject);
    });

    const tcpLatency = Date.now() - startTime;

    // 2. Then check HTTP status for sanity
    const res = await fetch(targetUrl, { signal: AbortSignal.timeout(3000) });
    return { latency: tcpLatency, status: res.status };
  } catch (err) {
    return { latency: Date.now() - startTime, status: 0 };
  }
}

function updateLiveDashboard() {
  process.stdout.write(
    `\r${chalk.cyan.bold("STATS:")} ${chalk.white(checksPerformed)} validations | ${chalk.yellow(totalEarnings.toFixed(4) + " SOL")} earned | ${chalk.green("Status: Active")}`
  );
}

async function signMessage(message: string, keypair: Keypair) {
  const encoder = new TextEncoder();
  const messageBytes = encoder.encode(message);
  const signature = nacl.sign.detached(messageBytes, keypair.secretKey);
  return Buffer.from(signature).toString("base64");
}

process.on("SIGINT", () => {
  console.log(chalk.yellow("\n\nDisconnecting from network..."));
  process.exit();
});

init();
