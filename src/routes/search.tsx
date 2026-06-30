import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { FeedbackSections } from "@/components/feedback-sections";
import { SaveViewDialog } from "@/components/save-view-dialog";
import { Scorecard } from "@/components/scorecard";
import { SearchBar } from "@/components/search-bar";
import { SiteHeader } from "@/components/site-header";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchFeedback } from "@/lib/feedback/fetch.functions";
import {
  ALL_SOURCES,
  SOURCE_LABELS,
  type SourceId,
  type Timeframe,
} from "@/lib/feedback/types";

const searchSchema = z.object({
  q: z.string().optional().default(""),
  sources: z.string().optional().default(ALL_SOURCES.join(",")),
  timeframe: z.enum(["day", "week", "month", "year", "all"]).optional().default("month"),
});

export const Route = createFileRoute("/search")({
  validateSearch: (s) => searchSchema.parse(s),
  head: ({ match }) => {
    const q = (match.search as { q?: string }).q ?? "";
    return {
      meta: [
        { title: q ? `${q} — Vox Pulse` : "Search — Vox Pulse" },
        { name: "description", content: `Customer feedback about ${q || "your product"} across the public web.` },
      ],
    };
  },
  component: SearchPage,
});

function SearchPage() {
  const { q, sources, timeframe } = Route.useSearch();
  const sourceList = sources
    .split(",")
    .map((s) => s.trim())
    .filter((s): s is SourceId => (ALL_SOURCES as string[]).includes(s));

  const fetchFn = useServerFn(fetchFeedback);

  const enabled = q.trim().length >= 2 && sourceList.length > 0;
  const query = useQuery({
    queryKey: ["feedback", q, sourceList.join(","), timeframe],
    queryFn: () =>
      fetchFn({
        data: { keyword: q.trim(), sources: sourceList, timeframe: timeframe as Timeframe },
      }),
    enabled,
    staleTime: 5 * 60 * 1000,
  });

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
            ← Home
          </Link>
          <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="font-serif text-3xl tracking-tight">
                {q ? <>Listening to <span className="text-primary">{q}</span></> : "Search"}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {sourceList.map((s) => SOURCE_LABELS[s]).join(" · ")} · past {timeframe}
              </p>
            </div>
            {enabled && (
              <SaveViewDialog
                keyword={q.trim()}
                sources={sourceList}
                timeframe={timeframe as Timeframe}
              />
            )}
          </div>
        </div>

        <div className="mb-10 rounded-2xl border border-border/60 bg-card/30 p-4 sm:p-6">
          <SearchBar
            defaultKeyword={q}
            defaultSources={sourceList.length ? sourceList : ALL_SOURCES}
            defaultTimeframe={timeframe as Timeframe}
          />
        </div>

        {!enabled ? (
          <div className="rounded-xl border border-dashed border-border/60 p-12 text-center text-muted-foreground">
            Enter a keyword and pick at least one source to start listening.
          </div>
        ) : query.isLoading ? (
          <div className="space-y-6">
            <Skeleton className="h-40 w-full" />
            <div className="grid gap-4 md:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-36 w-full" />
              ))}
            </div>
          </div>
        ) : query.isError ? (
          <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-6 text-sm text-destructive">
            {query.error instanceof Error ? query.error.message : "Something went wrong."}
          </div>
        ) : query.data ? (
          <div className="space-y-8">
            <Scorecard data={query.data.scorecard} />
            {Object.keys(query.data.errors).length > 0 && (
              <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-200">
                Some sources returned no results:{" "}
                {Object.entries(query.data.errors)
                  .map(([s]) => SOURCE_LABELS[s as SourceId])
                  .join(", ")}
              </div>
            )}
            <FeedbackSections items={query.data.items} />
          </div>
        ) : null}
      </main>
    </div>
  );
}