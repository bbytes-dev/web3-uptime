import { randomUUIDv7, type ServerWebSocket } from "bun";
import { prismaClient } from "db/client";
import nacl from "tweetnacl";
import bs58 from "bs58";
import {
  type IncomingMessage,
  type OutgoingMessage,
  SIGNING_PREFIX,
  WebsiteStatus,
} from "common";
import nacl_util from "tweetnacl-util";

const PORT = Number(process.env.HUB_PORT) || 8081;

console.log(`Starting Hub on port ${PORT}`);

Bun.serve({
  port: PORT,
  async fetch(req, server) {
    if (server.upgrade(req)) {
      return;
    }
    return new Response("Web3 Uptime Hub - Use WebSocket", { status: 426 });
  },
  websocket: {
    async message(ws: ServerWebSocket, message: string) {
      try {
        const payload: IncomingMessage = JSON.parse(message.toString());

        if (payload.type === "signup") {
          const verified = await verifyMessage(
            `Signed message for ${payload.data.callbackId}, ${payload.data.publicKey}`,
            payload.data.publicKey,
            payload.data.signedMessage,
          );
          console.log("verification started ----");
          if (verified) {
            await handleSignup(ws, payload.data);
          }
        } else if (payload.type === "validate") {
          //   await handleValidate(ws, payload.data);
        }
      } catch (err) {
        console.error("Hub Error:", err);
      }
    },
    close(ws) {
      console.log("🔌 Validator disconnected");
    },
  },
});

async function handleSignup(ws: ServerWebSocket<any>, data: any) {
  const { publicKey, ip, signedMessage, callbackId } = data;

  try {
    // Verify signature
    // Message signed: "web3-uptime-validate:<callbackId>"
    const message = new TextEncoder().encode(`${SIGNING_PREFIX}${callbackId}`);
    const signature = bs58.decode(signedMessage);
    const pubKeyBytes = bs58.decode(publicKey);

    const isValid = nacl.sign.detached.verify(message, signature, pubKeyBytes);

    if (!isValid) {
      console.warn(`Invalid signup signature from ${publicKey}`);
      return;
    }

    // Create or update validator in DB
    const validator = await prismaClient.validator.upsert({
      where: { publicKey },
      update: { ipAddress: ip, isActive: true },
      create: {
        publicKey,
        ipAddress: ip,
        location: "Auto-detected", // In a real app, use GeoIP
        isActive: true,
        pendingPayouts: 0,
      },
    });

    console.log(`Validator registered: ${publicKey.slice(0, 8)}...`);

    const response: OutgoingMessage = {
      type: "signup",
      data: {
        validatorId: validator.id,
        callbackId,
      },
    };

    ws.send(JSON.stringify(response));
  } catch (err) {
    console.error("Signup failed:", err);
  }
}

function verifyMessage(
  message: string,
  publicKey: string,
  signature: string,
) {
  const messageBytes = nacl_util.decodeUTF8(message);
  const publicKeyBytes = nacl_util.decodeBase64(publicKey);
  const signatureBytes = new Uint8Array(JSON.parse(signature));

  return nacl.sign.detached.verify(
    messageBytes,
    signatureBytes,
    publicKeyBytes,
  );
}
