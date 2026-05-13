import { randomUUIDv7, type ServerWebSocket } from "bun";
import { prismaClient } from "db/client";
import nacl from "tweetnacl";
import { PublicKey } from "@solana/web3.js";
import bs58 from "bs58";
import {
  type IncomingMessage,
  type SignupIncomingMessage,
  WebsiteStatus,
  getLocationFromIP,
} from "common";
import nacl_util from "tweetnacl-util";

const COST_PER_VALIDATION = 1;

const CALLBACKS: {
  [callbackId: string]: (data: IncomingMessage) => void;
} = {};

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
          const callbackId = payload.data.callbackId;
          if (CALLBACKS[callbackId]) {
            CALLBACKS[callbackId](payload);
            delete CALLBACKS[callbackId];
          }
        }
      } catch (err) {
        console.error("Hub Error:", err);
      }
    },
    close(ws) {
      const index = availableValidators.findIndex((v) => v.socket === ws);
      if (index !== -1) {
        const v = availableValidators[index];
        console.log(`🔌 Validator disconnected: ${v?.validatorId}`);
        availableValidators.splice(index, 1);
      }
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
  const publicKeyBytes = bs58.decode(publicKey);
  const signatureBytes = new Uint8Array(JSON.parse(signature));

  return nacl.sign.detached.verify(
    messageBytes,
    signatureBytes,
    publicKeyBytes,
  );
}

setInterval(async () => {
  const websitesToMonitor = await prismaClient.website.findMany({
    where: {
      disabled: false,
    },
  });

  for (const website of websitesToMonitor) {
    availableValidators.forEach((validator) => {
      const callbackId = randomUUIDv7();
      console.log(
        `Sending validate to ${validator.validatorId} ${website.url}`,
      );
      validator.socket.send(
        JSON.stringify({
          type: "validate",
          data: {
            url: website.url,
            callbackId,
            websiteId: website.id,
          },
        }),
      );

      CALLBACKS[callbackId] = async (data: IncomingMessage) => {
        if (data.type === "validate") {
          const { validatorId, status, latency, signedMessage } = data.data;
          const verified = await verifyMessage(
            `Replying to ${callbackId}`,
            validator.publicKey,
            signedMessage,
          );
          if (!verified) {
            return;
          }

          await prismaClient.$transaction(async (tx) => {
            await tx.webSiteUptimeStatus.create({
              data: {
                websiteId: website.id,
                validatorId,
                status: status as WebsiteStatus,
                latency,
                createdAt: new Date(),
              },
            });

            await tx.validator.update({
              where: { id: validatorId },
              data: {
                pendingPayouts: { increment: COST_PER_VALIDATION },
              },
            });
          });
        }
      };
    });
  }
}, 60 * 1000);
