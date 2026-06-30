import { createFileRoute, Link } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useSavedViews } from "@/hooks/use-saved-views";
import { SOURCE_LABELS, type SourceId } from "@/lib/feedback/types";

export const Route = createFileRoute("/views")({
  head: () => ({ meta: [{ title: "Saved views — Vox Pulse" }] }),
  component: ViewsPage,
});

function ViewsPage() {
  const { views, loaded, removeView } = useSavedViews();

  return (
    <AppShell>
      <main className="mx-auto max-w-4xl px-6 py-12">
        <h1 className="font-serif text-3xl tracking-tight">Saved views</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Re-run any saved search with one click. Stored locally in your browser.
        </p>
        <div className="mt-8 space-y-3">
          {!loaded ? (
            Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)
          ) : views.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground">
              No saved views yet.{" "}
              <Link to="/" className="text-primary underline-offset-4 hover:underline">
                Start a search
              </Link>{" "}
              and save it from the results page.
            </div>
          ) : (
            views.map((v) => (
              <Card key={v.id} className="border-border bg-card">
                <div className="flex items-center justify-between gap-4 p-5">
                  <div className="min-w-0">
                    <div className="font-medium">{v.name}</div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {v.keyword} ·{" "}
                      {v.sources
                        .map((s: string) => SOURCE_LABELS[s as SourceId] ?? s)
                        .join(", ")}{" "}
                      · past {v.timeframe}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button asChild size="sm">
                      <Link
                        to="/search"
                        search={{
                          q: v.keyword,
                          sources: v.sources.join(","),
                          timeframe: v.timeframe,
                          view: v.id,
                        }}
                      >
                        Re-run
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        removeView(v.id);
                        toast.success("View deleted");
                      }}
                      aria-label="Delete view"
                    >
                      <Trash2 className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </main>
    </AppShell>
  );
}