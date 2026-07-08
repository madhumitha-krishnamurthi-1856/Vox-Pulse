import { AlertOctagon, AlertTriangle, ExternalLink, Info, Sparkles, ThumbsUp } from "lucide-react";
import type { ReactNode } from "react";

import {
  CATEGORY_LABELS,
  SOURCE_LABELS,
  type FeedbackItem,
} from "@/lib/feedback/types";

interface SectionDef {
  id: string;
  label: string;
  blurb: string;
  accentBg: string;
  accentBorder: string;
  accentText: string;
  headerBg: string;
  icon: ReactNode;
  match: (i: FeedbackItem) => boolean;
}

const SECTIONS: SectionDef[] = [
  {
    id: "critical",
    label: "Critical Issues",
    blurb: "Outages, blocking failures, or trust-breaking complaints — escalate immediately",
    accentBg: "bg-red-50",
    accentBorder: "border-red-200",
    accentText: "text-red-700",
    headerBg: "bg-red-100",
    icon: <AlertOctagon className="h-4 w-4" />,
    match: (i) => i.sentiment === "negative" && i.severity === "critical",
  },
  {
    id: "major",
    label: "Major Issues",
    blurb: "Reproducible defects & strong frustration to triage",
    accentBg: "bg-orange-50",
    accentBorder: "border-orange-200",
    accentText: "text-orange-700",
    headerBg: "bg-orange-100",
    icon: <AlertTriangle className="h-4 w-4" />,
    match: (i) => i.sentiment === "negative" && i.severity === "major",
  },
  {
    id: "minor",
    label: "Minor Issues",
    blurb: "Friction worth tracking but not urgent",
    accentBg: "bg-yellow-50",
    accentBorder: "border-yellow-200",
    accentText: "text-yellow-700",
    headerBg: "bg-yellow-50",
    icon: <AlertTriangle className="h-4 w-4" />,
    match: (i) => i.sentiment === "negative" && i.severity === "minor",
  },
  {
    id: "pos-high",
    label: "Positive — High Impact",
    blurb: "Strong promoters and enthusiastic praise — surface to marketing & sales",
    accentBg: "bg-emerald-50",
    accentBorder: "border-emerald-200",
    accentText: "text-emerald-700",
    headerBg: "bg-emerald-100",
    icon: <Sparkles className="h-4 w-4" />,
    match: (i) => i.sentiment === "positive" && i.impact === "high",
  },
  {
    id: "pos-low",
    label: "Positive — Low Impact",
    blurb: "Mild positives that boost the baseline",
    accentBg: "bg-emerald-50",
    accentBorder: "border-emerald-200",
    accentText: "text-emerald-700",
    headerBg: "bg-emerald-50",
    icon: <ThumbsUp className="h-4 w-4" />,
    match: (i) => i.sentiment === "positive" && i.impact === "low",
  },
  {
    id: "neutral",
    label: "Neutral & Questions",
    blurb: "Mentions, queries, and context to monitor",
    accentBg: "bg-slate-50",
    accentBorder: "border-slate-200",
    accentText: "text-slate-600",
    headerBg: "bg-slate-100",
    icon: <Info className="h-4 w-4" />,
    match: (i) => i.sentiment === "neutral",
  },
];

function ItemCard({
  item,
  accentBorder,
  accentText,
  accentBg,
}: {
  item: FeedbackItem;
  accentBorder: string;
  accentText: string;
  accentBg: string;
}) {
  return (
    <div className={`rounded-xl border ${accentBorder} bg-white shadow-sm transition-shadow hover:shadow-md`}>
      {/* Top strip */}
      <div className={`flex items-center justify-between gap-2 rounded-t-xl ${accentBg} px-4 py-2.5`}>
        <div className="flex flex-wrap items-center gap-1.5">
          <span className={`rounded-full border ${accentBorder} bg-white px-2.5 py-0.5 text-[11px] font-semibold ${accentText}`}>
            {SOURCE_LABELS[item.source]}
          </span>
          <span className="rounded-full bg-white/80 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-slate-500">
            {CATEGORY_LABELS[item.category]}
          </span>
        </div>
        <span className="shrink-0 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
          AI Classified
        </span>
      </div>

      {/* Body */}
      <div className="px-4 pb-4 pt-3">
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-slate-900">
          {item.title || item.url}
        </h3>
        {item.snippet && (
          <p className="mt-1.5 line-clamp-3 text-sm leading-relaxed text-slate-500">
            {item.snippet}
          </p>
        )}
        <div className="mt-3 flex items-end justify-between gap-3 border-t border-slate-100 pt-3">
          <p className={`text-xs italic ${accentText} opacity-80`}>{item.reason}</p>
          <a
            href={item.url}
            target="_blank"
            rel="noreferrer"
            className={`inline-flex shrink-0 items-center gap-1 rounded-lg border ${accentBorder} px-2.5 py-1 text-xs font-semibold ${accentText} transition-colors hover:bg-white`}
          >
            Open <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </div>
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

  const grouped = SECTIONS.map((s) => ({
    section: s,
    items: items.filter(s.match),
  })).filter((g) => g.items.length > 0);

  return (
    <div className="space-y-8">
      {grouped.map(({ section, items: sItems }) => (
        <section key={section.id}>
          {/* Section header */}
          <div className={`mb-4 flex items-center gap-3 rounded-xl border ${section.accentBorder} ${section.headerBg} px-4 py-3`}>
            <span className={section.accentText}>{section.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h2 className={`text-sm font-bold ${section.accentText}`}>{section.label}</h2>
                <span className={`rounded-full border ${section.accentBorder} bg-white px-2 py-0.5 text-xs font-bold ${section.accentText}`}>
                  {sItems.length}
                </span>
              </div>
              <p className="mt-0.5 text-xs text-slate-500">{section.blurb}</p>
            </div>
          </div>

          {/* Cards grid */}
          <div className="grid gap-3 md:grid-cols-2">
            {sItems.map((it) => (
              <ItemCard
                key={it.id}
                item={it}
                accentBorder={section.accentBorder}
                accentText={section.accentText}
                accentBg={section.accentBg}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
