import {
  Bar,
  BarChart,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { TrendingDown, TrendingUp, Minus } from "lucide-react";
import { useEffect, useState } from "react";

import { Card } from "@/components/ui/card";
import {
  CATEGORY_LABELS,
  SOURCE_LABELS,
  type FeedbackItem,
  type Scorecard,
  type SourceId,
} from "@/lib/feedback/types";

// Recharts writes the SVG `fill` attribute directly; many browsers will not
// resolve `var(--token)` or `color-mix(...)` from inside an SVG presentation
// attribute, so the chart renders blank. Read the resolved values once on
// mount and feed literal color strings to recharts.
const FALLBACK = {
  primary: "#5b4ee0",
  positive: "#1f9d6d",
  negative: "#dc4b3e",
  warn: "#e5a533",
  muted: "#eef0f4",
  mutedFg: "#6b7280",
  border: "#e4e7ec",
};

function useThemeColors() {
  const [c, setC] = useState(FALLBACK);
  useEffect(() => {
    const s = getComputedStyle(document.documentElement);
    const read = (k: string, f: string) => {
      const v = s.getPropertyValue(k).trim();
      return v || f;
    };
    setC({
      primary: read("--primary", FALLBACK.primary),
      positive: read("--positive", FALLBACK.positive),
      negative: read("--negative", FALLBACK.negative),
      warn: read("--warn", FALLBACK.warn),
      muted: read("--muted", FALLBACK.muted),
      mutedFg: read("--muted-foreground", FALLBACK.mutedFg),
      border: read("--border", FALLBACK.border),
    });
  }, []);
  return c;
}

function mix(a: string, b: string, pct: number) {
  // CSS color-mix is broadly supported in modern Chromium/Safari/Firefox.
  return `color-mix(in oklab, ${a} ${pct}%, ${b})`;
}

function StatCard({
  label,
  children,
  tone = "default",
}: {
  label: string;
  children: React.ReactNode;
  tone?: "default" | "score";
}) {
  return (
    <Card
      className={`relative overflow-hidden border-border/70 p-5 ${
        tone === "score" ? "bg-score-bg" : "bg-card"
      }`}
    >
      <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </div>
      <div className="mt-3">{children}</div>
    </Card>
  );
}

function trendIcon(t: Scorecard["trend"]) {
  if (t === "rising") return <TrendingUp className="h-3.5 w-3.5 text-positive" />;
  if (t === "falling") return <TrendingDown className="h-3.5 w-3.5 text-negative" />;
  return <Minus className="h-3.5 w-3.5 text-muted-foreground" />;
}

export function DashboardStats({
  scorecard,
  items,
}: {
  scorecard: Scorecard;
  items: FeedbackItem[];
}) {
  const c = useThemeColors();
  const breakdown = [
    { name: "Critical", value: items.filter((i) => i.severity === "critical").length, fill: c.negative },
    { name: "Major", value: items.filter((i) => i.severity === "major").length, fill: mix(c.negative, "white", 70) },
    { name: "Minor", value: items.filter((i) => i.severity === "minor").length, fill: c.warn },
    { name: "Pos. high", value: items.filter((i) => i.impact === "high").length, fill: c.positive },
    { name: "Pos. low", value: items.filter((i) => i.impact === "low").length, fill: mix(c.positive, "white", 50) },
  ].filter((d) => d.value > 0);

  const volume = (Object.entries(scorecard.bySource) as [SourceId, number][])
    .filter(([, n]) => n > 0)
    .map(([s, n]) => ({ source: SOURCE_LABELS[s], count: n }));

  // Lightweight trend: split items into 6 buckets by order, score per bucket
  const buckets = 6;
  const trendData =
    items.length > 0
      ? Array.from({ length: buckets }, (_, i) => {
          const slice = items.slice(
            Math.floor((i / buckets) * items.length),
            Math.floor(((i + 1) / buckets) * items.length),
          );
          if (slice.length === 0) return { x: i + 1, score: scorecard.score };
          const pos = slice.filter((s) => s.sentiment === "positive").length;
          const neg = slice.filter((s) => s.sentiment === "negative").length;
          const score = Math.round(50 + ((pos - neg) / slice.length) * 50);
          return { x: i + 1, score: Math.max(0, Math.min(100, score)) };
        })
      : [];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      <StatCard label="Sentiment Score" tone="score">
        <div className="flex items-baseline gap-2">
          <div className="font-serif text-5xl font-semibold text-positive">
            {scorecard.score}
          </div>
          <div className="text-sm text-muted-foreground">/ 100</div>
        </div>
        <div className="mt-1 flex items-center gap-1.5 text-sm font-medium capitalize text-foreground/80">
          {trendIcon(scorecard.trend)} {scorecard.trend}
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Weighted by severity & impact across {scorecard.total} feedback item{scorecard.total === 1 ? "" : "s"}.
        </p>
        <div className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
          {trendIcon(scorecard.trend)}
          <span className={scorecard.delta >= 0 ? "text-positive" : "text-negative"}>
            {scorecard.delta >= 0 ? "+" : ""}
            {scorecard.delta}
          </span>{" "}
          vs baseline
        </div>
        <hr className="my-4 border-border" />
        <div className="grid grid-cols-3 gap-3">
          <div>
            <div className="font-serif text-2xl">{scorecard.total}</div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Total</div>
          </div>
          <div>
            <div className="font-serif text-2xl text-negative">
              {items.filter((i) => i.sentiment === "negative").length}
            </div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Negative</div>
          </div>
          <div>
            <div className="font-serif text-2xl text-positive">
              {items.filter((i) => i.sentiment === "positive").length}
            </div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Positive</div>
          </div>
        </div>
      </StatCard>

      <StatCard label="Breakdown">
        <div className="h-[200px]">
          {breakdown.length === 0 ? (
            <div className="grid h-full place-items-center text-xs text-muted-foreground">
              No data
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={breakdown}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={50}
                  outerRadius={85}
                  paddingAngle={2}
                  stroke="none"
                >
                  {breakdown.map((d, i) => (
                    <Cell key={i} fill={d.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: 8,
                    border: `1px solid ${c.border}`,
                    fontSize: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[11px]">
          {breakdown.map((d) => (
            <span key={d.name} className="inline-flex items-center gap-1.5">
              <span
                className="h-2 w-2 rounded-full"
                style={{ background: d.fill }}
              />
              <span className="text-muted-foreground">{d.name}</span>
              <span className="font-medium">{d.value}</span>
            </span>
          ))}
        </div>
      </StatCard>

      <StatCard label="Volume by Source">
        <div className="h-[240px]">
          {volume.length === 0 ? (
            <div className="grid h-full place-items-center text-xs text-muted-foreground">
              No data
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={volume} margin={{ top: 10, right: 8, left: -18, bottom: 28 }}>
                <XAxis
                  dataKey="source"
                  tick={{ fontSize: 10, fill: c.mutedFg }}
                  axisLine={false}
                  tickLine={false}
                  interval={0}
                  angle={-30}
                  textAnchor="end"
                  height={40}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: c.mutedFg }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                  width={28}
                />
                <Tooltip
                  cursor={{ fill: c.muted }}
                  contentStyle={{
                    borderRadius: 8,
                    border: `1px solid ${c.border}`,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="count" fill={c.primary} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </StatCard>

      <StatCard label="Sentiment Over Time">
        <div className="h-[240px]">
          {trendData.length === 0 ? (
            <div className="grid h-full place-items-center text-xs text-muted-foreground">
              No data
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 10, right: 12, left: -10, bottom: 8 }}>
                <XAxis dataKey="x" hide />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 10, fill: c.mutedFg }}
                  axisLine={false}
                  tickLine={false}
                  width={28}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 8,
                    border: `1px solid ${c.border}`,
                    fontSize: 12,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke={c.primary}
                  strokeWidth={2}
                  dot={{ r: 3, fill: c.primary }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </StatCard>
    </div>
  );
}

export function TopThemes({ scorecard }: { scorecard: Scorecard }) {
  if (scorecard.themes.length === 0) return null;
  return (
    <Card className="border-border/70 bg-card p-5">
      <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        Top Themes
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {scorecard.themes.map((t) => (
          <span
            key={t.category}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-muted px-3 py-1.5 text-sm"
          >
            <span className="font-medium">{CATEGORY_LABELS[t.category]}</span>
            <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-foreground px-1.5 text-[10px] font-semibold text-background">
              {t.count}
            </span>
          </span>
        ))}
      </div>
    </Card>
  );
}