import { ExternalLink, Info, Star, TrendingDown, TrendingUp, Minus } from "lucide-react";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { getRatings } from "@/lib/feedback/known-ratings";
import type { ExtractedRatings, Scorecard } from "@/lib/feedback/types";

function MiniStars({ score, color }: { score: number; color: string }) {
  const filled = Math.round(score);
  return (
    <span className="inline-flex items-center gap-0.5" style={{ color }}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} className="h-3 w-3" fill={i < filled ? "currentColor" : "none"} strokeWidth={1.5} />
      ))}
    </span>
  );
}

function TrendIcon({ trend }: { trend: Scorecard["trend"] }) {
  if (trend === "rising") return <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />;
  if (trend === "falling") return <TrendingDown className="h-3.5 w-3.5 text-red-500" />;
  return <Minus className="h-3.5 w-3.5 text-muted-foreground" />;
}

const SCORE_COLOR = (s: number) =>
  s >= 65 ? "text-emerald-600" : s <= 40 ? "text-red-500" : "text-amber-600";

export function ScoreSummaryBar({ scorecard, keyword, extractedRatings }: { scorecard: Scorecard; keyword: string; extractedRatings?: ExtractedRatings }) {
  const known = getRatings(keyword);

  const platforms = [
    {
      key: "g2" as const,
      label: "G2",
      color: "#FF492C",
      score: known?.g2 ?? extractedRatings?.g2 ?? null,
      url: known?.g2Url ?? extractedRatings?.g2Url ?? `https://www.g2.com/search?q=${encodeURIComponent(keyword)}`,
    },
    {
      key: "capterra" as const,
      label: "Capterra",
      color: "#3E86F5",
      score: known?.capterra ?? extractedRatings?.capterra ?? null,
      url: known?.capterraUrl ?? extractedRatings?.capterraUrl ?? `https://www.capterra.com/search/?query=${encodeURIComponent(keyword)}`,
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-px rounded-xl border border-border/60 bg-card overflow-hidden divide-x divide-border/60">
      {/* Sentiment score */}
      <div className="flex items-center gap-2.5 px-5 py-3.5">
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Sentiment
            </span>
            <Popover>
              <PopoverTrigger asChild>
                <button className="text-muted-foreground hover:text-foreground transition-colors" aria-label="How is this score calculated?">
                  <Info className="h-3 w-3" />
                </button>
              </PopoverTrigger>
              <PopoverContent side="bottom" align="start" className="w-72 text-xs space-y-2 p-4">
                <p className="font-semibold text-sm">How the score is calculated</p>
                <p className="text-muted-foreground leading-relaxed">Each item is weighted by <strong>source trust</strong> (G2 & Capterra = 2×, Reddit = 0.8×) and <strong>sentiment strength</strong>:</p>
                <ul className="space-y-1 text-muted-foreground">
                  <li>🟢 Positive high-impact (e.g. "game-changer"): 1.5×</li>
                  <li>🟡 Positive low: 1.0× · ⚪ Neutral: 0.5×</li>
                  <li>🟠 Negative minor: 1.0× · 🔴 Major bug: 1.5×</li>
                  <li>🚨 Critical (outage/data loss): 2.0×</li>
                </ul>
                <p className="text-muted-foreground">Formula: <code className="bg-muted px-1 rounded">50 + (pos − neg) ÷ total × 50</code>. Always 0–100. Score 50 = neutral; above 65 = rising, below 40 = falling.</p>
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className={`font-serif text-2xl font-semibold ${SCORE_COLOR(scorecard.score)}`}>
              {scorecard.score}
            </span>
            <span className="text-xs text-muted-foreground">/ 100</span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <TrendIcon trend={scorecard.trend} />
          <span className="capitalize">{scorecard.trend}</span>
        </div>
      </div>

      {/* Divider label */}
      <div className="px-3 py-3.5 self-stretch flex items-center">
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground/60 rotate-0">
          Platform Ratings
        </span>
      </div>

      {/* G2 + Capterra */}
      {platforms.map((p) => (
        <a
          key={p.key}
          href={p.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-3 px-5 py-3.5 hover:bg-muted/40 transition-colors"
        >
          <div className="flex flex-col">
            <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: p.color }}>
              {p.label}
            </span>
            {p.score !== null ? (
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="font-serif text-2xl font-semibold text-foreground">
                  {p.score.toFixed(1)}
                </span>
                <span className="text-xs text-muted-foreground">/ 5</span>
              </div>
            ) : (
              <span className="font-serif text-xl text-muted-foreground mt-0.5">—</span>
            )}
          </div>
          {p.score !== null && <MiniStars score={p.score} color={p.color} />}
          <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-60 transition-opacity ml-1" />
        </a>
      ))}

      {/* Item counts */}
      <div className="flex items-center gap-4 px-5 py-3.5 ml-auto">
        <div className="text-center">
          <div className="font-serif text-lg font-medium text-foreground">{scorecard.total}</div>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Items</div>
        </div>
        <div className="text-center">
          <div className="font-serif text-lg font-medium text-red-500">
            {scorecard.negativePct}%
          </div>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Negative</div>
        </div>
        <div className="text-center">
          <div className="font-serif text-lg font-medium text-emerald-600">
            {scorecard.positivePct}%
          </div>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Positive</div>
        </div>
      </div>
    </div>
  );
}
