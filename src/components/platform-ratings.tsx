import { ExternalLink, Star } from "lucide-react";

import { Card } from "@/components/ui/card";
import { getRatings } from "@/lib/feedback/known-ratings";

function StarRating({ score, color }: { score: number; color: string }) {
  const filled = Math.round(score);
  return (
    <div className="flex items-center gap-0.5" style={{ color }}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className="h-3.5 w-3.5"
          fill={i < filled ? "currentColor" : "none"}
          strokeWidth={1.5}
        />
      ))}
    </div>
  );
}

const PLATFORMS = [
  { key: "g2" as const, label: "G2", color: "#FF492C" },
  { key: "capterra" as const, label: "Capterra", color: "#3E86F5" },
];

export function PlatformRatings({ keyword }: { keyword: string }) {
  const ratings = getRatings(keyword);

  return (
    <Card className="border-border/70 bg-card p-5">
      <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        Platform Ratings
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        Official scores from major review platforms for{" "}
        <span className="font-medium text-foreground">{keyword}</span>
      </p>
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {PLATFORMS.map((p) => {
          const score = ratings?.[p.key] ?? null;
          const reviewCount = ratings?.[`${p.key}ReviewCount` as keyof typeof ratings] as number | null ?? null;
          const url = ratings?.[`${p.key}Url` as keyof typeof ratings] as string
            ?? `https://www.${p.key === "g2" ? "g2.com/search?q=" : "capterra.com/search/?query="}${encodeURIComponent(keyword)}`;

          return (
            <a
              key={p.key}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col gap-2 rounded-lg border border-border/60 bg-muted/30 p-4 transition-colors hover:bg-muted/60"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold" style={{ color: p.color }}>
                  {p.label}
                </span>
                <ExternalLink className="h-3.5 w-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
              </div>

              {score !== null ? (
                <>
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-serif text-3xl font-medium text-foreground">
                      {score.toFixed(1)}
                    </span>
                    <span className="text-xs text-muted-foreground">/ 5</span>
                  </div>
                  <StarRating score={score} color={p.color} />
                  {reviewCount !== null && (
                    <span className="text-[11px] text-muted-foreground">
                      {reviewCount.toLocaleString()} reviews
                    </span>
                  )}
                </>
              ) : (
                <div className="flex flex-col gap-1.5">
                  <span className="font-serif text-2xl text-muted-foreground">—</span>
                  <span className="text-[11px] text-muted-foreground">
                    Not listed · Search on {p.label} →
                  </span>
                </div>
              )}
            </a>
          );
        })}
      </div>
    </Card>
  );
}
