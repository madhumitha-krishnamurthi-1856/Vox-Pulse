import { AlertOctagon, AlertTriangle, Sparkles, TrendingDown, TrendingUp, Minus } from "lucide-react";

import { CATEGORY_LABELS, type FeedbackItem, type Scorecard } from "@/lib/feedback/types";

function trendIcon(t: Scorecard["trend"]) {
  if (t === "rising") return <TrendingUp className="h-4 w-4 text-positive" />;
  if (t === "falling") return <TrendingDown className="h-4 w-4 text-negative" />;
  return <Minus className="h-4 w-4 text-muted-foreground" />;
}

function scoreBg(score: number) {
  if (score >= 65) return "bg-positive/10 border-positive/30";
  if (score <= 40) return "bg-negative/10 border-negative/30";
  return "bg-warn/10 border-warn/30";
}

function scoreColor(score: number) {
  if (score >= 65) return "text-positive";
  if (score <= 40) return "text-negative";
  return "text-warn";
}

export function ExecutiveSummary({
  scorecard,
  items,
}: {
  scorecard: Scorecard;
  items: FeedbackItem[];
}) {
  const critical = items.filter((i) => i.severity === "critical").length;
  const major = items.filter((i) => i.severity === "major").length;
  const highPos = items.filter((i) => i.impact === "high").length;

  return (
    <div className="rounded-xl border border-border/70 bg-card/80 p-5">
      <div className="mb-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        Executive Summary
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">

        {/* Sentiment Score — hero cell */}
        <div className={`col-span-2 flex flex-col justify-between rounded-lg border p-4 sm:col-span-1 lg:col-span-2 ${scoreBg(scorecard.score)}`}>
          <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Sentiment Score
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`font-serif text-6xl font-semibold leading-none ${scoreColor(scorecard.score)}`}>
              {scorecard.score}
            </span>
            <span className="text-sm text-muted-foreground">/ 100</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-sm font-medium capitalize text-foreground/80">
            {trendIcon(scorecard.trend)}
            <span>{scorecard.trend}</span>
            <span className={`ml-1 text-xs font-semibold ${scorecard.delta >= 0 ? "text-positive" : "text-negative"}`}>
              ({scorecard.delta >= 0 ? "+" : ""}{scorecard.delta})
            </span>
          </div>
        </div>

        {/* Critical issues */}
        <div className={`flex flex-col justify-between rounded-lg border p-4 ${critical > 0 ? "border-negative/40 bg-negative/8" : "border-border/60 bg-muted/20"}`}>
          <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            <AlertOctagon className="h-3.5 w-3.5 text-negative" /> Critical
          </div>
          <div className={`mt-2 font-serif text-4xl font-semibold ${critical > 0 ? "text-negative" : "text-foreground"}`}>
            {critical}
          </div>
          <div className="mt-1 text-[11px] text-muted-foreground">
            {critical === 0 ? "None flagged" : critical === 1 ? "issue to escalate" : "issues to escalate"}
          </div>
        </div>

        {/* Major issues */}
        <div className="flex flex-col justify-between rounded-lg border border-border/60 bg-muted/20 p-4">
          <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            <AlertTriangle className="h-3.5 w-3.5 text-warn" /> Major
          </div>
          <div className="mt-2 font-serif text-4xl font-semibold text-foreground">{major}</div>
          <div className="mt-1 text-[11px] text-muted-foreground">
            {major === 0 ? "None flagged" : "to triage"}
          </div>
        </div>

        {/* Positive high-impact */}
        <div className="flex flex-col justify-between rounded-lg border border-border/60 bg-muted/20 p-4">
          <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-positive" /> Advocates
          </div>
          <div className="mt-2 font-serif text-4xl font-semibold text-positive">{highPos}</div>
          <div className="mt-1 text-[11px] text-muted-foreground">high-impact praise</div>
        </div>

        {/* Positive % */}
        <div className="flex flex-col justify-between rounded-lg border border-border/60 bg-muted/20 p-4">
          <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Positive
          </div>
          <div className="mt-2 font-serif text-4xl font-semibold text-positive">
            {scorecard.positivePct}%
          </div>
          <div className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
            <span className="text-negative">{scorecard.negativePct}%</span> negative
          </div>
        </div>

        {/* Top theme */}
        {scorecard.topCategory && (
          <div className="flex flex-col justify-between rounded-lg border border-border/60 bg-muted/20 p-4">
            <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Top Theme
            </div>
            <div className="mt-2 font-serif text-xl font-semibold text-primary">
              {CATEGORY_LABELS[scorecard.topCategory]}
            </div>
            <div className="mt-1 text-[11px] text-muted-foreground">
              {scorecard.total} total mentions
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
