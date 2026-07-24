import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Link2, RefreshCw, Zap } from "lucide-react";
import { z } from "zod";

import { ActionReport } from "@/components/action-report";
import { AppShell } from "@/components/app-shell";
import { DashboardStats, TopThemes } from "@/components/dashboard-stats";
import { EditViewDialog } from "@/components/edit-view-dialog";
import { FeedbackSections } from "@/components/feedback-sections";
import { FilterBar } from "@/components/filter-bar";
import { ScoreSummaryBar } from "@/components/score-summary-bar";
import { SaveViewDialog } from "@/components/save-view-dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useSavedViews } from "@/hooks/use-saved-views";
import { fetchFeedback } from "@/lib/feedback/fetch.functions";
import {
  ALL_SOURCES,
  SOURCE_LABELS,
  type Category,
  type FetchFeedbackResult,
  type SourceId,
  type Timeframe,
} from "@/lib/feedback/types";

const CACHE_TTL = 6 * 60 * 60 * 1000;

function getCached(key: string): FetchFeedbackResult | null {
  try {
    const raw = localStorage.getItem(`vox-pulse:cache:v3:${key}`);
    if (!raw) return null;
    const { data, ts } = JSON.parse(raw) as { data: FetchFeedbackResult; ts: number };
    if (Date.now() - ts > CACHE_TTL) return null;
    return data;
  } catch { return null; }
}

function setCached(key: string, data: FetchFeedbackResult) {
  try {
    localStorage.setItem(`vox-pulse:cache:v3:${key}`, JSON.stringify({ data, ts: Date.now() }));
  } catch {}
}

function getCacheTimestamp(key: string): number | null {
  try {
    const raw = localStorage.getItem(`vox-pulse:cache:v3:${key}`);
    if (!raw) return null;
    const { ts } = JSON.parse(raw) as { ts: number };
    return typeof ts === "number" ? ts : null;
  } catch { return null; }
}

function formatTimeLeft(ts: number): string {
  const left = CACHE_TTL - (Date.now() - ts);
  if (left <= 0) return "expiring";
  const h = Math.floor(left / 3_600_000);
  const m = Math.floor((left % 3_600_000) / 60_000);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

const searchSchema = z.object({
  q: z.string().optional().default(""),
  sources: z.string().optional().default(ALL_SOURCES.join(",")),
  timeframe: z.enum(["day", "week", "month", "year", "all"]).optional().default("month"),
  view: z.string().optional(),
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
  const { q, sources, timeframe, view } = Route.useSearch();
  const navigate = useNavigate();
  const { views, updateView } = useSavedViews();
  const sourceList: SourceId[] = sources
    .split(",")
    .map((s: string) => s.trim())
    .filter((s: string): s is SourceId =>
      (ALL_SOURCES as string[]).includes(s),
    );

  const fetchFn = useServerFn(fetchFeedback);
  const enabled = q.trim().length >= 2 && sourceList.length > 0;
  const cacheKey = `${q.trim()}|${sourceList.join(",")}|${timeframe}`;
  const query = useQuery({
    queryKey: ["feedback", q, sourceList.join(","), timeframe],
    queryFn: async () => {
      const cached = getCached(cacheKey);
      if (cached) return cached;
      const result = await fetchFn({
        data: { keyword: q.trim(), sources: sourceList, timeframe: timeframe as Timeframe },
      });
      setCached(cacheKey, result);
      return result;
    },
    enabled,
    staleTime: CACHE_TTL,
    gcTime: CACHE_TTL,
  });

  const savedView = useMemo(() => views.find((v) => v.id === view), [views, view]);

  // Keep saved view's lastScore in sync
  useEffect(() => {
    if (savedView && query.data && query.data.scorecard.score !== savedView.lastScore) {
      updateView(savedView.id, { lastScore: query.data.scorecard.score });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savedView?.id, query.data?.scorecard.score]);

  // Cache timestamp — re-evaluated every minute so the countdown stays live
  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick((n) => n + 1), 60_000);
    return () => clearInterval(id);
  }, []);
  const cacheTs = getCacheTimestamp(cacheKey);
  const isCached = cacheTs !== null && Date.now() - cacheTs < CACHE_TTL;

  // Local filter state
  const [activeSources, setActiveSources] = useState<Set<SourceId>>(new Set(sourceList));
  useEffect(() => setActiveSources(new Set(sourceList)), [sources]);
  const [themeFilter, setThemeFilter] = useState<Category | "all">("all");
  const [textQ, setTextQ] = useState("");

  const filteredItems = useMemo(() => {
    if (!query.data) return [];
    return query.data.items.filter((i) => {
      if (!activeSources.has(i.source)) return false;
      if (themeFilter !== "all" && i.category !== themeFilter) return false;
      if (textQ.trim()) {
        const t = textQ.toLowerCase();
        if (!`${i.title} ${i.snippet}`.toLowerCase().includes(t)) return false;
      }
      return true;
    });
  }, [query.data, activeSources, themeFilter, textQ]);

  const timeframeLabel: Record<Timeframe, string> = {
    day: "Past 24h",
    week: "Past Week",
    month: "Past Month",
    year: "Past Year",
    all: "All Time",
  };

  return (
    <>
    <AppShell>
      <div className="mx-auto w-full max-w-[1400px] px-6 py-8">
        {/* Header row */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              {savedView ? "Saved View" : "Search"}
            </div>
            <h1 className="mt-1 font-serif text-4xl font-medium tracking-tight">
              {savedView?.name || q || "Untitled"}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1 text-foreground/70">
                <Link2 className="h-3 w-3" /> "{q}"
              </span>
              <span>·</span>
              <span>{sourceList.map((s) => SOURCE_LABELS[s]).join(" / ")}</span>
              <span>·</span>
              <span className="rounded-full bg-accent px-2 py-0.5 text-accent-foreground">
                {timeframeLabel[timeframe as Timeframe]}
              </span>
              {isCached && cacheTs && (
                <>
                  <span>·</span>
                  <span
                    className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2 py-0.5 text-amber-700"
                    title="Results are cached. Refresh is blocked until the cache expires to save API credits."
                  >
                    <RefreshCw className="h-2.5 w-2.5" />
                    Cached · refreshes in {formatTimeLeft(cacheTs)}
                  </span>
                </>
              )}
              {savedView && (
                <>
                  <span>·</span>
                  <span>Updated {new Date(savedView.updatedAt).toLocaleDateString()}</span>
                </>
              )}
            </div>
          </div>
          <div className="flex flex-shrink-0 items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (isCached && cacheTs) {
                  localStorage.removeItem(`vox-pulse:cache:v3:${cacheKey}`);
                }
                query.refetch();
              }}
              disabled={query.isFetching || !enabled || isCached}
              title={isCached && cacheTs ? `Data is cached for 6h to save API credits. Refreshes in ${formatTimeLeft(cacheTs)}.` : undefined}
              className="gap-1.5"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${query.isFetching ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            {enabled && !savedView && (
              <SaveViewDialog
                keyword={q.trim()}
                sources={sourceList}
                timeframe={timeframe as Timeframe}
              />
            )}
            {savedView && (
              <EditViewDialog
                view={savedView}
                onUpdated={(patch) => {
                  // Clear cached result for both old and new param combos so re-fetch runs fresh
                  const oldKey = `${q.trim()}|${sourceList.join(",")}|${timeframe}`;
                  const newKey = `${patch.keyword}|${patch.sources.join(",")}|${patch.timeframe}`;
                  localStorage.removeItem(`vox-pulse:cache:v3:${oldKey}`);
                  localStorage.removeItem(`vox-pulse:cache:v3:${newKey}`);
                  navigate({
                    to: "/search",
                    search: {
                      q: patch.keyword,
                      sources: patch.sources.join(","),
                      timeframe: patch.timeframe,
                      view: savedView.id,
                    },
                  });
                }}
              />
            )}
            <Button variant="ghost" size="sm" asChild>
              <Link to="/">New search</Link>
            </Button>
          </div>
        </div>

        <div className="mt-8 space-y-5">
          {!enabled ? (
            <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground">
              Enter a keyword and pick at least one source to start listening.
            </div>
          ) : query.isLoading ? (
            <>
              <Skeleton className="h-14 w-full rounded-xl" />
              <Skeleton className="h-40 w-full" />
              <div className="grid gap-3 md:grid-cols-2">
                {Array.from({ length: 2 }).map((_, i) => (
                  <Skeleton key={i} className="h-48 w-full" />
                ))}
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-28 w-full" />
                ))}
              </div>
            </>
          ) : query.isError ? (
            <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-6 text-sm text-destructive">
              {query.error instanceof Error ? query.error.message : "Something went wrong."}
            </div>
          ) : query.data ? (
            <>
              {/* ① Scores inline bar */}
              <ScoreSummaryBar scorecard={query.data.scorecard} keyword={q} extractedRatings={query.data.extractedRatings} />

              {/* ② Action report — the "what to do" summary */}
              <ActionReport items={query.data.items} />

              {/* ③ Compact charts + themes side by side */}
              <div className="grid gap-4 md:grid-cols-3">
                <div className="md:col-span-2">
                  <DashboardStats scorecard={query.data.scorecard} items={query.data.items} compact />
                </div>
                <div>
                  <TopThemes scorecard={query.data.scorecard} />
                </div>
              </div>

              {Object.keys(query.data.errors).length > 0 && (
                <div className="rounded-lg border border-warn/40 bg-warn/10 p-3 text-xs text-foreground/70">
                  Some sources returned no results:{" "}
                  {Object.entries(query.data.errors)
                    .map(([s]) => SOURCE_LABELS[s as SourceId])
                    .join(", ")}
                </div>
              )}

              {/* ④ Detailed feedback — scroll-to area */}
              <div id="feedback-detail">
                <div className="mb-3 flex items-center gap-2">
                  <h2 className="text-sm font-semibold text-foreground">Detailed Feedback</h2>
                  <span className="text-xs text-muted-foreground">— filtered &amp; classified by source</span>
                </div>
                <FilterBar
                  sources={sourceList}
                  activeSources={activeSources}
                  toggleSource={(s) => {
                    setActiveSources((cur) => {
                      const next = new Set(cur);
                      if (next.has(s)) next.delete(s);
                      else next.add(s);
                      return next;
                    });
                  }}
                  themes={query.data.scorecard.themes}
                  themeFilter={themeFilter}
                  setThemeFilter={setThemeFilter}
                  query={textQ}
                  setQuery={setTextQ}
                  shown={filteredItems.length}
                  total={query.data.items.length}
                />
                <div className="mt-3">
                  <FeedbackSections items={filteredItems} />
                </div>
              </div>
            </>
          ) : null}
        </div>
        {/* hide unused */}
        <span className="hidden">{navigate.length}</span>
      </div>
    </AppShell>
    {query.data && (
      <div
        style={{ position: "fixed", bottom: "1.25rem", right: "1.25rem", zIndex: 9999 }}
        className="flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50 px-3 py-1.5 text-[11px] font-medium shadow-md"
      >
        <Zap className="h-3 w-3 text-amber-500" />
        <span className="text-amber-800">
          {query.data.creditsUsed} used
          {query.data.creditsRemaining != null && (
            <> · {query.data.creditsRemaining} remaining</>
          )}
        </span>
      </div>
    )}
    </>
  );
}