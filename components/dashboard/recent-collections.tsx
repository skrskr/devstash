import Link from "next/link";
import { Star, MoreHorizontal, Code2, Sparkles, Terminal, FileText, File, Image, Link as LinkIcon, type LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { getRecentCollections } from "@/src/lib/db/collections";

const iconMap: Record<string, LucideIcon> = {
  snippet: Code2,
  prompt: Sparkles,
  command: Terminal,
  note: FileText,
  file: File,
  image: Image,
  url: LinkIcon,
  link: LinkIcon,
};

const borderColorMap: Record<string, string> = {
  snippet: "border-l-blue-400",
  prompt:  "border-l-purple-400",
  command: "border-l-orange-400",
  note:    "border-l-green-400",
  file:    "border-l-slate-400",
  image:   "border-l-pink-400",
  url:     "border-l-cyan-400",
  link:    "border-l-cyan-400",
};

export async function RecentCollections() {
  const collections = await getRecentCollections();

  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-semibold text-foreground">Collections</h2>
        <Link href="/collections" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
          View all
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
        {collections.map((col) => {
          const borderColor = col.dominantTypeKey
            ? (borderColorMap[col.dominantTypeKey] ?? "border-l-border")
            : "border-l-border";
          return (
            <Link key={col.id} href={`/collections/${col.id}`}>
              <Card className={`bg-card border-border border-l-4 ${borderColor} hover:bg-accent/30 transition-colors cursor-pointer h-full`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="text-sm font-medium text-foreground truncate">{col.name}</span>
                      {col.isFavorite && (
                        <Star className="h-3.5 w-3.5 shrink-0 fill-yellow-400 text-yellow-400" />
                      )}
                    </div>
                    <MoreHorizontal className="h-4 w-4 text-muted-foreground shrink-0 ml-2" />
                  </div>

                  <p className="text-xs text-muted-foreground mb-3">{col.itemCount} items</p>
                  <p className="text-xs text-muted-foreground line-clamp-1 mb-3">{col.description}</p>

                  <div className="flex items-center gap-1.5">
                    {col.typeKeys.map((key) => {
                      const Icon = iconMap[key];
                      if (!Icon) return null;
                      return <Icon key={key} className="h-3.5 w-3.5 text-muted-foreground" />;
                    })}
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
