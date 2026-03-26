"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Code2,
  Sparkles,
  Terminal,
  FileText,
  File,
  Image,
  Link as LinkIcon,
  Star,
  ChevronDown,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  type LucideIcon,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { SidebarItemType, SidebarCollection } from "@/src/lib/db/items";

const typeConfig: Record<string, { icon: LucideIcon; color: string; dot: string }> = {
  snippet: { icon: Code2,     color: "text-blue-400",   dot: "bg-blue-400"   },
  prompt:  { icon: Sparkles,  color: "text-purple-400", dot: "bg-purple-400" },
  command: { icon: Terminal,  color: "text-orange-400", dot: "bg-orange-400" },
  note:    { icon: FileText,  color: "text-green-400",  dot: "bg-green-400"  },
  file:    { icon: File,      color: "text-slate-400",  dot: "bg-slate-400"  },
  image:   { icon: Image,     color: "text-pink-400",   dot: "bg-pink-400"   },
  link:    { icon: LinkIcon,  color: "text-cyan-400",   dot: "bg-cyan-400"   },
};

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  itemTypes: SidebarItemType[];
  collections: SidebarCollection[];
}

export function Sidebar({ collapsed, onToggle, itemTypes, collections }: SidebarProps) {
  const [typesOpen, setTypesOpen] = useState(true);
  const [collectionsOpen, setCollectionsOpen] = useState(true);

  const favoriteCollections = collections.filter((c) => c.isFavorite);
  const allCollections = collections.filter((c) => !c.isFavorite);

  return (
    <div
      className={cn(
        "flex flex-col h-full bg-background border-r border-border transition-all duration-200 overflow-hidden",
        collapsed ? "w-14" : "w-60"
      )}
    >
      {/* Collapse toggle */}
      <div className="flex items-center justify-end px-2 py-2 shrink-0">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-muted-foreground"
          onClick={onToggle}
        >
          {collapsed ? (
            <PanelLeftOpen className="h-4 w-4" />
          ) : (
            <PanelLeftClose className="h-4 w-4" />
          )}
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto px-2 pb-2">
        {/* Types */}
        <div className="mb-2">
          {!collapsed && (
            <button
              className="flex items-center gap-1 w-full px-2 py-1 text-xs font-medium text-muted-foreground hover:text-foreground"
              onClick={() => setTypesOpen((o) => !o)}
            >
              {typesOpen ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
              Types
            </button>
          )}
          {(typesOpen || collapsed) &&
            itemTypes.map((type) => {
              const key = type.name.toLowerCase();
              const cfg = typeConfig[key];
              if (!cfg) return null;
              const Icon = cfg.icon;
              return (
                <Link
                  key={type.id}
                  href={`/items/${type.name.toLowerCase()}`}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                >
                  <Icon className={cn("h-4 w-4 shrink-0", cfg.color)} />
                  {!collapsed && (
                    <>
                      <span className="flex-1 truncate">{type.name}</span>
                      <span className="text-xs text-muted-foreground">{type.count}</span>
                    </>
                  )}
                </Link>
              );
            })}
        </div>

        {/* Collections */}
        {!collapsed && (
          <div>
            <button
              className="flex items-center gap-1 w-full px-2 py-1 text-xs font-medium text-muted-foreground hover:text-foreground"
              onClick={() => setCollectionsOpen((o) => !o)}
            >
              {collectionsOpen ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
              Collections
            </button>

            {collectionsOpen && (
              <>
                {favoriteCollections.length > 0 && (
                  <div className="mb-1">
                    <p className="px-2 py-1 text-xs text-muted-foreground/60 uppercase tracking-wider">
                      Favorites
                    </p>
                    {favoriteCollections.map((col) => (
                      <Link
                        key={col.id}
                        href={`/collections/${col.id}`}
                        className="flex items-center gap-2 px-2 py-1.5 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                      >
                        <Star className="h-3.5 w-3.5 shrink-0 fill-yellow-400 text-yellow-400" />
                        <span className="flex-1 truncate">{col.name}</span>
                      </Link>
                    ))}
                  </div>
                )}

                {allCollections.length > 0 && (
                  <div>
                    <p className="px-2 py-1 text-xs text-muted-foreground/60 uppercase tracking-wider">
                      All Collections
                    </p>
                    {allCollections.map((col) => {
                      const dotColor = col.dominantTypeKey
                        ? (typeConfig[col.dominantTypeKey]?.dot ?? "bg-muted-foreground")
                        : "bg-muted-foreground";
                      return (
                        <Link
                          key={col.id}
                          href={`/collections/${col.id}`}
                          className="flex items-center gap-2 px-2 py-1.5 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                        >
                          <span className={cn("h-2 w-2 rounded-full shrink-0", dotColor)} />
                          <span className="flex-1 truncate">{col.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}

                <Link
                  href="/collections"
                  className="flex items-center px-2 py-1.5 mt-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  View all collections →
                </Link>
              </>
            )}
          </div>
        )}
      </div>

      {/* User avatar */}
      <div className="shrink-0 border-t border-border p-3">
        <div className="flex items-center gap-2">
          <Avatar className="h-7 w-7 shrink-0">
            <AvatarFallback className="text-xs bg-muted">D</AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground truncate">Demo User</p>
              <p className="text-xs text-muted-foreground truncate">demo@devstash.io</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
