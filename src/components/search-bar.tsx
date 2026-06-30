import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ALL_SOURCES,
  SOURCE_LABELS,
  type SourceId,
  type Timeframe,
} from "@/lib/feedback/types";
import { cn } from "@/lib/utils";

interface Props {
  defaultKeyword?: string;
  defaultSources?: SourceId[];
  defaultTimeframe?: Timeframe;
  size?: "lg" | "md";
}

export function SearchBar({
  defaultKeyword = "",
  defaultSources = ALL_SOURCES,
  defaultTimeframe = "month",
  size = "md",
}: Props) {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState(defaultKeyword);
  const [sources, setSources] = useState<SourceId[]>(defaultSources);
  const [timeframe, setTimeframe] = useState<Timeframe>(defaultTimeframe);

  const toggleSource = (s: SourceId) => {
    setSources((cur) =>
      cur.includes(s) ? cur.filter((x) => x !== s) : [...cur, s],
    );
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim() || sources.length === 0) return;
    navigate({
      to: "/search",
      search: {
        q: keyword.trim(),
        sources: sources.join(","),
        timeframe,
      },
    });
  };

  return (
    <form onSubmit={onSubmit} className="w-full space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Search a brand, product, or topic…"
            className={cn(
              "pl-11",
              size === "lg" && "h-14 text-base",
            )}
          />
        </div>
        <Select value={timeframe} onValueChange={(v) => setTimeframe(v as Timeframe)}>
          <SelectTrigger className={cn("w-full sm:w-40", size === "lg" && "h-14")}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">Past 24h</SelectItem>
            <SelectItem value="week">Past week</SelectItem>
            <SelectItem value="month">Past month</SelectItem>
            <SelectItem value="year">Past year</SelectItem>
            <SelectItem value="all">All time</SelectItem>
          </SelectContent>
        </Select>
        <Button type="submit" className={cn(size === "lg" && "h-14 px-8")}>
          Listen in
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {ALL_SOURCES.map((s) => {
          const active = sources.includes(s);
          return (
            <button
              key={s}
              type="button"
              onClick={() => toggleSource(s)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                active
                  ? "border-primary/60 bg-primary/15 text-primary"
                  : "border-border bg-muted/40 text-muted-foreground hover:text-foreground",
              )}
            >
              {SOURCE_LABELS[s]}
            </button>
          );
        })}
      </div>
    </form>
  );
}