import { useCallback, useEffect, useState } from "react";

import type { SourceId, Timeframe } from "@/lib/feedback/types";

const STORAGE_KEY = "vox-pulse:saved-views";

export interface SavedView {
  id: string;
  name: string;
  keyword: string;
  sources: SourceId[];
  timeframe: Timeframe;
  createdAt: string;
  updatedAt: string;
  lastScore?: number;
}

function read(): SavedView[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as SavedView[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function write(views: SavedView[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(views));
  window.dispatchEvent(new CustomEvent("vox-pulse:views-updated"));
}

export function useSavedViews() {
  const [views, setViews] = useState<SavedView[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setViews(read());
    setLoaded(true);
    const onUpdate = () => setViews(read());
    window.addEventListener("vox-pulse:views-updated", onUpdate);
    window.addEventListener("storage", onUpdate);
    return () => {
      window.removeEventListener("vox-pulse:views-updated", onUpdate);
      window.removeEventListener("storage", onUpdate);
    };
  }, []);

  const addView = useCallback(
    (input: Omit<SavedView, "id" | "createdAt">) => {
      const now = new Date().toISOString();
      const view: SavedView = {
        ...input,
        updatedAt: input.updatedAt ?? now,
        id:
          (typeof crypto !== "undefined" && "randomUUID" in crypto
            ? crypto.randomUUID()
            : `v_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`),
        createdAt: now,
      };
      const next = [view, ...read()];
      write(next);
      return view;
    },
    [],
  );

  const removeView = useCallback((id: string) => {
    write(read().filter((v) => v.id !== id));
  }, []);

  const updateView = useCallback(
    (id: string, patch: Partial<Omit<SavedView, "id" | "createdAt">>) => {
      const next = read().map((v) =>
        v.id === id ? { ...v, ...patch, updatedAt: new Date().toISOString() } : v,
      );
      write(next);
    },
    [],
  );

  return { views, loaded, addView, removeView, updateView };
}