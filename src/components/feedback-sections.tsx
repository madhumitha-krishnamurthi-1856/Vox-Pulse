import { ExternalLink } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  CATEGORY_LABELS,
  SOURCE_LABELS,
  type Category,
  type FeedbackItem,
} from "@/lib/feedback/types";

const CATEGORY_ORDER: Category[] = [
  "praise",
  "complaint",
  "bug",
  "feature_request",
  "question",
  "other",
];

function sentimentColor(s: FeedbackItem["sentiment"]) {
  if (s === "positive") return "text-emerald-400";
  if (s === "negative") return "text-rose-400";
  return "text-muted-foreground";
}

function ItemCard({ item }: { item: FeedbackItem }) {
  return (
    <Card className="border-border/50 bg-card/40 transition-colors hover:border-primary/40">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="rounded-full text-[10px] uppercase tracking-wider">
              {SOURCE_LABELS[item.source]}
            </Badge>
            <span className={`text-xs font-medium ${sentimentColor(item.sentiment)}`}>
              {item.sentiment}
            </span>
          </div>
          <a
            href={item.url}
            target="_blank"
            rel="noreferrer"
            className="text-muted-foreground hover:text-primary"
            aria-label="Open source"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
        <h3 className="mt-3 line-clamp-2 font-medium text-foreground">{item.title || item.url}</h3>
        {item.snippet && (
          <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{item.snippet}</p>
        )}
      </CardContent>
    </Card>
  );
}

export function FeedbackSections({ items }: { items: FeedbackItem[] }) {
  const grouped = CATEGORY_ORDER.map((cat) => ({
    cat,
    items: items.filter((i) => i.category === cat),
  })).filter((g) => g.items.length > 0);

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border/60 p-12 text-center text-muted-foreground">
        No mentions surfaced. Try a different keyword or broaden the timeframe.
      </div>
    );
  }

  const first = grouped[0]?.cat ?? "praise";

  return (
    <Tabs defaultValue={first} className="w-full">
      <TabsList className="flex flex-wrap justify-start">
        {grouped.map((g) => (
          <TabsTrigger key={g.cat} value={g.cat}>
            {CATEGORY_LABELS[g.cat]}
            <span className="ml-2 text-xs text-muted-foreground">{g.items.length}</span>
          </TabsTrigger>
        ))}
      </TabsList>
      {grouped.map((g) => (
        <TabsContent key={g.cat} value={g.cat} className="mt-6">
          <div className="grid gap-4 md:grid-cols-2">
            {g.items.map((it) => (
              <ItemCard key={it.id} item={it} />
            ))}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}