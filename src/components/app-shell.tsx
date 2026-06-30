import { useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { BarChart3, PanelLeftClose, PanelLeftOpen, Plus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSavedViews } from "@/hooks/use-saved-views";
import { cn } from "@/lib/utils";

function scoreTone(score?: number) {
  if (score === undefined) return "bg-muted text-muted-foreground";
  if (score >= 65) return "bg-positive/15 text-positive";
  if (score <= 40) return "bg-negative/15 text-negative";
  return "bg-warn/20 text-foreground/70";
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(iso).toLocaleDateString();
}

export function AppShell({
  title,
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(true);
  const { views, loaded } = useSavedViews();
  const path = useRouterState({ select: (r) => r.location.pathname });
  const search = useRouterState({ select: (r) => r.location.search }) as unknown as
    | Record<string, unknown>
    | null;
  const activeViewId =
    search && typeof search === "object" && "view" in search
      ? String(search.view)
      : undefined;

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      <aside
        className={cn(
          "hidden shrink-0 border-r border-border bg-sidebar transition-[width] md:flex md:flex-col",
          open ? "w-72" : "w-0 overflow-hidden",
        )}
      >
        <div className="flex items-center gap-2 px-5 py-5">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary">
              <BarChart3 className="h-4 w-4" />
            </span>
            <span className="font-serif text-lg leading-none">
              Vox <span className="text-primary">Pulse</span>
            </span>
          </Link>
        </div>
        <div className="px-4">
          <Button asChild className="w-full justify-start gap-2" size="sm">
            <Link to="/">
              <Plus className="h-4 w-4" />
              New Search
            </Link>
          </Button>
        </div>
        <div className="mt-6 px-5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Saved Views <span className="text-muted-foreground/70">({views.length})</span>
        </div>
        <ScrollArea className="mt-2 flex-1">
          <div className="space-y-1 px-3 pb-6">
            {!loaded ? null : views.length === 0 ? (
              <p className="px-2 py-3 text-xs text-muted-foreground">
                No saved views yet. Run a search and save it.
              </p>
            ) : (
              views.map((v) => {
                const active = path === "/search" && activeViewId === v.id;
                return (
                  <Link
                    key={v.id}
                    to="/search"
                    search={{
                      q: v.keyword,
                      sources: v.sources.join(","),
                      timeframe: v.timeframe,
                      view: v.id,
                    }}
                    className={cn(
                      "block rounded-lg px-3 py-2.5 text-sm transition-colors",
                      active
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "hover:bg-muted",
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate font-medium">{v.name}</span>
                      {v.lastScore !== undefined && (
                        <span
                          className={cn(
                            "rounded-md px-1.5 py-0.5 text-[10px] font-semibold",
                            scoreTone(v.lastScore),
                          )}
                        >
                          {v.lastScore}
                        </span>
                      )}
                    </div>
                    <div className="mt-0.5 text-[11px] text-muted-foreground">
                      Updated {timeAgo(v.updatedAt)}
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </ScrollArea>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background/85 px-4 backdrop-blur">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle sidebar"
          >
            {open ? (
              <PanelLeftClose className="h-4 w-4" />
            ) : (
              <PanelLeftOpen className="h-4 w-4" />
            )}
          </Button>
          <span className="text-sm font-medium text-foreground/80">
            {title ?? "Customer Voice Analyser"}
          </span>
          <div className="ml-auto flex items-center gap-2">
            <Button asChild variant="ghost" size="sm" className="gap-1.5">
              <Link to="/">
                <Search className="h-3.5 w-3.5" /> Search
              </Link>
            </Button>
          </div>
        </header>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}