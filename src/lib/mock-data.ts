export const mockUser = {
  id: "user_1",
  name: "John Doe",
  email: "john@example.com",
  isPro: true,
};

export const mockItemTypes = [
  { id: "type_snippet", name: "Snippet", icon: "snippet", isSystem: true, count: 24 },
  { id: "type_prompt", name: "Prompts", icon: "prompt", isSystem: true, count: 18 },
  { id: "type_command", name: "Commands", icon: "command", isSystem: true, count: 15 },
  { id: "type_note", name: "Notes", icon: "note", isSystem: true, count: 12 },
  { id: "type_file", name: "Files", icon: "file", isSystem: true, count: 5 },
  { id: "type_image", name: "Images", icon: "image", isSystem: true, count: 3 },
  { id: "type_url", name: "Links", icon: "link", isSystem: true, count: 8 },
];

export const mockCollections = [
  {
    id: "col_1",
    name: "React Patterns",
    description: "Common React patterns and hooks",
    isFavorite: true,
    itemCount: 12,
    icons: ["snippet", "prompt", "url"],
  },
  {
    id: "col_2",
    name: "Python Snippets",
    description: "Useful Python code snippets",
    isFavorite: false,
    itemCount: 8,
    icons: ["snippet", "file"],
  },
  {
    id: "col_3",
    name: "Context Files",
    description: "AI context files for projects",
    isFavorite: true,
    itemCount: 5,
    icons: ["snippet", "file"],
  },
  {
    id: "col_4",
    name: "Interview Prep",
    description: "Technical interview preparation",
    isFavorite: false,
    itemCount: 24,
    icons: ["snippet", "command", "url", "note"],
  },
  {
    id: "col_5",
    name: "Git Commands",
    description: "Frequently used git commands",
    isFavorite: true,
    itemCount: 15,
    icons: ["snippet", "file"],
  },
  {
    id: "col_6",
    name: "AI Prompts",
    description: "Curated AI prompts for coding",
    isFavorite: false,
    itemCount: 18,
    icons: ["prompt", "snippet"],
  },
];

export const mockItems = [
  {
    id: "item_1",
    title: "useAuth Hook",
    description: "Custom authentication hook for React applications",
    contentType: "text",
    content: `import { useSession } from 'next-auth/react'

export function useAuth() {
  const { data: session, status } = useSession()
  return {
    user: session?.user,
    isLoading: status === 'loading',
    isAuthenticated: status === 'authenticated',
  }
}`,
    typeId: "type_snippet",
    typeName: "Snippet",
    collectionId: "col_1",
    collectionName: "React Patterns",
    tags: ["react", "auth", "hooks"],
    isFavorite: false,
    isPinned: true,
    language: "typescript",
    createdAt: "2026-03-15",
  },
  {
    id: "item_2",
    title: "API Error Handling Pattern",
    description: "Fetch wrapper with exponential backoff retry logic",
    contentType: "text",
    content: `async function fetchWithRetry(url: string, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url)
      if (!res.ok) throw new Error(res.statusText)
      return await res.json()
    } catch (e) {
      if (i === retries - 1) throw e
      await new Promise(r => setTimeout(r, 2 ** i * 1000))
    }
  }
}`,
    typeId: "type_snippet",
    typeName: "Snippet",
    collectionId: "col_1",
    collectionName: "React Patterns",
    tags: ["api", "error-handling", "fetch"],
    isFavorite: false,
    isPinned: true,
    language: "typescript",
    createdAt: "2026-03-15",
  },
  {
    id: "item_3",
    title: "Git Stash & Branch",
    description: "Save work in progress and switch branches",
    contentType: "text",
    content: `git stash push -m "wip: feature description"
git checkout -b feature/new-feature
git stash pop`,
    typeId: "type_command",
    typeName: "Command",
    collectionId: "col_5",
    collectionName: "Git Commands",
    tags: ["git", "workflow"],
    isFavorite: true,
    isPinned: false,
    language: "bash",
    createdAt: "2026-03-10",
  },
  {
    id: "item_4",
    title: "Code Review Prompt",
    description: "Prompt for asking AI to review code",
    contentType: "text",
    content: `Review the following code for:
- Security vulnerabilities
- Performance issues
- Code quality and readability
- Edge cases

Code:
\`\`\`
{{code}}
\`\`\``,
    typeId: "type_prompt",
    typeName: "Prompt",
    collectionId: "col_6",
    collectionName: "AI Prompts",
    tags: ["ai", "code-review", "prompt"],
    isFavorite: true,
    isPinned: false,
    language: null,
    createdAt: "2026-03-08",
  },
  {
    id: "item_5",
    title: "Next.js CLAUDE.md Template",
    description: "Context file template for Next.js projects",
    contentType: "text",
    content: `# Project Context

## Stack
- Next.js 15 + React 19
- TypeScript (strict)
- Tailwind CSS v4
- Prisma + PostgreSQL

## Commands
- \`npm run dev\` - Start dev server
- \`npm run build\` - Build for production
`,
    typeId: "type_file",
    typeName: "File",
    collectionId: "col_3",
    collectionName: "Context Files",
    tags: ["nextjs", "context", "claude"],
    isFavorite: false,
    isPinned: false,
    language: "markdown",
    createdAt: "2026-03-05",
  },
  {
    id: "item_6",
    title: "Python List Comprehension Patterns",
    description: "Common list comprehension patterns with examples",
    contentType: "text",
    content: `# Filter and transform
evens = [x * 2 for x in range(10) if x % 2 == 0]

# Nested comprehension
matrix = [[1 if i == j else 0 for j in range(3)] for i in range(3)]

# Dict comprehension
word_lengths = {word: len(word) for word in ["hello", "world"]}`,
    typeId: "type_snippet",
    typeName: "Snippet",
    collectionId: "col_2",
    collectionName: "Python Snippets",
    tags: ["python", "lists"],
    isFavorite: false,
    isPinned: false,
    language: "python",
    createdAt: "2026-03-01",
  },
];
