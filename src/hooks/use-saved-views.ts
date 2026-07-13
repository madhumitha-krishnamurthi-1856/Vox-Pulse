import { useCallback, useSyncExternalStore } from "react";

import { ALL_SOURCES, type SourceId, type Timeframe } from "@/lib/feedback/types";

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

const NOW = new Date().toISOString();

const DEFAULT_VIEWS: SavedView[] = [
  { id: "default-0", name: "Zoho Mail", keyword: "Zoho Mail", sources: ALL_SOURCES, timeframe: "year", createdAt: NOW, updatedAt: NOW },
  { id: "default-1", name: "Zoho Calendar", keyword: "Zoho Calendar", sources: ALL_SOURCES, timeframe: "year", createdAt: NOW, updatedAt: NOW },
  { id: "default-2", name: "ZeptoMail", keyword: "ZeptoMail", sources: ALL_SOURCES, timeframe: "year", createdAt: NOW, updatedAt: NOW },
];

const LS_KEY = "vox-pulse:saved-views";

function lsRead(): SavedView[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as SavedView[];
    return Array.isArray(parsed) ? parsed : [];
  } catch { return []; }
}

function lsWrite(views: SavedView[]) {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(LS_KEY, JSON.stringify(views)); } catch {}
}

// --- Shared external store: single source of truth across all components ---

let store: SavedView[] = (() => {
  const stored = lsRead();
  return stored.length > 0 ? stored : DEFAULT_VIEWS;
})();

const listeners = new Set<() => void>();

function setStore(next: SavedView[]) {
  store = next;
  lsWrite(next);
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  // Cross-tab sync
  const onStorage = (e: StorageEvent) => {
    if (e.key !== LS_KEY) return;
    const next = lsRead();
    store = next.length > 0 ? next : DEFAULT_VIEWS;
    listeners.forEach((l) => l());
  };
  if (typeof window !== "undefined") {
    window.addEventListener("storage", onStorage);
  }
  return () => {
    listeners.delete(cb);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", onStorage);
    }
  };
}

// Seed defaults into localStorage once on first client access
if (typeof window !== "undefined" && lsRead().length === 0) {
  lsWrite(DEFAULT_VIEWS);
}

function sameSources(a: SourceId[], b: SourceId[]) {
  if (a.length !== b.length) return false;
  const sa = [...a].sort().join(",");
  const sb = [...b].sort().join(",");
  return sa === sb;
}

export function useSavedViews() {
  const views = useSyncExternalStore(
    subscribe,
    () => store,
    () => store,
  );

  const addView = useCallback(
    (input: Omit<SavedView, "id" | "createdAt" | "updatedAt"> & { updatedAt?: string }) => {
      // Dedupe: same name+keyword+sources+timeframe returns existing
      const existing = store.find(
        (v) =>
          v.name === input.name &&
          v.keyword === input.keyword &&
          v.timeframe === input.timeframe &&
          sameSources(v.sources, input.sources),
      );
      if (existing) return existing;

      const now = new Date().toISOString();
      const view: SavedView = {
        ...input,
        id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        createdAt: now,
        updatedAt: now,
      };
      setStore([view, ...store]);
      return view;
    },
    [],
  );

  const removeView = useCallback((id: string) => {
    setStore(store.filter((v) => v.id !== id));
  }, []);

  const updateView = useCallback(
    (id: string, patch: Partial<Omit<SavedView, "id" | "createdAt">>) => {
      setStore(
        store.map((v) =>
          v.id === id ? { ...v, ...patch, updatedAt: new Date().toISOString() } : v,
        ),
      );
    },
    [],
  );

  return { views, loaded: true, addView, removeView, updateView };
}
