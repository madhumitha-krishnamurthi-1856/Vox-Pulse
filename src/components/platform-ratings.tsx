import { Star, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";

interface PlatformRating {
  platform: "G2" | "Capterra" | "Trustpilot";
  score: number | null;
  maxScore: number;
  reviewCount: number | null;
  url: string;
  color: string;
}

const PLATFORM_META: PlatformRating[] = [
  {
    platform: "G2",
    score: null,
    maxScore: 5,
    reviewCount: null,
    url: "https://www.g2.com",
    color: "#FF492C",
  },
  {
    platform: "Capterra",
    score: null,
    maxScore: 5,
    reviewCount: null,
    url: "https://www.capterra.com",
    color: "#3E86F5",
  },
  {
    platform: "Trustpilot",
    score: null,
    maxScore: 5,
    reviewCount: null,
    url: "https://www.trustpilot.com",
    color: "#00B67A",
  },
];

function StarRating({ score, max }: { score: number; max: number }) {
  const filled = Math.round((score / max) * 5);
  return (
    <div className="flex items-center gap-0.5">
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

interface Props {
  keyword: string;
  ratings?: { g2?: number | null; capterra?: number | null; trustpilot?: number | null };
  reviewCounts?: { g2?: number | null; capterra?: number | null; trustpilot?: number | null };
}

export function PlatformRatings({ keyword, ratings = {}, reviewCounts = {} }: Props) {
  const platforms = PLATFORM_META.map((p) => {
    const key = p.platform.toLowerCase() as "g2" | "capterra" | "trustpilot";
    return {
      ...p,
      score: ratings[key] ?? null,
      reviewCount: reviewCounts[key] ?? null,
      url: `https://www.${key === "g2" ? "g2.com" : key === "capterra" ? "capterra.com" : "trustpilot.com"}/search?q=${encodeURIComponent(keyword)}`,
    };
  });

  return (
    <Card className="border-border/70 bg-card p-5">
      <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        Platform Ratings
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        Official scores from major review platforms for <span className="font-medium text-foreground">{keyword}</span>
      </p>
      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {platforms.map((p) => (
          <a
            key={p.platform}
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex flex-col gap-2 rounded-lg border border-border/60 bg-muted/30 p-4 transition-colors hover:bg-muted/60"
          >
            <div className="flex items-center justify-between">
              <span
                className="text-sm font-semibold"
                style={{ color: p.color }}
              >
                {p.platform}
              </span>
              <ExternalLink className="h-3.5 w-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
            </div>

            {p.score !== null ? (
              <>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-serif text-3xl font-medium text-foreground">
                    {p.score.toFixed(1)}
                  </span>
                  <span className="text-xs text-muted-foreground">/ {p.maxScore}</span>
                </div>
                <div style={{ color: p.color }}>
                  <StarRating score={p.score} max={p.maxScore} />
                </div>
                {p.reviewCount !== null && (
                  <span className="text-[11px] text-muted-foreground">
                    {p.reviewCount.toLocaleString()} reviews
                  </span>
                )}
              </>
            ) : (
              <div className="flex flex-col gap-1.5">
                <div className="h-8 w-16 animate-pulse rounded bg-muted" />
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }, (_, i) => (
                    <div key={i} className="h-3.5 w-3.5 animate-pulse rounded-sm bg-muted" />
                  ))}
                </div>
                <span className="text-[11px] text-muted-foreground">
                  Search on {p.platform} →
                </span>
              </div>
            )}
          </a>
        ))}
      </div>
    </Card>
  );
}
