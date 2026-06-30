import { CATEGORY_LABELS, SOURCE_LABELS, type Scorecard as ScorecardData } from "@/lib/feedback/types";
import { Card, CardContent } from "@/components/ui/card";

function Stat({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={`mt-1 font-serif text-3xl ${accent ?? "text-foreground"}`}>{value}</div>
    </div>
  );
}

export function Scorecard({ data }: { data: ScorecardData }) {
  return (
    <Card className="border-border/60 bg-card/60">
      <CardContent className="grid gap-6 p-6 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Mentions" value={String(data.total)} />
        <Stat label="Positive" value={`${data.positivePct}%`} accent="text-emerald-400" />
        <Stat label="Negative" value={`${data.negativePct}%`} accent="text-rose-400" />
        <Stat
          label="Top theme"
          value={data.topCategory ? CATEGORY_LABELS[data.topCategory] : "—"}
          accent="text-primary"
        />
        <div className="sm:col-span-2 lg:col-span-4">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">By source</div>
          <div className="mt-3 flex flex-wrap gap-2">
            {Object.entries(data.bySource).map(([source, count]) => (
              <span
                key={source}
                className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-muted/40 px-3 py-1 text-xs"
              >
                <span className="font-medium">{SOURCE_LABELS[source as keyof typeof SOURCE_LABELS]}</span>
                <span className="text-muted-foreground">{count}</span>
              </span>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}