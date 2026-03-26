import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { getSidebarItemTypes, getSidebarCollections } from "@/src/lib/db/items";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const itemTypes = await getSidebarItemTypes();
  const collections = await getSidebarCollections();

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Top Bar */}
      <header className="flex items-center gap-4 px-4 h-14 border-b border-border shrink-0">
        <span className="font-semibold text-foreground text-sm mr-2">DevStash</span>

        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search items..."
              className="pl-8 h-8 bg-muted border-0 text-sm"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <Button variant="outline" size="sm">
            New Collection
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-1" />
            New Item
          </Button>
        </div>
      </header>

      <DashboardShell itemTypes={itemTypes} collections={collections}>
        {children}
      </DashboardShell>
    </div>
  );
}
