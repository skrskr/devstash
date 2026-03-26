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
        const code = (err as { code?: string })?.code;
        const isTimeout = code === "ETIMEDOUT" || (err instanceof Error && err.message.includes("ETIMEDOUT"));
        if (isTimeout && i < retries) {
          console.log(`  ⏳ Cold start detected, retrying (${i}/${retries - 1})...`);
          await new Promise((r) => setTimeout(r, 5000));
          continue;
        }
        throw err;
      }
    }
    throw new Error("Unreachable");
  }

  try {
    console.log("🔌 Connecting to database...\n");

    // ── Users ──────────────────────────────────────────────────────────────────
    const users = await withRetry(() =>
      prisma.user.findMany({ select: { email: true, name: true, isPro: true, emailVerified: true } })
    );
    console.log(`👤 Users (${users.length}):`);
    for (const u of users) {
      console.log(`   ${u.email} — ${u.name} | pro=${u.isPro} | verified=${!!u.emailVerified}`);
    }

    // ── Item Types ─────────────────────────────────────────────────────────────
    const types = await prisma.itemType.findMany({ orderBy: { name: "asc" } });
    console.log(`\n🏷  Item Types (${types.length}):`);
    for (const t of types) {
      console.log(`   ${t.name.padEnd(10)} icon=${t.icon}  color=${t.color}  system=${t.isSystem}`);
    }

    // ── Collections ────────────────────────────────────────────────────────────
    const collections = await prisma.collection.findMany({
      include: { _count: { select: { items: true } } },
      orderBy: { name: "asc" },
    });
    console.log(`\n📁 Collections (${collections.length}):`);
    for (const c of collections) {
      console.log(`   ${c.name.padEnd(22)} items=${c._count.items}  fav=${c.isFavorite}`);
    }

    // ── Items ──────────────────────────────────────────────────────────────────
    const items = await prisma.item.findMany({
      include: { type: true, tags: { include: { tag: true } } },
      orderBy: { createdAt: "asc" },
    });
    console.log(`\n📄 Items (${items.length}):`);
    for (const item of items) {
      const tagNames = item.tags.map((t) => t.tag.name).join(", ");
      console.log(`   [${item.type.name.padEnd(8)}] ${item.title}`);
      if (tagNames) console.log(`              tags: ${tagNames}`);
    }

    // ── Tags ───────────────────────────────────────────────────────────────────
    const tags = await prisma.tag.findMany({ orderBy: { name: "asc" } });
    console.log(`\n🔖 Tags (${tags.length}): ${tags.map((t) => t.name).join(", ")}`);

    console.log("\n✅ Database test passed.");
  } catch (error) {
    console.error("❌ Database test failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
