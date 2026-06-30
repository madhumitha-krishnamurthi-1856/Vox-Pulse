import { useState } from "react";
import { Bookmark } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSavedViews } from "@/hooks/use-saved-views";
import type { SourceId, Timeframe } from "@/lib/feedback/types";

interface Props {
  keyword: string;
  sources: SourceId[];
  timeframe: Timeframe;
}

export function SaveViewDialog({ keyword, sources, timeframe }: Props) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(keyword);
  const { addView } = useSavedViews();

  const onSave = () => {
    if (!name.trim()) return;
    addView({ name: name.trim(), keyword, sources, timeframe });
    toast.success("View saved");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Bookmark className="mr-1.5 h-4 w-4" />
          Save view
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save this view</DialogTitle>
          <DialogDescription>
            Re-run the same keyword, sources, and timeframe later in one click.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <Label htmlFor="view-name">Name</Label>
          <Input
            id="view-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Notion — past month"
          />
        </div>
        <DialogFooter>
          <Button
            onClick={onSave}
            disabled={!name.trim()}
          >
            Save view
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}