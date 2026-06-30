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

import { Card } from "@/components/ui/card";
import {
  CATEGORY_LABELS,
  SOURCE_LABELS,
  type FeedbackItem,
  type Scorecard,
  type SourceId,
} from "@/lib/feedback/types";

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
  const breakdown = [
    { name: "Critical", value: items.filter((i) => i.severity === "critical").length, fill: "var(--negative)" },
    { name: "Major", value: items.filter((i) => i.severity === "major").length, fill: "color-mix(in oklab, var(--negative) 70%, white)" },
    { name: "Minor", value: items.filter((i) => i.severity === "minor").length, fill: "var(--warn)" },
    { name: "Pos. high", value: items.filter((i) => i.impact === "high").length, fill: "var(--positive)" },
    { name: "Pos. low", value: items.filter((i) => i.impact === "low").length, fill: "color-mix(in oklab, var(--positive) 50%, white)" },
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
        <div className="h-[180px]">
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
                  innerRadius={45}
                  outerRadius={75}
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
                    border: "1px solid var(--border)",
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
        <div className="h-[220px]">
          {volume.length === 0 ? (
            <div className="grid h-full place-items-center text-xs text-muted-foreground">
              No data
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={volume} margin={{ top: 10, right: 5, left: -20, bottom: 0 }}>
                <XAxis
                  dataKey="source"
                  tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  cursor={{ fill: "var(--muted)" }}
                  contentStyle={{
                    borderRadius: 8,
                    border: "1px solid var(--border)",
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="count" fill="var(--primary)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </StatCard>

      <StatCard label="Sentiment Over Time">
        <div className="h-[220px]">
          {trendData.length === 0 ? (
            <div className="grid h-full place-items-center text-xs text-muted-foreground">
              No data
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="x" hide />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 8,
                    border: "1px solid var(--border)",
                    fontSize: 12,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="var(--primary)"
                  strokeWidth={2}
                  dot={{ r: 3, fill: "var(--primary)" }}
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