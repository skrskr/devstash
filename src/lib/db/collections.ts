import { prisma } from "@/src/lib/prisma";

export interface CollectionWithTypes {
  id: string;
  name: string;
  description: string | null;
  isFavorite: boolean;
  itemCount: number;
  typeKeys: string[];
  dominantTypeKey: string | null;
}

export async function getRecentCollections(limit = 6): Promise<CollectionWithTypes[]> {
  const collections = await prisma.collection.findMany({
    take: limit,
    orderBy: { updatedAt: "desc" },
    include: {
      items: {
        include: {
          type: {
            select: { name: true },
          },
        },
      },
    },
  });

  return collections.map((col) => {
    const typeCounts: Record<string, number> = {};
    const seenKeys = new Set<string>();

    for (const item of col.items) {
      const key = item.type.name.toLowerCase();
      typeCounts[key] = (typeCounts[key] ?? 0) + 1;
      seenKeys.add(key);
    }

    const dominantTypeKey =
      Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

    return {
      id: col.id,
      name: col.name,
      description: col.description,
      isFavorite: col.isFavorite,
      itemCount: col.items.length,
      typeKeys: Array.from(seenKeys),
      dominantTypeKey,
    };
  });
}
