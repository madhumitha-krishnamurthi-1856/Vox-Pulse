import { AlertOctagon, AlertTriangle, ExternalLink, Info, Sparkles, ThumbsUp } from "lucide-react";
import type { ReactNode } from "react";

import { Card } from "@/components/ui/card";
import {
  CATEGORY_LABELS,
  SOURCE_LABELS,
  type FeedbackItem,
} from "@/lib/feedback/types";

interface SectionDef {
  id: string;
  label: string;
  blurb: string;
  tone: string;
  icon: ReactNode;
  match: (i: FeedbackItem) => boolean;
}

const SECTIONS: SectionDef[] = [
  {
    id: "critical",
    label: "Critical issues",
    blurb: "Outages, blocking failures, or trust-breaking complaints",
    tone: "text-negative",
    icon: <AlertOctagon className="h-4 w-4" />,
    match: (i) => i.sentiment === "negative" && i.severity === "critical",
  },
  {
    id: "major",
    label: "Major issues",
    blurb: "Reproducible defects & strong frustration to triage",
    tone: "text-negative",
    icon: <AlertTriangle className="h-4 w-4" />,
    match: (i) => i.sentiment === "negative" && i.severity === "major",
  },
  {
    id: "minor",
    label: "Minor issues",
    blurb: "Friction worth tracking but not urgent",
    tone: "text-warn",
    icon: <AlertTriangle className="h-4 w-4" />,
    match: (i) => i.sentiment === "negative" && i.severity === "minor",
  },
  {
    id: "pos-high",
    label: "Positive — High impact",
    blurb: "Strong promoters and enthusiastic praise",
    tone: "text-positive",
    icon: <Sparkles className="h-4 w-4" />,
    match: (i) => i.sentiment === "positive" && i.impact === "high",
  },
  {
    id: "pos-low",
    label: "Positive — Low impact",
    blurb: "Mild positives that boost the baseline",
    tone: "text-positive",
    icon: <ThumbsUp className="h-4 w-4" />,
    match: (i) => i.sentiment === "positive" && i.impact === "low",
  },
  {
    id: "neutral",
    label: "Neutral & questions",
    blurb: "Mentions, queries, and context to monitor",
    tone: "text-muted-foreground",
    icon: <Info className="h-4 w-4" />,
    match: (i) => i.sentiment === "neutral",
  },
];

function severityTag(item: FeedbackItem) {
  if (item.severity)
    return (
      <span className="rounded-md bg-negative/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-negative">
        {item.severity}
      </span>
    );
  if (item.impact)
    return (
      <span className="rounded-md bg-positive/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-positive">
        {item.impact} impact
      </span>
    );
  return null;
}

function ItemCard({ item }: { item: FeedbackItem }) {
  return (
    <Card className="border-border/70 bg-card p-5 transition-shadow hover:shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="rounded-md bg-accent px-2 py-0.5 text-[11px] font-medium text-accent-foreground">
            {SOURCE_LABELS[item.source]}
          </span>
          <span className="rounded-md border border-border px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
            {CATEGORY_LABELS[item.category]}
          </span>
          {severityTag(item)}
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          AI Classified
        </span>
      </div>
      <h3 className="mt-3 line-clamp-2 font-medium text-foreground">
        {item.title || item.url}
      </h3>
      {item.snippet && (
        <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
          {item.snippet}
        </p>
      )}
      <div className="mt-3 flex items-end justify-between gap-3 border-t border-border/70 pt-3">
        <p className="text-xs italic text-muted-foreground">{item.reason}</p>
        <a
          href={item.url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-primary hover:underline"
        >
          Open <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </Card>
  );
}

export function FeedbackSections({ items }: { items: FeedbackItem[] }) {
  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground">
        No mentions surfaced. Try a different keyword or broaden the timeframe.
      </div>
    );
  }
  const grouped = SECTIONS.map((s) => ({ section: s, items: items.filter(s.match) })).filter(
    (g) => g.items.length > 0,
  );
  return (
    <div className="space-y-10">
      {grouped.map(({ section, items }) => (
        <section key={section.id}>
          <div className="mb-3 flex flex-wrap items-baseline gap-2">
            <div className={`inline-flex items-center gap-2 ${section.tone}`}>
              {section.icon}
              <h2 className="text-lg font-semibold text-foreground">{section.label}</h2>
            </div>
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
              {items.length}
            </span>
            <span className="text-sm text-muted-foreground">— {section.blurb}</span>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {items.map((it) => (
              <ItemCard key={it.id} item={it} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}