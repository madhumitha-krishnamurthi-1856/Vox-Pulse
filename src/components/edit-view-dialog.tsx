import { useEffect, useState } from "react";
import { Edit3 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { SavedView } from "@/hooks/use-saved-views";
import { useSavedViews } from "@/hooks/use-saved-views";
import { ALL_SOURCES, SOURCE_LABELS, type SourceId, type Timeframe } from "@/lib/feedback/types";

interface Props {
  view: SavedView;
  onUpdated?: (patch: { name: string; keyword: string; sources: SourceId[]; timeframe: Timeframe }) => void;
}

export function EditViewDialog({ view, onUpdated }: Props) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(view.name);
  const [keyword, setKeyword] = useState(view.keyword);
  const [sources, setSources] = useState<Set<SourceId>>(new Set(view.sources));
  const [timeframe, setTimeframe] = useState<Timeframe>(view.timeframe);
  const { updateView } = useSavedViews();

  // Reset fields when dialog opens
  useEffect(() => {
    if (open) {
      setName(view.name);
      setKeyword(view.keyword);
      setSources(new Set(view.sources));
      setTimeframe(view.timeframe);
    }
  }, [open, view]);

  const toggleSource = (s: SourceId) => {
    setSources((cur) => {
      const next = new Set(cur);
      if (next.has(s)) next.delete(s);
      else next.add(s);
      return next;
    });
  };

  const onSave = () => {
    if (!name.trim() || !keyword.trim() || sources.size === 0) return;
    const patch = {
      name: name.trim(),
      keyword: keyword.trim(),
      sources: [...sources] as SourceId[],
      timeframe,
    };
    updateView(view.id, patch);
    onUpdated?.(patch);
    toast.success("View updated");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <Edit3 className="h-3.5 w-3.5" />
          Edit View
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit saved view</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="ev-name">View name</Label>
            <Input
              id="ev-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Zoho Mail"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ev-keyword">Search keyword</Label>
            <Input
              id="ev-keyword"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="e.g. Zoho Mail"
            />
          </div>
          <div className="space-y-2">
            <Label>Sources</Label>
            <div className="flex flex-wrap gap-4">
              {ALL_SOURCES.map((s) => (
                <div key={s} className="flex items-center gap-2">
                  <Checkbox
                    id={`ev-src-${s}`}
                    checked={sources.has(s)}
                    onCheckedChange={() => toggleSource(s)}
                  />
                  <label htmlFor={`ev-src-${s}`} className="text-sm cursor-pointer">
                    {SOURCE_LABELS[s]}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ev-timeframe">Timeframe</Label>
            <Select value={timeframe} onValueChange={(v) => setTimeframe(v as Timeframe)}>
              <SelectTrigger id="ev-timeframe">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Past 24h</SelectItem>
                <SelectItem value="week">Past Week</SelectItem>
                <SelectItem value="month">Past Month</SelectItem>
                <SelectItem value="year">Past Year</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={onSave} disabled={!name.trim() || !keyword.trim() || sources.size === 0}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
