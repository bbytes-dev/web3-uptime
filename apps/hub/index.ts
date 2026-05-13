import { randomUUIDv7, type ServerWebSocket } from "bun";
import { prismaClient } from "db/client";
import nacl from "tweetnacl";
import bs58 from "bs58";
import {
  type IncomingMessage,
  type OutgoingMessage,
  SIGNING_PREFIX,
  type SignupIncomingMessage,
  WebsiteStatus,
  getLocationFromIP,
} from "common";
import nacl_util from "tweetnacl-util";

const PORT = Number(process.env.HUB_PORT) || 8081;

console.log(`Starting Hub on port ${PORT}`);

const availableValidators: {
  validatorId: string;
  socket: ServerWebSocket<unknown>;
  publicKey: string;
}[] = [];

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

async function handleSignup(
  ws: ServerWebSocket<any>,
  data: SignupIncomingMessage,
) {
  const { publicKey, ip, signedMessage, callbackId } = data;

  try {
    const validatorDb = await prismaClient.validator.findFirst({
      where: { publicKey },
    });

    if (validatorDb) {
      ws.send(
        JSON.stringify({
          type: "signup",
          data: {
            validatorId: validatorDb.id,
            callbackId,
          },
        }),
      );

      availableValidators.push({
        validatorId: validatorDb.id,
        socket: ws,
        publicKey,
      });
      return;
    }

    const location = await getLocationFromIP(ip);

    const validator = await prismaClient.validator.create({
      data: {
        publicKey,
        ipAddress: ip,
        location,
        isActive: true,
      },
    });

    ws.send(
      JSON.stringify({
        type: "signup",
        data: {
          validatorId: validator.id,
          callbackId,
        },
      }),
    );

    availableValidators.push({
      validatorId: validator.id,
      socket: ws,
      publicKey: validator.publicKey,
    });
  } catch (err) {
    console.error("Signup failed:", err);
  }
}

function verifyMessage(message: string, publicKey: string, signature: string) {
  const messageBytes = nacl_util.decodeUTF8(message);
  const publicKeyBytes = nacl_util.decodeBase64(publicKey);
  const signatureBytes = new Uint8Array(JSON.parse(signature));

  return nacl.sign.detached.verify(
    messageBytes,
    signatureBytes,
    publicKeyBytes,
  );
}
