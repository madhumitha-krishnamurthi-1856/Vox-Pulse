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

const DEFAULT_VIEWS: Omit<SavedView, "id" | "createdAt" | "updatedAt">[] = [
  { name: "Zoho Mail", keyword: "Zoho Mail", sources: ALL_SOURCES, timeframe: "year" },
  { name: "Zoho Calendar", keyword: "Zoho Calendar", sources: ALL_SOURCES, timeframe: "year" },
  { name: "ZeptoMail", keyword: "ZeptoMail", sources: ALL_SOURCES, timeframe: "year" },
];

async function ensureSession() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    await supabase.auth.signInAnonymously();
  }
}

function rowToView(row: {
  id: string;
  name: string;
  keyword: string;
  sources: string[];
  timeframe: string;
  created_at: string;
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
  const [views, setViews] = useState<SavedView[]>([]);
  const [loaded, setLoaded] = useState(false);

  const loadViews = useCallback(async () => {
    await ensureSession();
    const { data, error } = await supabase
      .from("saved_views")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("[useSavedViews] load error", error);
      setLoaded(true);
      return;
    }

    const rows = data ?? [];

    if (rows.length === 0) {
      // Seed default views for this user
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
        setViews((seeded ?? []).map(rowToView));
      }
    } else {
      setViews(rows.map(rowToView));
    }

    setLoaded(true);
  }, []);

  useEffect(() => {
    loadViews();
  }, [loadViews]);

  const addView = useCallback(
    async (input: Omit<SavedView, "id" | "createdAt" | "updatedAt"> & { updatedAt?: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("saved_views")
        .insert({
          name: input.name,
          keyword: input.keyword,
          sources: input.sources as string[],
          timeframe: input.timeframe,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) {
        console.error("[useSavedViews] addView error", error);
        return;
      }

      const view = rowToView(data);
      setViews((cur) => [view, ...cur]);
      return view;
    },
    [],
  );

  const removeView = useCallback(async (id: string) => {
    const { error } = await supabase.from("saved_views").delete().eq("id", id);
    if (error) {
      console.error("[useSavedViews] removeView error", error);
      return;
    }
    setViews((cur) => cur.filter((v) => v.id !== id));
  }, []);

  const updateView = useCallback(
    async (id: string, patch: Partial<Omit<SavedView, "id" | "createdAt">>) => {
      const { error } = await supabase
        .from("saved_views")
        .update({
          ...(patch.name !== undefined && { name: patch.name }),
          ...(patch.keyword !== undefined && { keyword: patch.keyword }),
          ...(patch.sources !== undefined && { sources: patch.sources as string[] }),
          ...(patch.timeframe !== undefined && { timeframe: patch.timeframe }),
        })
        .eq("id", id);

      if (error) {
        console.error("[useSavedViews] updateView error", error);
        return;
      }

      setViews((cur) =>
        cur.map((v) =>
          v.id === id
            ? { ...v, ...patch, updatedAt: new Date().toISOString() }
            : v,
        ),
      );
    },
    [],
  );

  return { views, loaded, addView, removeView, updateView };
}
