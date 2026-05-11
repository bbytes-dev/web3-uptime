import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const connectionString = process.env.DATABASE_URL ?? "postgres://postgres:postgres@localhost:51214/template1";

export const prismaClient = new PrismaClient({
  adapter: new PrismaPg({ connectionString })
});