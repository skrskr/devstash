import { Card, CardContent } from "@/components/ui/card";
import { Layers, FolderOpen, Star, BookMarked } from "lucide-react";
import { mockItemTypes, mockCollections, mockItems } from "@/src/lib/mock-data";

const totalItems = mockItemTypes.reduce((sum, t) => sum + t.count, 0);
const totalCollections = mockCollections.length;
const favoriteItems = mockItems.filter((i) => i.isFavorite).length;
const favoriteCollections = mockCollections.filter((c) => c.isFavorite).length;

const stats = [
  { label: "Total Items", value: totalItems, icon: Layers, color: "text-blue-400" },
  { label: "Collections", value: totalCollections, icon: FolderOpen, color: "text-purple-400" },
  { label: "Favorite Items", value: favoriteItems, icon: Star, color: "text-yellow-400" },
  { label: "Favorite Collections", value: favoriteCollections, icon: BookMarked, color: "text-orange-400" },
];

export function StatsCards() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.label} className="bg-card border-border">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-md bg-muted shrink-0">
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-semibold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
