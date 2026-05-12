import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const connectionString = "postgres://postgres:postgres@localhost:51214/template1?sslmode=disable";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

async function main() {
  console.log("🌱 Seeding database...\n");

  // Clean existing data (in reverse dependency order)
  await prisma.webSiteUptimeStatus.deleteMany();
  await prisma.website.deleteMany();
  await prisma.validator.deleteMany();
  await prisma.user.deleteMany();
  console.log("✓ Cleared existing data");

  // Your actual Clerk user ID
  const BHARATH_CLERK_ID = "user_3DaBHDXXO6aE8qmpvT1h5Q5ocLm";

  // ── 1. Create Users ──
  const user1 = await prisma.user.create({
    data: { email: "bharath@web3uptime.com" },
  });
  console.log(`✓ Created user: ${user1.id}`);

  // ── 2. Create Websites (linked to your Clerk user ID) ──
  const websites = await Promise.all([
    prisma.website.create({
      data: { url: "https://ethereum-rpc.example.com", userId: BHARATH_CLERK_ID },
    }),
    prisma.website.create({
      data: { url: "https://polygon-rpc.example.com", userId: BHARATH_CLERK_ID },
    }),
    prisma.website.create({
      data: { url: "https://solana-rpc.example.com", userId: BHARATH_CLERK_ID },
    }),
    prisma.website.create({
      data: { url: "https://api.uniswap.org", userId: BHARATH_CLERK_ID },
    }),
    prisma.website.create({
      data: { url: "https://api.aave.com", userId: BHARATH_CLERK_ID },
    }),
    // One disabled website
    prisma.website.create({
      data: {
        url: "https://deprecated-node.example.com",
        userId: BHARATH_CLERK_ID,
        disabled: true,
      },
    }),
  ]);
  console.log(`✓ Created ${websites.length} websites for user ${BHARATH_CLERK_ID}`);

  // ── 3. Create Validators ──
  const validators = await Promise.all([
    prisma.validator.create({
      data: {
        publicKey: "val_us_east_0x1a2b3c4d5e6f7890abcdef1234567890abcdef12",
        ipAddress: "54.210.123.45",
        location: "US-East (Virginia)",
      },
    }),
    prisma.validator.create({
      data: {
        publicKey: "val_eu_west_0x2b3c4d5e6f7890abcdef1234567890abcdef1234",
        ipAddress: "52.48.67.89",
        location: "EU-West (Ireland)",
      },
    }),
    prisma.validator.create({
      data: {
        publicKey: "val_ap_south_0x3c4d5e6f7890abcdef1234567890abcdef123456",
        ipAddress: "13.234.56.78",
        location: "AP-South (Mumbai)",
      },
    }),
    prisma.validator.create({
      data: {
        publicKey: "val_ap_east_0x4d5e6f7890abcdef1234567890abcdef12345678",
        ipAddress: "18.162.34.56",
        location: "AP-East (Tokyo)",
        isActive: false,
      },
    }),
  ]);
  console.log(`✓ Created ${validators.length} validators`);

  // ── 4. Create Uptime Ticks (WebSiteUptimeStatus) ──
  const activeWebsites = websites.filter((w) => !w.disabled);
  const activeValidators = validators.filter((v) => v.isActive);
  const now = new Date();
  let tickCount = 0;

  for (const website of activeWebsites) {
    for (let i = 30; i >= 0; i--) {
      const validator =
        activeValidators[Math.floor(Math.random() * activeValidators.length)]!;
      const tickTime = new Date(now.getTime() - i * 60 * 1000);

      // Realistic failure rates
      let status: "Good" | "Bad" = "Good";
      if (website.url.includes("solana")) {
        status = Math.random() < 0.15 ? "Bad" : "Good";
      } else if (website.url.includes("ethereum")) {
        status = Math.random() < 0.03 ? "Bad" : "Good";
      }

      await prisma.webSiteUptimeStatus.create({
        data: {
          websiteId: website.id,
          validatorId: validator.id,
          status,
          createdAt: tickTime,
        },
      });
      tickCount++;
    }
  }
  console.log(`✓ Created ${tickCount} uptime ticks\n`);

  // ── Summary ──
  console.log("📊 Seed Summary:");
  console.log(`   Users:      ${await prisma.user.count()}`);
  console.log(`   Websites:   ${await prisma.website.count()} (${await prisma.website.count({ where: { disabled: true } })} disabled)`);
  console.log(`   Validators: ${await prisma.validator.count()} (${await prisma.validator.count({ where: { isActive: false } })} inactive)`);
  console.log(`   Ticks:      ${await prisma.webSiteUptimeStatus.count()}`);
  console.log("\n✅ Seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
