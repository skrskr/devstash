import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
  max: 1,
  connectionTimeoutMillis: 30000,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...\n");

  // ── User ────────────────────────────────────────────────────────────────────
  const passwordHash = await bcrypt.hash("12345678", 12);

  const user = await prisma.user.upsert({
    where: { email: "demo@devstash.io" },
    update: {},
    create: {
      email: "demo@devstash.io",
      name: "Demo User",
      password: passwordHash,
      isPro: false,
      emailVerified: new Date(),
    },
  });
  console.log(`✅ User: ${user.email}`);

  // ── System Item Types ────────────────────────────────────────────────────────
  const typeData = [
    { name: "Snippet", icon: "Code",       color: "#3b82f6" },
    { name: "Prompt",  icon: "Sparkles",   color: "#8b5cf6" },
    { name: "Command", icon: "Terminal",   color: "#f97316" },
    { name: "Note",    icon: "StickyNote", color: "#fde047" },
    { name: "File",    icon: "File",       color: "#6b7280" },
    { name: "Image",   icon: "Image",      color: "#ec4899" },
    { name: "Link",    icon: "Link",       color: "#10b981" },
  ];

  const types: Record<string, string> = {};
  for (const t of typeData) {
    const existing = await prisma.itemType.findFirst({
      where: { name: t.name, isSystem: true },
    });
    const itemType = existing ?? await prisma.itemType.create({
      data: { ...t, isSystem: true, userId: null },
    });
    types[t.name.toLowerCase()] = itemType.id;
  }
  console.log(`✅ Item types: ${Object.keys(types).join(", ")}`);

  // ── Helper to upsert a tag ───────────────────────────────────────────────────
  async function tag(name: string): Promise<string> {
    const t = await prisma.tag.upsert({
      where: { name_userId: { name, userId: user.id } },
      update: {},
      create: { name, userId: user.id },
    });
    return t.id;
  }

  // ── Helper to create an item with tags ──────────────────────────────────────
  async function createItem(data: {
    title: string;
    description: string;
    content?: string;
    url?: string;
    contentType: string;
    typeKey: string;
    collectionId: string;
    language?: string;
    isFavorite?: boolean;
    isPinned?: boolean;
    tags?: string[];
  }) {
    const tagIds = await Promise.all((data.tags ?? []).map(tag));
    return prisma.item.create({
      data: {
        title: data.title,
        description: data.description,
        content: data.content,
        url: data.url,
        contentType: data.contentType,
        language: data.language,
        isFavorite: data.isFavorite ?? false,
        isPinned: data.isPinned ?? false,
        userId: user.id,
        typeId: types[data.typeKey],
        collectionId: data.collectionId,
        tags: { create: tagIds.map((tagId) => ({ tagId })) },
      },
    });
  }

  // ── Collections & Items ──────────────────────────────────────────────────────

  // 1. React Patterns
  const reactPatterns = await prisma.collection.upsert({
    where: { id: "seed-col-react-patterns" },
    update: {},
    create: {
      id: "seed-col-react-patterns",
      name: "React Patterns",
      description: "Reusable React patterns and hooks",
      userId: user.id,
      isFavorite: true,
    },
  });

  await createItem({
    title: "useDebounce Hook",
    description: "Debounce a rapidly changing value by a given delay",
    contentType: "text",
    typeKey: "snippet",
    collectionId: reactPatterns.id,
    language: "typescript",
    isPinned: true,
    tags: ["react", "hooks", "typescript"],
    content: `import { useState, useEffect } from "react";

export function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}`,
  });

  await createItem({
    title: "useLocalStorage Hook",
    description: "Persist state to localStorage with automatic JSON serialization",
    contentType: "text",
    typeKey: "snippet",
    collectionId: reactPatterns.id,
    language: "typescript",
    tags: ["react", "hooks", "storage"],
    content: `import { useState } from "react";

export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initial;
    } catch {
      return initial;
    }
  });

  const set = (val: T) => {
    setValue(val);
    localStorage.setItem(key, JSON.stringify(val));
  };

  return [value, set] as const;
}`,
  });

  await createItem({
    title: "Context + Provider Pattern",
    description: "Type-safe React context with a custom hook and provider",
    contentType: "text",
    typeKey: "snippet",
    collectionId: reactPatterns.id,
    language: "typescript",
    tags: ["react", "context", "patterns"],
    content: `import { createContext, useContext, useState } from "react";

interface ThemeContextValue {
  theme: "dark" | "light";
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const toggle = () => setTheme((t) => (t === "dark" ? "light" : "dark"));
  return <ThemeContext.Provider value={{ theme, toggle }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
}`,
  });

  console.log("✅ Collection: React Patterns (3 snippets)");

  // 2. AI Workflows
  const aiWorkflows = await prisma.collection.upsert({
    where: { id: "seed-col-ai-workflows" },
    update: {},
    create: {
      id: "seed-col-ai-workflows",
      name: "AI Workflows",
      description: "AI prompts and workflow automations",
      userId: user.id,
      isFavorite: true,
    },
  });

  await createItem({
    title: "Code Review Prompt",
    description: "Ask AI to perform a thorough code review",
    contentType: "text",
    typeKey: "prompt",
    collectionId: aiWorkflows.id,
    isPinned: true,
    tags: ["ai", "code-review", "prompt"],
    content: `Review the following code and provide feedback on:
- Security vulnerabilities
- Performance issues
- Code quality and readability
- Edge cases not handled
- Suggested improvements

Code:
\`\`\`
{{code}}
\`\`\``,
  });

  await createItem({
    title: "Documentation Generator",
    description: "Generate JSDoc/TSDoc comments for a function",
    contentType: "text",
    typeKey: "prompt",
    collectionId: aiWorkflows.id,
    tags: ["ai", "docs", "prompt"],
    content: `Generate comprehensive JSDoc documentation for the following function. Include:
- A one-line summary
- @param descriptions with types
- @returns description
- @example with a realistic usage example

Function:
\`\`\`
{{function}}
\`\`\``,
  });

  await createItem({
    title: "Refactoring Assistant",
    description: "Prompt to refactor code for readability and maintainability",
    contentType: "text",
    typeKey: "prompt",
    collectionId: aiWorkflows.id,
    tags: ["ai", "refactor", "prompt"],
    content: `Refactor the following code to improve:
1. Readability and clarity
2. Separation of concerns
3. Reusability
4. TypeScript type safety

Keep the same functionality. Explain each change briefly.

Code:
\`\`\`
{{code}}
\`\`\``,
  });

  console.log("✅ Collection: AI Workflows (3 prompts)");

  // 3. DevOps
  const devops = await prisma.collection.upsert({
    where: { id: "seed-col-devops" },
    update: {},
    create: {
      id: "seed-col-devops",
      name: "DevOps",
      description: "Infrastructure and deployment resources",
      userId: user.id,
    },
  });

  await createItem({
    title: "Next.js Dockerfile",
    description: "Multi-stage Dockerfile for a Next.js production build",
    contentType: "text",
    typeKey: "snippet",
    collectionId: devops.id,
    language: "docker",
    tags: ["docker", "nextjs", "devops"],
    content: `FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
CMD ["node", "server.js"]`,
  });

  await createItem({
    title: "Deploy to Vercel",
    description: "Push and deploy current branch to Vercel",
    contentType: "text",
    typeKey: "command",
    collectionId: devops.id,
    language: "bash",
    tags: ["vercel", "deploy", "cli"],
    content: `# Deploy preview
vercel

# Deploy to production
vercel --prod`,
  });

  await createItem({
    title: "Neon Docs",
    description: "Official Neon serverless PostgreSQL documentation",
    contentType: "text",
    typeKey: "link",
    collectionId: devops.id,
    url: "https://neon.tech/docs",
    tags: ["neon", "postgres", "docs"],
  });

  await createItem({
    title: "Vercel Docs",
    description: "Deploy and scale Next.js apps on Vercel",
    contentType: "text",
    typeKey: "link",
    collectionId: devops.id,
    url: "https://vercel.com/docs",
    tags: ["vercel", "deploy", "docs"],
  });

  console.log("✅ Collection: DevOps (1 snippet, 1 command, 2 links)");

  // 4. Terminal Commands
  const terminal = await prisma.collection.upsert({
    where: { id: "seed-col-terminal" },
    update: {},
    create: {
      id: "seed-col-terminal",
      name: "Terminal Commands",
      description: "Useful shell commands for everyday development",
      userId: user.id,
      isFavorite: true,
    },
  });

  await createItem({
    title: "Git Stash & Branch",
    description: "Stash work in progress, switch to a new branch, then restore",
    contentType: "text",
    typeKey: "command",
    collectionId: terminal.id,
    language: "bash",
    tags: ["git", "workflow"],
    content: `git stash push -m "wip: description"
git checkout -b feature/new-feature
git stash pop`,
  });

  await createItem({
    title: "Docker Cleanup",
    description: "Remove all stopped containers, dangling images and unused volumes",
    contentType: "text",
    typeKey: "command",
    collectionId: terminal.id,
    language: "bash",
    tags: ["docker", "cleanup"],
    content: `docker container prune -f
docker image prune -f
docker volume prune -f
# Or all at once:
docker system prune -af --volumes`,
  });

  await createItem({
    title: "Kill Port Process",
    description: "Find and kill whatever process is occupying a given port",
    contentType: "text",
    typeKey: "command",
    collectionId: terminal.id,
    language: "bash",
    tags: ["process", "port", "linux"],
    content: `# Find process on port (e.g. 3000)
lsof -i :3000

# Kill it
kill -9 $(lsof -t -i :3000)`,
  });

  await createItem({
    title: "npm / pnpm Useful Commands",
    description: "Check outdated packages, audit and clean install",
    contentType: "text",
    typeKey: "command",
    collectionId: terminal.id,
    language: "bash",
    tags: ["npm", "pnpm", "packages"],
    content: `# Check outdated packages
npm outdated

# Security audit
npm audit

# Clean install (delete node_modules first)
rm -rf node_modules package-lock.json && npm install

# pnpm equivalents
pnpm outdated
pnpm audit
pnpm install --force`,
  });

  console.log("✅ Collection: Terminal Commands (4 commands)");

  // 5. Design Resources
  const design = await prisma.collection.upsert({
    where: { id: "seed-col-design" },
    update: {},
    create: {
      id: "seed-col-design",
      name: "Design Resources",
      description: "UI/UX resources and references",
      userId: user.id,
    },
  });

  await createItem({
    title: "Tailwind CSS Docs",
    description: "Official Tailwind CSS utility-first framework documentation",
    contentType: "text",
    typeKey: "link",
    collectionId: design.id,
    url: "https://tailwindcss.com/docs",
    tags: ["tailwind", "css", "docs"],
  });

  await createItem({
    title: "shadcn/ui Components",
    description: "Beautifully designed accessible components built with Radix UI",
    contentType: "text",
    typeKey: "link",
    collectionId: design.id,
    url: "https://ui.shadcn.com",
    tags: ["shadcn", "components", "ui"],
  });

  await createItem({
    title: "Radix UI Primitives",
    description: "Unstyled accessible component primitives for React",
    contentType: "text",
    typeKey: "link",
    collectionId: design.id,
    url: "https://www.radix-ui.com",
    tags: ["radix", "accessibility", "ui"],
  });

  await createItem({
    title: "Lucide Icons",
    description: "Beautiful & consistent open-source icon library",
    contentType: "text",
    typeKey: "link",
    collectionId: design.id,
    url: "https://lucide.dev/icons",
    tags: ["icons", "lucide", "ui"],
  });

  console.log("✅ Collection: Design Resources (4 links)");

  console.log("\n🎉 Seed complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
