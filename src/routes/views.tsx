import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { SiteHeader } from "@/components/site-header";
import { useAuth } from "@/hooks/use-auth";
import { deleteView, listViews } from "@/lib/feedback/views.functions";
import { SOURCE_LABELS, type SourceId } from "@/lib/feedback/types";
import { useEffect } from "react";

export const Route = createFileRoute("/views")({
  head: () => ({ meta: [{ title: "Saved views — Vox Pulse" }] }),
  component: ViewsPage,
});

function ViewsPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const listFn = useServerFn(listViews);
  const deleteFn = useServerFn(deleteView);
  const qc = useQueryClient();

  useEffect(() => {
    if (!loading && !user) {
      navigate({ to: "/auth", search: { next: "/views" } });
    }
  }, [loading, user, navigate]);

  const query = useQuery({
    queryKey: ["saved_views"],
    queryFn: () => listFn(),
    enabled: !!user,
  });

  const del = useMutation({
    mutationFn: (id: string) => deleteFn({ data: { id } }),
    onSuccess: () => {
      toast.success("View deleted");
      qc.invalidateQueries({ queryKey: ["saved_views"] });
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Failed"),
  });

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-6 py-12">
        <h1 className="font-serif text-3xl tracking-tight">Saved views</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Re-run any saved search with one click.
        </p>
        <div className="mt-8 space-y-3">
          {query.isLoading || loading ? (
            Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)
          ) : (query.data ?? []).length === 0 ? (
            <div className="rounded-xl border border-dashed border-border/60 p-12 text-center text-muted-foreground">
              No saved views yet.{" "}
              <Link to="/" className="text-primary underline-offset-4 hover:underline">
                Start a search
              </Link>{" "}
              and save it from the results page.
            </div>
          ) : (
            (query.data ?? []).map((v) => (
              <Card key={v.id} className="border-border/60 bg-card/40">
                <CardContent className="flex items-center justify-between gap-4 p-5">
                  <div className="min-w-0">
                    <div className="font-medium">{v.name}</div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {v.keyword} ·{" "}
                      {v.sources
                        .map((s) => SOURCE_LABELS[s as SourceId] ?? s)
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
                          timeframe: v.timeframe as
                            | "day"
                            | "week"
                            | "month"
                            | "year"
                            | "all",
                        }}
                      >
                        Re-run
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => del.mutate(v.id)}
                      disabled={del.isPending}
                      aria-label="Delete view"
                    >
                      <Trash2 className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
}