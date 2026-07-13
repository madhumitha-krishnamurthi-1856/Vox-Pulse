import { AlertOctagon, AlertTriangle, ChevronRight, Lightbulb, Megaphone, Wrench } from "lucide-react";

import { Card } from "@/components/ui/card";
import type { FeedbackItem } from "@/lib/feedback/types";

interface ActionItem {
  priority: "urgent" | "high" | "medium" | "opportunity";
  icon: React.ReactNode;
  heading: string;
  detail: string;
  count: number;
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
      priority: "urgent",
      icon: <AlertOctagon className="h-4 w-4" />,
      heading: `Fix ${critical.length} critical issue${critical.length > 1 ? "s" : ""} immediately`,
      detail: "Outages, security concerns, or data-loss reports detected — escalate to engineering now.",
      count: critical.length,
    });
  }

  if (major.length > 0) {
    actions.push({
      priority: "high",
      icon: <Wrench className="h-4 w-4" />,
      heading: `Triage ${major.length} major bug${major.length > 1 ? "s" : ""} / complaint${major.length > 1 ? "s" : ""}`,
      detail: "Reproducible defects or strong user frustration that should land in the next sprint.",
      count: major.length,
    });
  }

  if (features.length > 0) {
    actions.push({
      priority: "medium",
      icon: <Lightbulb className="h-4 w-4" />,
      heading: `${features.length} feature request${features.length > 1 ? "s" : ""} to review`,
      detail: "Users are asking for capabilities not yet in the product — route to product management.",
      count: features.length,
    });
  }

  if (minor.length > 0) {
    actions.push({
      priority: "medium",
      icon: <AlertTriangle className="h-4 w-4" />,
      heading: `${minor.length} minor friction point${minor.length > 1 ? "s" : ""} to track`,
      detail: "Small pain points that won't break users but accumulate into churn — log for the backlog.",
      count: minor.length,
    });
  }

  if (praise.length > 0) {
    actions.push({
      priority: "opportunity",
      icon: <Megaphone className="h-4 w-4" />,
      heading: `Amplify ${praise.length} strong advocate${praise.length > 1 ? "s" : ""}`,
      detail: "High-signal praise worth surfacing to marketing, sales, and case-study pipelines.",
      count: praise.length,
    });
  }

  if (questions.length > 0 && actions.length < 4) {
    actions.push({
      priority: "opportunity",
      icon: <ChevronRight className="h-4 w-4" />,
      heading: `Answer ${questions.length} open question${questions.length > 1 ? "s" : ""}`,
      detail: "Users asking in-the-wild — a support or docs response can turn these into loyalty.",
      count: questions.length,
    });
  }

  return actions;
}

const PRIORITY_STYLES: Record<ActionItem["priority"], { bar: string; badge: string; text: string }> = {
  urgent:      { bar: "bg-red-500",    badge: "bg-red-100 text-red-700 border-red-200",      text: "text-red-700" },
  high:        { bar: "bg-orange-400", badge: "bg-orange-100 text-orange-700 border-orange-200", text: "text-orange-700" },
  medium:      { bar: "bg-amber-400",  badge: "bg-amber-50 text-amber-700 border-amber-200",  text: "text-amber-700" },
  opportunity: { bar: "bg-emerald-400",badge: "bg-emerald-50 text-emerald-700 border-emerald-200", text: "text-emerald-700" },
};

const PRIORITY_LABEL: Record<ActionItem["priority"], string> = {
  urgent: "Urgent",
  high: "High",
  medium: "Medium",
  opportunity: "Opportunity",
};

export function ActionReport({ items }: { items: FeedbackItem[] }) {
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
            {actions.length} prioritised action{actions.length > 1 ? "s" : ""} derived from {items.length} feedback items
          </p>
        </div>
      </div>
      <div className="space-y-2">
        {actions.map((a, i) => {
          const s = PRIORITY_STYLES[a.priority];
          return (
            <div key={i} className="flex gap-3 rounded-lg border border-border/50 bg-muted/20 overflow-hidden">
              {/* Priority bar */}
              <div className={`w-1 flex-shrink-0 ${s.bar}`} />
              <div className="flex flex-1 items-start gap-3 py-3 pr-3">
                <span className={`mt-0.5 flex-shrink-0 ${s.text}`}>{a.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-medium text-foreground">{a.heading}</span>
                    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${s.badge}`}>
                      {PRIORITY_LABEL[a.priority]}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">{a.detail}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
