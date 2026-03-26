import { Badge } from "@/components/ui/badge";
import { Code2, Sparkles, Terminal, FileText, File, Image, Link as LinkIcon, type LucideIcon } from "lucide-react";
import { getPinnedItems, getRecentItems, type ItemWithType } from "@/src/lib/db/items";

const typeConfig: Record<string, { icon: LucideIcon; color: string; bg: string; border: string }> = {
  snippet: { icon: Code2,    color: "text-blue-400",   bg: "bg-blue-400/10",   border: "border-l-blue-400"   },
  prompt:  { icon: Sparkles, color: "text-purple-400", bg: "bg-purple-400/10", border: "border-l-purple-400" },
  command: { icon: Terminal, color: "text-orange-400", bg: "bg-orange-400/10", border: "border-l-orange-400" },
  note:    { icon: FileText, color: "text-green-400",  bg: "bg-green-400/10",  border: "border-l-green-400"  },
  file:    { icon: File,     color: "text-slate-400",  bg: "bg-slate-400/10",  border: "border-l-slate-400"  },
  image:   { icon: Image,    color: "text-pink-400",   bg: "bg-pink-400/10",   border: "border-l-pink-400"   },
  url:     { icon: LinkIcon, color: "text-cyan-400",   bg: "bg-cyan-400/10",   border: "border-l-cyan-400"   },
};

function ItemRow({ item }: { item: ItemWithType }) {
  const key = item.typeName.toLowerCase();
  const cfg = typeConfig[key];
  const Icon = cfg?.icon ?? FileText;
  const color = cfg?.color ?? "text-muted-foreground";
  const bg = cfg?.bg ?? "bg-muted";
  const border = cfg?.border ?? "border-l-border";

  return (
    <div className={`flex items-start gap-3 p-4 rounded-lg border border-border bg-card border-l-4 ${border}`}>
      <div className={`p-2 rounded-md shrink-0 ${bg}`}>
        <Icon className={`h-4 w-4 ${color}`} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-sm font-medium text-foreground truncate">{item.title}</span>
          <Badge variant="secondary" className="text-xs shrink-0">{item.typeName}</Badge>
        </div>
        <p className="text-xs text-muted-foreground line-clamp-1 mb-1.5">{item.description}</p>
        <div className="flex flex-wrap gap-1">
          {item.tags.map((tag) => (
            <span key={tag} className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <span className="text-xs text-muted-foreground shrink-0 mt-0.5">
        {new Date(item.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
      </span>
    </div>
  );
}

export async function PinnedItems() {
  const pinned = await getPinnedItems();
  if (pinned.length === 0) return null;

  return (
    <section>
      <h2 className="text-base font-semibold text-foreground mb-3">📌 Pinned</h2>
      <div className="space-y-2">
        {pinned.map((item) => (
          <ItemRow key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}

export async function RecentItems() {
  const recent = await getRecentItems(10);

  return (
    <section>
      <h2 className="text-base font-semibold text-foreground mb-3">Recent Items</h2>
      <div className="space-y-2">
        {recent.map((item) => (
          <ItemRow key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
