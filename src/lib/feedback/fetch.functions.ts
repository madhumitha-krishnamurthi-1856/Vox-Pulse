import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { classifyItem } from "./classify";
import {
  ALL_SOURCES,
  SOURCE_DOMAINS,
  type Category,
  type FeedbackItem,
  type FetchFeedbackResult,
  type RawFeedbackItem,
  type Scorecard,
  type SourceId,
  type Timeframe,
} from "./types";

const inputSchema = z.object({
  keyword: z.string().trim().min(2).max(120),
  sources: z
    .array(
      z.enum([
        "reddit",
        "g2",
        "capterra",
        "trustpilot",
        "bluesky",
        "hackernews",
      ]),
    )
    .min(1),
  timeframe: z.enum(["day", "week", "month", "year", "all"]).default("month"),
  perSourceLimit: z.number().int().min(1).max(15).default(8),
});

function tbsFor(timeframe: Timeframe): string | undefined {
  switch (timeframe) {
    case "day":
      return "qdr:d";
    case "week":
      return "qdr:w";
    case "month":
      return "qdr:m";
    case "year":
      return "qdr:y";
    default:
      return undefined;
  }
}

interface FirecrawlSearchResult {
  url?: string;
  title?: string;
  description?: string;
  markdown?: string;
}

// URL segments that indicate non-review pages (comparisons, directories, ads, etc.)
const IRRELEVANT_URL_SEGMENTS: Record<string, string[]> = {
  g2: ["/compare/", "/categories/", "/search", "/alternatives/", "/competitors/", "/vs/", "/sponsored/"],
  capterra: ["/directory/", "/compare/", "/alternatives/", "/research/", "/categories/", "/search"],
  trustpilot: ["/categories/", "/search/", "/blog/", "/business/"],
};

// Returns false if the result is clearly about a different product (keyword barely mentioned)
function isRelevantResult(source: SourceId, keyword: string, url: string, title: string, snippet: string): boolean {
  const kw = keyword.toLowerCase();
  const titleL = title.toLowerCase();
  const snippetL = snippet.toLowerCase();
  const urlL = url.toLowerCase();

  // Drop known irrelevant URL patterns for this source
  const badSegments = IRRELEVANT_URL_SEGMENTS[source] ?? [];
  if (badSegments.some((seg) => urlL.includes(seg))) return false;

  // G2/Capterra: drop pages where the title is clearly about a different product
  // (keyword appears only in snippet, and title mentions another product with "reviews")
  if (source === "g2" || source === "capterra") {
    const titleHasKeyword = titleL.includes(kw);
    const titleHasReviews = titleL.includes("review");
    // Title is a review page for something else — keyword only appears in passing
    if (titleHasReviews && !titleHasKeyword) return false;
    // Drop comparison titles like "X vs Y" where keyword is just Y
    if ((titleL.includes(" vs ") || titleL.includes(" versus ")) && !titleL.startsWith(kw)) return false;
    // Drop "alternatives to X" pages
    if (titleL.includes("alternative") || titleL.includes("competitor")) return false;
  }

  // Ensure keyword actually appears in title or snippet
  if (!titleL.includes(kw) && !snippetL.includes(kw)) return false;

  return true;
}

function buildSourceQuery(source: SourceId, keyword: string): string {
  // For review sites, add "review" to the query to surface review pages over comparisons
  if (source === "g2") return `site:g2.com "${keyword}" review`;
  if (source === "capterra") return `site:capterra.com "${keyword}" review`;
  if (source === "trustpilot") return `site:trustpilot.com "${keyword}"`;
  return `site:${SOURCE_DOMAINS[source]} "${keyword}"`;
}

async function searchSource(
  source: SourceId,
  keyword: string,
  timeframe: Timeframe,
  perSourceLimit: number,
  apiKey: string,
): Promise<RawFeedbackItem[]> {
  // Fetch more than needed so we have room to filter irrelevant results
  const fetchLimit = Math.min(perSourceLimit * 2, 15);
  const body: Record<string, unknown> = {
    query: buildSourceQuery(source, keyword),
    limit: fetchLimit,
    sources: ["web"],
  };
  const tbs = tbsFor(timeframe);
  if (tbs) body.tbs = tbs;

  const res = await fetch("https://api.firecrawl.dev/v2/search", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Firecrawl ${res.status}: ${text.slice(0, 200)}`);
  }

  const json = (await res.json()) as {
    data?: { web?: FirecrawlSearchResult[] } | FirecrawlSearchResult[];
  };

  const raw = Array.isArray(json.data)
    ? json.data
    : (json.data?.web ?? []);

  return raw
    .filter((r) => {
      if (!r.url || (!r.title && !r.description)) return false;
      const title = r.title ?? "";
      const snippet = r.description ?? r.markdown ?? "";
      return isRelevantResult(source, keyword, r.url, title, snippet);
    })
    .slice(0, perSourceLimit)
    .map<RawFeedbackItem>((r) => ({
      source,
      url: r.url!,
      title: (r.title ?? "").slice(0, 200),
      snippet: (r.description ?? r.markdown ?? "").slice(0, 600),
    }));
}

async function fetchCreditsRemaining(apiKey: string): Promise<number | null> {
  try {
    const res = await fetch("https://api.firecrawl.dev/v1/credits", {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { credits?: number };
    return json.credits ?? null;
  } catch { return null; }
}

const FIRECRAWL_SOURCES: SourceId[] = ["g2", "capterra", "trustpilot", "reddit"];

const BSKY_UA =
  "Mozilla/5.0 (compatible; VoxPulseBot/1.0; +https://voxpuls.lovable.app)";

function timeframeCutoffMs(timeframe: Timeframe): number | null {
  const now = Date.now();
  switch (timeframe) {
    case "day": return now - 24 * 60 * 60 * 1000;
    case "week": return now - 7 * 24 * 60 * 60 * 1000;
    case "month": return now - 30 * 24 * 60 * 60 * 1000;
    case "year": return now - 365 * 24 * 60 * 60 * 1000;
    default: return null;
  }
}

interface BlueskyPost {
  uri: string;
  author?: { handle?: string; displayName?: string };
  record?: { text?: string; createdAt?: string };
  indexedAt?: string;
}

async function searchBluesky(
  keyword: string,
  timeframe: Timeframe,
  limit: number,
): Promise<RawFeedbackItem[]> {
  const url = new URL(
    "https://public.api.bsky.app/xrpc/app.bsky.feed.searchPosts",
  );
  url.searchParams.set("q", keyword);
  url.searchParams.set("limit", String(Math.min(Math.max(limit, 1), 25)));
  url.searchParams.set("sort", "latest");
  const res = await fetch(url.toString(), {
    headers: {
      Accept: "application/json",
      "User-Agent": BSKY_UA,
    },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Bluesky ${res.status}: ${text.slice(0, 200)}`);
  }
  const json = (await res.json()) as { posts?: BlueskyPost[] };
  const cutoff = timeframeCutoffMs(timeframe);
  return (json.posts ?? [])
    .filter((p) => {
      if (!cutoff) return true;
      const t = p.indexedAt ? Date.parse(p.indexedAt) : NaN;
      return isNaN(t) ? true : t >= cutoff;
    })
    .map<RawFeedbackItem | null>((p) => {
      const handle = p.author?.handle;
      const rkey = p.uri.split("/").pop();
      if (!handle || !rkey) return null;
      const text = (p.record?.text ?? "").trim();
      if (!text) return null;
      const displayName = p.author?.displayName ?? handle;
      return {
        source: "bluesky",
        url: `https://bsky.app/profile/${handle}/post/${rkey}`,
        title: `@${handle}${displayName !== handle ? ` (${displayName})` : ""}`.slice(0, 200),
        snippet: text.slice(0, 600),
      };
    })
    .filter((x): x is RawFeedbackItem => x !== null);
}

interface HnHit {
  objectID: string;
  title?: string | null;
  story_title?: string | null;
  url?: string | null;
  comment_text?: string | null;
  story_text?: string | null;
  author?: string;
  points?: number | null;
  num_comments?: number | null;
  _tags?: string[];
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

async function searchHackerNews(
  keyword: string,
  timeframe: Timeframe,
  limit: number,
): Promise<RawFeedbackItem[]> {
  const url = new URL("https://hn.algolia.com/api/v1/search");
  url.searchParams.set("query", keyword);
  url.searchParams.set("tags", "(story,comment)");
  url.searchParams.set("hitsPerPage", String(Math.min(Math.max(limit, 1), 25)));
  const cutoff = timeframeCutoffMs(timeframe);
  if (cutoff) {
    url.searchParams.set(
      "numericFilters",
      `created_at_i>${Math.floor(cutoff / 1000)}`,
    );
  }
  const res = await fetch(url.toString(), {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Hacker News ${res.status}: ${text.slice(0, 200)}`);
  }
  const json = (await res.json()) as { hits?: HnHit[] };
  return (json.hits ?? [])
    .map<RawFeedbackItem | null>((h) => {
      const isComment = (h._tags ?? []).includes("comment");
      const title = (h.title ?? h.story_title ?? "").trim();
      const bodyHtml = isComment ? h.comment_text ?? "" : h.story_text ?? "";
      const body = stripHtml(bodyHtml);
      const displayTitle = isComment
        ? `Comment on: ${title || "HN thread"}`
        : title;
      const snippet = body || title;
      if (!displayTitle || !snippet) return null;
      const itemUrl = `https://news.ycombinator.com/item?id=${h.objectID}`;
      return {
        source: "hackernews",
        url: itemUrl,
        title: displayTitle.slice(0, 200),
        snippet: snippet.slice(0, 600),
      };
    })
    .filter((x): x is RawFeedbackItem => x !== null);
}

interface RedditPost {
  data: {
    id: string;
    title?: string;
    selftext?: string;
    url?: string;
    permalink?: string;
    subreddit?: string;
    created_utc?: number;
  };
}

function redditTimeframe(timeframe: Timeframe): string {
  switch (timeframe) {
    case "day": return "day";
    case "week": return "week";
    case "month": return "month";
    case "year": return "year";
    default: return "all";
  }
}

async function searchReddit(
  keyword: string,
  timeframe: Timeframe,
  limit: number,
): Promise<RawFeedbackItem[]> {
  const url = new URL("https://www.reddit.com/search.json");
  url.searchParams.set("q", keyword);
  url.searchParams.set("sort", "new");
  url.searchParams.set("t", redditTimeframe(timeframe));
  url.searchParams.set("limit", String(Math.min(Math.max(limit, 1), 25)));
  url.searchParams.set("type", "link");

  const res = await fetch(url.toString(), {
    headers: {
      Accept: "application/json",
      "User-Agent": "vox-pulse/1.0",
    },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Reddit ${res.status}: ${text.slice(0, 200)}`);
  }
  const json = (await res.json()) as { data?: { children?: RedditPost[] } };
  return (json.data?.children ?? [])
    .map<RawFeedbackItem | null>((child) => {
      const p = child.data;
      if (!p.id) return null;
      const permalink = p.permalink
        ? `https://www.reddit.com${p.permalink}`
        : `https://www.reddit.com/search/?q=${encodeURIComponent(keyword)}`;
      const title = (p.title ?? "").trim();
      const snippet = (p.selftext ?? p.title ?? "").trim();
      if (!title) return null;
      return {
        source: "reddit" as SourceId,
        url: permalink,
        title: title.slice(0, 200),
        snippet: snippet.slice(0, 600),
      };
    })
    .filter((x): x is RawFeedbackItem => x !== null);
}

const SOURCE_WEIGHT: Record<SourceId, number> = {
  g2: 2.0,
  capterra: 2.0,
  reddit: 0.8,
  trustpilot: 1.5,
  bluesky: 1.0,
  hackernews: 1.3,
};

function buildScorecard(items: FeedbackItem[]): Scorecard {
  const total = items.length;
  const bySource = ALL_SOURCES.reduce(
    (acc, s) => {
      acc[s] = 0;
      return acc;
    },
    {} as Record<SourceId, number>,
  );
  const catCount: Record<Category, number> = {
    bug: 0,
    feature_request: 0,
    praise: 0,
    complaint: 0,
    question: 0,
    other: 0,
  };
  let pos = 0;
  let neu = 0;
  let neg = 0;
  for (const it of items) {
    bySource[it.source] += 1;
    catCount[it.category] += 1;
    if (it.sentiment === "positive") pos += 1;
    else if (it.sentiment === "negative") neg += 1;
    else neu += 1;
  }
  const safe = total || 1;
  const topCategory = (Object.entries(catCount) as [Category, number][])
    .filter(([k]) => k !== "other")
    .sort((a, b) => b[1] - a[1])[0];
  const themes = (Object.entries(catCount) as [Category, number][])
    .filter(([k, v]) => k !== "other" && v > 0)
    .sort((a, b) => b[1] - a[1])
    .map(([category, count]) => ({ category, count }));
  // Ratio-based score: net/span is always [-1,+1] so score is always [0,100]
  let weightedPos = 0, weightedNeg = 0, weightedNeu = 0;
  for (const it of items) {
    const w = SOURCE_WEIGHT[it.source] ?? 1.0;
    if (it.sentiment === "positive") weightedPos += w * (it.impact === "high" ? 1.5 : 1.0);
    else if (it.sentiment === "negative") weightedNeg += w * (it.severity === "critical" ? 2.0 : it.severity === "major" ? 1.5 : 1.0);
    else weightedNeu += w * 0.5;
  }
  const span = weightedPos + weightedNeg + weightedNeu || 1;
  const score = Math.max(0, Math.min(100, Math.round(50 + ((weightedPos - weightedNeg) / span) * 50)));
  return {
    total,
    positivePct: Math.round((pos / safe) * 100),
    neutralPct: Math.round((neu / safe) * 100),
    negativePct: Math.round((neg / safe) * 100),
    topCategory: topCategory && topCategory[1] > 0 ? topCategory[0] : null,
    bySource,
    score,
    trend: score >= 65 ? "rising" : score <= 40 ? "falling" : "stable",
    delta: score - 50,
    themes,
  };
}

export const fetchFeedback = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => inputSchema.parse(input))
  .handler(async ({ data }): Promise<FetchFeedbackResult> => {
    const needsFirecrawl = data.sources.some((s) => FIRECRAWL_SOURCES.includes(s));
    const apiKey = process.env.FIRECRAWL_API_KEY ?? "";
    if (needsFirecrawl && !apiKey) {
      throw new Error("FIRECRAWL_API_KEY is not configured");
    }

    const errors: Partial<Record<SourceId, string>> = {};
    const [results, creditsRemaining] = await Promise.all([
      Promise.all(
        data.sources.map(async (source) => {
          try {
            if (source === "bluesky") {
              return await searchBluesky(data.keyword, data.timeframe, data.perSourceLimit);
            }
            if (source === "hackernews") {
              return await searchHackerNews(data.keyword, data.timeframe, data.perSourceLimit);
            }
            if (source === "reddit") {
              return await searchReddit(data.keyword, data.timeframe, data.perSourceLimit);
            }
            return await searchSource(
              source,
              data.keyword,
              data.timeframe,
              data.perSourceLimit,
              apiKey,
            );
          } catch (err) {
            console.error(`[fetchFeedback] ${source} failed`, err);
            errors[source] = err instanceof Error ? err.message : String(err);
            return [] as RawFeedbackItem[];
          }
        }),
      ),
      apiKey ? fetchCreditsRemaining(apiKey) : Promise.resolve(null),
    ]);

    const items: FeedbackItem[] = results.flat().map((raw, idx) => {
      const c = classifyItem(raw);
      return {
        ...raw,
        id: `${raw.source}-${idx}-${raw.url.slice(0, 32)}`,
        category: c.category,
        sentiment: c.sentiment,
        severity: c.severity,
        impact: c.impact,
        reason: c.reason,
      };
    });

    return {
      items,
      scorecard: buildScorecard(items),
      errors,
      creditsUsed:
        data.sources.filter((s) => FIRECRAWL_SOURCES.includes(s)).length *
        data.perSourceLimit,
      creditsRemaining,
    };
  });