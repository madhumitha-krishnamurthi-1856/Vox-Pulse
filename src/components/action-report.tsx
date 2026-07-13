import { AlertOctagon, AlertTriangle, ChevronDown, ChevronRight, ChevronUp, ExternalLink, Lightbulb, Megaphone, Wrench } from "lucide-react";
import { useState } from "react";

import { Card } from "@/components/ui/card";
import { SOURCE_LABELS, type FeedbackItem } from "@/lib/feedback/types";

type Priority = "urgent" | "high" | "medium" | "opportunity";

interface ActionItem {
  id: string;
  priority: Priority;
  icon: React.ReactNode;
  heading: string;
  detail: string;
  persona: string[];
  items: FeedbackItem[];
}

function buildActionItems(items: FeedbackItem[]): ActionItem[] {
  const actions: ActionItem[] = [];

  const critical = items.filter((i) => i.sentiment === "negative" && i.severity === "critical");
  const major = items.filter((i) => i.sentiment === "negative" && i.severity === "major");
  const minor = items.filter((i) => i.sentiment === "negative" && i.severity === "minor");
  const features = items.filter((i) => i.category === "feature_request");
  const praise = items.filter((i) => i.sentiment === "positive" && i.impact === "high");
  const questions = items.filter((i) => i.category === "question");

  if (critical.length > 0) {
    actions.push({
      id: "critical",
      priority: "urgent",
      icon: <AlertOctagon className="h-4 w-4" />,
      heading: `Fix ${critical.length} critical issue${critical.length > 1 ? "s" : ""} immediately`,
      detail: "Outages, security concerns, or data-loss reports — escalate to engineering now.",
      persona: ["Engineering", "CTO"],
      items: critical,
    });
  }

  if (major.length > 0) {
    actions.push({
      id: "major",
      priority: "high",
      icon: <Wrench className="h-4 w-4" />,
      heading: `Triage ${major.length} major bug${major.length > 1 ? "s" : ""} / complaint${major.length > 1 ? "s" : ""}`,
      detail: "Reproducible defects or strong user frustration that should land in the next sprint.",
      persona: ["Engineering", "PM"],
      items: major,
    });
  }

  if (features.length > 0) {
    actions.push({
      id: "features",
      priority: "medium",
      icon: <Lightbulb className="h-4 w-4" />,
      heading: `${features.length} feature request${features.length > 1 ? "s" : ""} to review`,
      detail: "Users asking for capabilities not yet in the product — route to product management.",
      persona: ["PM", "Senior PM"],
      items: features,
    });
  }

  if (minor.length > 0) {
    actions.push({
      id: "minor",
      priority: "medium",
      icon: <AlertTriangle className="h-4 w-4" />,
      heading: `${minor.length} minor friction point${minor.length > 1 ? "s" : ""} to track`,
      detail: "Small pain points that won't break users but accumulate into churn — log for the backlog.",
      persona: ["PM"],
      items: minor,
    });
  }

  if (praise.length > 0) {
    actions.push({
      id: "praise",
      priority: "opportunity",
      icon: <Megaphone className="h-4 w-4" />,
      heading: `Amplify ${praise.length} strong advocate${praise.length > 1 ? "s" : ""}`,
      detail: "High-signal praise worth surfacing to marketing, sales, and case-study pipelines.",
      persona: ["Marketing", "Sales"],
      items: praise,
    });
  }

  if (questions.length > 0 && actions.length < 5) {
    actions.push({
      id: "questions",
      priority: "opportunity",
      icon: <ChevronRight className="h-4 w-4" />,
      heading: `Answer ${questions.length} open question${questions.length > 1 ? "s" : ""}`,
      detail: "Users asking in-the-wild — a support or docs response can turn these into loyalty.",
      persona: ["Support", "Developer"],
      items: questions,
    });
  }

  return actions;
}

const PRIORITY_STYLES: Record<Priority, { bar: string; badge: string; text: string; snippetBg: string }> = {
  urgent:      { bar: "bg-red-500",    badge: "bg-red-100 text-red-700 border-red-200",          text: "text-red-700",     snippetBg: "bg-red-50/60" },
  high:        { bar: "bg-orange-400", badge: "bg-orange-100 text-orange-700 border-orange-200", text: "text-orange-700",  snippetBg: "bg-orange-50/60" },
  medium:      { bar: "bg-amber-400",  badge: "bg-amber-50 text-amber-700 border-amber-200",     text: "text-amber-700",   snippetBg: "bg-amber-50/40" },
  opportunity: { bar: "bg-emerald-400",badge: "bg-emerald-50 text-emerald-700 border-emerald-200",text: "text-emerald-700",snippetBg: "bg-emerald-50/40" },
};

const PRIORITY_LABEL: Record<Priority, string> = {
  urgent: "Urgent",
  high: "High",
  medium: "Medium",
  opportunity: "Opportunity",
};

const PERSONA_STYLE: Record<string, string> = {
  Engineering: "bg-blue-50 text-blue-700 border-blue-200",
  CTO:         "bg-blue-50 text-blue-700 border-blue-200",
  PM:          "bg-violet-50 text-violet-700 border-violet-200",
  "Senior PM": "bg-violet-50 text-violet-700 border-violet-200",
  Marketing:   "bg-pink-50 text-pink-700 border-pink-200",
  Sales:       "bg-pink-50 text-pink-700 border-pink-200",
  Support:     "bg-cyan-50 text-cyan-700 border-cyan-200",
  Developer:   "bg-blue-50 text-blue-700 border-blue-200",
};

function FeedbackSnippet({ item }: { item: FeedbackItem }) {
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col gap-1 rounded-md border border-border/50 bg-background px-3 py-2.5 hover:border-border transition-colors"
    >
      <div className="flex items-start justify-between gap-2">
        <span className="text-xs font-medium text-foreground line-clamp-1 group-hover:underline">
          {item.title || item.snippet.slice(0, 80)}
        </span>
        <ExternalLink className="h-3 w-3 flex-shrink-0 text-muted-foreground opacity-0 group-hover:opacity-70 transition-opacity mt-0.5" />
      </div>
      {item.snippet && (
        <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
          {item.snippet}
        </p>
      )}
      <span className="text-[10px] font-medium text-muted-foreground/70 uppercase tracking-wide">
        {SOURCE_LABELS[item.source]}
      </span>
    </a>
  );
}

function ActionRow({ action, detailRef }: { action: ActionItem; detailRef: string }) {
  const [open, setOpen] = useState(false);
  const s = PRIORITY_STYLES[action.priority];
  const preview = action.items.slice(0, 3);
  const remaining = action.items.length - preview.length;

  return (
    <div className={`rounded-lg border border-border/50 overflow-hidden transition-all ${open ? "shadow-sm" : ""}`}>
      {/* Header row — clickable */}
      <button
        className={`w-full flex gap-0 text-left transition-colors ${open ? "bg-muted/30" : "bg-muted/10 hover:bg-muted/25"}`}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        {/* Priority bar */}
        <div className={`w-1 flex-shrink-0 self-stretch ${s.bar}`} />
        <div className="flex flex-1 items-start gap-3 py-3 px-3">
          <span className={`mt-0.5 flex-shrink-0 ${s.text}`}>{action.icon}</span>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-foreground">{action.heading}</span>
              <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${s.badge}`}>
                {PRIORITY_LABEL[action.priority]}
              </span>
              {action.persona.map((p) => (
                <span key={p} className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${PERSONA_STYLE[p] ?? "bg-muted text-muted-foreground border-border"}`}>
                  {p}
                </span>
              ))}
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">{action.detail}</p>
          </div>
          <span className={`flex-shrink-0 mt-0.5 ${s.text}`}>
            {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </span>
        </div>
      </button>

      {/* Expanded: feedback snippets */}
      {open && (
        <div className={`px-4 pb-4 pt-2 space-y-2 ${s.snippetBg}`}>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">
            Related feedback
          </p>
          {preview.map((item) => (
            <FeedbackSnippet key={item.id} item={item} />
          ))}
          {remaining > 0 && (
            <a
              href={`#${detailRef}`}
              className={`inline-flex items-center gap-1 text-xs font-medium mt-1 ${s.text} hover:underline`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(detailRef)?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
            >
              <ChevronDown className="h-3 w-3" />
              View {remaining} more in detail below
            </a>
          )}
        </div>
      )}
    </div>
  );
}

export function ActionReport({ items, detailSectionId = "feedback-detail" }: { items: FeedbackItem[]; detailSectionId?: string }) {
  const actions = buildActionItems(items);

  if (actions.length === 0) {
    return (
      <Card className="border-border/70 bg-card p-5">
        <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground mb-3">
          Action Report
        </div>
        <p className="text-sm text-muted-foreground">Not enough feedback items to generate action items yet.</p>
      </Card>
    );
  }

  return (
    <Card className="border-border/70 bg-card p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Action Report
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {actions.length} prioritised action{actions.length > 1 ? "s" : ""} · click any row to see related feedback
          </p>
        </div>
      </div>
      <div className="space-y-2">
        {actions.map((a) => (
          <ActionRow key={a.id} action={a} detailRef={detailSectionId} />
        ))}
      </div>
    </Card>
  );
}
