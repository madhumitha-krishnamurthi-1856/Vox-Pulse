import { Filter, Search as SearchIcon } from "lucide-react";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CATEGORY_LABELS,
  SOURCE_LABELS,
  type Category,
  type SourceId,
} from "@/lib/feedback/types";
import { cn } from "@/lib/utils";

interface Props {
  sources: SourceId[];
  activeSources: Set<SourceId>;
  toggleSource: (s: SourceId) => void;
  themes: { category: Category; count: number }[];
  themeFilter: Category | "all";
  setThemeFilter: (c: Category | "all") => void;
  query: string;
  setQuery: (q: string) => void;
  shown: number;
  total: number;
}

export function FilterBar({
  sources,
  activeSources,
  toggleSource,
  themes,
  themeFilter,
  setThemeFilter,
  query,
  setQuery,
  shown,
  total,
}: Props) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card p-3">
      <span className="inline-flex items-center gap-1.5 pl-1 text-sm font-medium text-foreground">
        <Filter className="h-3.5 w-3.5 text-muted-foreground" /> Filter by
      </span>
      <div className="flex flex-wrap gap-1.5">
        {sources.map((s) => {
          const active = activeSources.has(s);
          return (
            <button
              key={s}
              type="button"
              onClick={() => toggleSource(s)}
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition-colors",
                active
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-accent",
              )}
            >
              {active && <span aria-hidden>✓</span>}
              {SOURCE_LABELS[s]}
            </button>
          );
        })}
      </div>
      <Select value={themeFilter} onValueChange={(v) => setThemeFilter(v as Category | "all")}>
        <SelectTrigger className="h-8 w-40 text-xs">
          <SelectValue placeholder="All themes" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All themes</SelectItem>
          {themes.map((t) => (
            <SelectItem key={t.category} value={t.category}>
              {CATEGORY_LABELS[t.category]} ({t.count})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="relative ml-auto w-full max-w-xs">
        <SearchIcon className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search within results…"
          className="h-8 pl-8 text-xs"
        />
      </div>
      <span className="text-xs text-muted-foreground">
        Showing {shown} of {total}
      </span>
    </div>
  );
}