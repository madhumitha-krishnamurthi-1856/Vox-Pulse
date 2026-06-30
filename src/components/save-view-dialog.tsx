import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
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
import { useAuth } from "@/hooks/use-auth";
import { createView } from "@/lib/feedback/views.functions";
import type { SourceId, Timeframe } from "@/lib/feedback/types";

interface Props {
  keyword: string;
  sources: SourceId[];
  timeframe: Timeframe;
}

export function SaveViewDialog({ keyword, sources, timeframe }: Props) {
  const { user, loading } = useAuth();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(keyword);
  const qc = useQueryClient();
  const createViewFn = useServerFn(createView);

  const mutation = useMutation({
    mutationFn: () =>
      createViewFn({ data: { name: name.trim(), keyword, sources, timeframe } }),
    onSuccess: () => {
      toast.success("View saved");
      qc.invalidateQueries({ queryKey: ["saved_views"] });
      setOpen(false);
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Failed to save"),
  });

  if (loading) return null;

  if (!user) {
    return (
      <Button asChild variant="outline" size="sm">
        <Link
          to="/auth"
          search={{ next: `/search?q=${encodeURIComponent(keyword)}&sources=${sources.join(",")}&timeframe=${timeframe}` }}
        >
          <Bookmark className="mr-1.5 h-4 w-4" />
          Sign in to save
        </Link>
      </Button>
    );
  }

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
            onClick={() => mutation.mutate()}
            disabled={!name.trim() || mutation.isPending}
          >
            {mutation.isPending ? "Saving…" : "Save view"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}