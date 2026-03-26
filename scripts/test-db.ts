import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

async function main() {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
    max: 1,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 30000,
  });

  const prisma = new PrismaClient({ adapter });

  // Neon serverless computes suspend after inactivity — retry on cold start timeout
  async function withRetry<T>(fn: () => Promise<T>, retries = 3): Promise<T> {
    for (let i = 1; i <= retries; i++) {
      try {
        return await fn();
      } catch (err: unknown) {
        const isTimeout = err instanceof Error && err.message.includes("ETIMEDOUT");
        if (isTimeout && i < retries) {
          console.log(`  ⏳ Cold start detected, retrying (${i}/${retries - 1})...`);
          await new Promise((r) => setTimeout(r, 3000));
          continue;
        }
        throw err;
      }
    }
    throw new Error("Unreachable");
  }

  try {
    console.log("🔌 Connecting to database...");

    // Count rows in each table (sequential to avoid exhausting Neon's serverless pool)
    const userCount = await withRetry(() => prisma.user.count());
    console.log("✅ Connected successfully!\n");

    console.log("📊 Table counts:");
    console.log(`  Users:       ${userCount}`);
    console.log(`  Item Types:  ${await prisma.itemType.count()}`);
    console.log(`  Collections: ${await prisma.collection.count()}`);
    console.log(`  Items:       ${await prisma.item.count()}`);
    console.log(`  Tags:        ${await prisma.tag.count()}`);

    console.log("\n✅ Database test passed.");
  } catch (error) {
    console.error("❌ Database test failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
