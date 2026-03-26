import { prisma } from "@/src/lib/prisma";

export interface ItemWithType {
  id: string;
  title: string;
  description: string | null;
  isFavorite: boolean;
  isPinned: boolean;
  createdAt: Date;
  typeName: string;
  tags: string[];
}

export interface DashboardStats {
  totalItems: number;
  totalCollections: number;
  favoriteItems: number;
  favoriteCollections: number;
}

export async function getPinnedItems(): Promise<ItemWithType[]> {
  const items = await prisma.item.findMany({
    where: { isPinned: true },
    orderBy: { updatedAt: "desc" },
    include: {
      type: { select: { name: true } },
      tags: { include: { tag: { select: { name: true } } } },
    },
  });

  return items.map((item) => ({
    id: item.id,
    title: item.title,
    description: item.description,
    isFavorite: item.isFavorite,
    isPinned: item.isPinned,
    createdAt: item.createdAt,
    typeName: item.type.name,
    tags: item.tags.map((t) => t.tag.name),
  }));
}

export async function getRecentItems(limit = 10): Promise<ItemWithType[]> {
  const items = await prisma.item.findMany({
    take: limit,
    orderBy: { createdAt: "desc" },
    include: {
      type: { select: { name: true } },
      tags: { include: { tag: { select: { name: true } } } },
    },
  });

  return items.map((item) => ({
    id: item.id,
    title: item.title,
    description: item.description,
    isFavorite: item.isFavorite,
    isPinned: item.isPinned,
    createdAt: item.createdAt,
    typeName: item.type.name,
    tags: item.tags.map((t) => t.tag.name),
  }));
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const [items, collections] = await Promise.all([
    prisma.item.findMany({ select: { id: true, isFavorite: true } }),
    prisma.collection.findMany({ select: { id: true, isFavorite: true } }),
  ]);

  return {
    totalItems: items.length,
    totalCollections: collections.length,
    favoriteItems: items.filter((i) => i.isFavorite).length,
    favoriteCollections: collections.filter((c) => c.isFavorite).length,
  };
}
