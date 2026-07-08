import { useCallback, useEffect, useState } from "react";

import { supabase } from "@/integrations/supabase/client";
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
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as SavedView[];
    return Array.isArray(parsed) ? parsed : [];
  } catch { return []; }
}

function lsWrite(views: SavedView[]) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(views)); } catch {}
}

function rowToView(row: {
  id: string; name: string; keyword: string;
  sources: string[]; timeframe: string; created_at: string;
}): SavedView {
  return {
    id: row.id,
    name: row.name,
    keyword: row.keyword,
    sources: row.sources as SourceId[],
    timeframe: row.timeframe as Timeframe,
    createdAt: row.created_at,
    updatedAt: row.created_at,
  };
}

export function useSavedViews() {
  // Start with localStorage (or defaults) so sidebar shows immediately
  const [views, setViews] = useState<SavedView[]>(() => {
    const stored = lsRead();
    return stored.length > 0 ? stored : DEFAULT_VIEWS;
  });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Ensure defaults are written to localStorage on first load
    if (lsRead().length === 0) {
      lsWrite(DEFAULT_VIEWS);
    }

    // Try to sync with Supabase in background — non-blocking
    (async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          const { error } = await supabase.auth.signInAnonymously();
          if (error) throw error;
        }

        const { data, error } = await supabase
          .from("saved_views")
          .select("*")
          .order("created_at", { ascending: true });

        if (error) throw error;

        const rows = data ?? [];

        if (rows.length === 0) {
          // Seed defaults into DB
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            await supabase.from("saved_views").insert(
              DEFAULT_VIEWS.map((v) => ({
                name: v.name,
                keyword: v.keyword,
                sources: v.sources as string[],
                timeframe: v.timeframe,
                user_id: user.id,
              }))
            );
            const { data: seeded } = await supabase
              .from("saved_views")
              .select("*")
              .order("created_at", { ascending: true });
            if (seeded && seeded.length > 0) {
              const dbViews = seeded.map(rowToView);
              setViews(dbViews);
              lsWrite(dbViews);
            }
          }
        } else {
          const dbViews = rows.map(rowToView);
          setViews(dbViews);
          lsWrite(dbViews);
        }
      } catch {
        // Supabase unavailable — localStorage fallback already shown
      } finally {
        setLoaded(true);
      }
    })();
  }, []);

  const addView = useCallback(
    async (input: Omit<SavedView, "id" | "createdAt" | "updatedAt"> & { updatedAt?: string }) => {
      const now = new Date().toISOString();
      let view: SavedView | null = null;

      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data, error } = await supabase
            .from("saved_views")
            .insert({ name: input.name, keyword: input.keyword, sources: input.sources as string[], timeframe: input.timeframe, user_id: user.id })
            .select()
            .single();
          if (!error && data) view = rowToView(data);
        }
      } catch {}

      if (!view) {
        view = {
          ...input,
          id: `local-${Date.now()}`,
          createdAt: now,
          updatedAt: now,
        };
      }

      setViews((cur) => {
        const next = [view!, ...cur];
        lsWrite(next);
        return next;
      });
      return view;
    },
    [],
  );

  const removeView = useCallback(async (id: string) => {
    try {
      await supabase.from("saved_views").delete().eq("id", id);
    } catch {}
    setViews((cur) => {
      const next = cur.filter((v) => v.id !== id);
      lsWrite(next);
      return next;
    });
  }, []);

  const updateView = useCallback(
    async (id: string, patch: Partial<Omit<SavedView, "id" | "createdAt">>) => {
      try {
        await supabase.from("saved_views").update({
          ...(patch.name !== undefined && { name: patch.name }),
          ...(patch.keyword !== undefined && { keyword: patch.keyword }),
          ...(patch.sources !== undefined && { sources: patch.sources as string[] }),
          ...(patch.timeframe !== undefined && { timeframe: patch.timeframe }),
        }).eq("id", id);
      } catch {}

      setViews((cur) => {
        const next = cur.map((v) =>
          v.id === id ? { ...v, ...patch, updatedAt: new Date().toISOString() } : v
        );
        lsWrite(next);
        return next;
      });
    },
    [],
  );

  return { views, loaded, addView, removeView, updateView };
}
