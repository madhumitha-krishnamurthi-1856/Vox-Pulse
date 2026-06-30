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
  sources: z.array(z.enum(["reddit", "twitter", "g2", "capterra", "trustpilot"])).min(1),
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

async function searchSource(
  source: SourceId,
  keyword: string,
  timeframe: Timeframe,
  perSourceLimit: number,
  apiKey: string,
): Promise<RawFeedbackItem[]> {
  const query = `site:${SOURCE_DOMAINS[source]} "${keyword}"`;
  const body: Record<string, unknown> = {
    query,
    limit: perSourceLimit,
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
    .filter((r) => r.url && (r.title || r.description))
    .map<RawFeedbackItem>((r) => ({
      source,
      url: r.url!,
      title: (r.title ?? "").slice(0, 200),
      snippet: (r.description ?? r.markdown ?? "").slice(0, 600),
    }));
}

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
  // Weighted score 0-100 (positives lift, negatives drag, severity matters)
  let raw = 50;
  for (const it of items) {
    if (it.sentiment === "positive") raw += it.impact === "high" ? 6 : 3;
    else if (it.sentiment === "negative")
      raw -= it.severity === "critical" ? 10 : it.severity === "major" ? 6 : 3;
  }
  const score = Math.max(0, Math.min(100, Math.round(raw)));
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
    const apiKey = process.env.FIRECRAWL_API_KEY;
    if (!apiKey) {
      throw new Error("FIRECRAWL_API_KEY is not configured");
    }

    const errors: Partial<Record<SourceId, string>> = {};
    const results = await Promise.all(
      data.sources.map(async (source) => {
        try {
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
    );

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
    };
  });