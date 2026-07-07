import { useCallback, useEffect, useState } from "react";

import { ALL_SOURCES, type SourceId, type Timeframe } from "@/lib/feedback/types";

const STORAGE_KEY = "vox-pulse:saved-views";
const SEEDED_KEY = "vox-pulse:seeded";

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

const DEFAULT_VIEWS: Omit<SavedView, "id" | "createdAt" | "updatedAt">[] = [
  { name: "Zoho Mail", keyword: "Zoho Mail", sources: ALL_SOURCES, timeframe: "year" },
  { name: "Zoho Calendar", keyword: "Zoho Calendar", sources: ALL_SOURCES, timeframe: "year" },
  { name: "ZeptoMail", keyword: "ZeptoMail", sources: ALL_SOURCES, timeframe: "year" },
];

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
    if (!window.localStorage.getItem(SEEDED_KEY)) {
      const now = new Date().toISOString();
      const seeded: SavedView[] = DEFAULT_VIEWS.map((v, i) => ({
        ...v,
        id: `default-${i}`,
        createdAt: now,
        updatedAt: now,
      }));
      write(seeded);
      window.localStorage.setItem(SEEDED_KEY, "1");
    }
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
    (input: Omit<SavedView, "id" | "createdAt" | "updatedAt"> & { updatedAt?: string }) => {
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