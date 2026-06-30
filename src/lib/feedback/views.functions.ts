import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const sourceEnum = z.enum(["reddit", "twitter", "g2", "capterra", "trustpilot"]);
const timeframeEnum = z.enum(["day", "week", "month", "year", "all"]);

export interface SavedView {
  id: string;
  name: string;
  keyword: string;
  sources: string[];
  timeframe: string;
  created_at: string;
}

export const listViews = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<SavedView[]> => {
    const { data, error } = await context.supabase
      .from("saved_views")
      .select("id,name,keyword,sources,timeframe,created_at")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []) as SavedView[];
  });

export const getView = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }): Promise<SavedView | null> => {
    const { data: row, error } = await context.supabase
      .from("saved_views")
      .select("id,name,keyword,sources,timeframe,created_at")
      .eq("id", data.id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return (row ?? null) as SavedView | null;
  });

export const createView = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z
      .object({
        name: z.string().trim().min(1).max(80),
        keyword: z.string().trim().min(2).max(120),
        sources: z.array(sourceEnum).min(1),
        timeframe: timeframeEnum,
      })
      .parse(d),
  )
  .handler(async ({ data, context }): Promise<SavedView> => {
    const { data: row, error } = await context.supabase
      .from("saved_views")
      .insert({
        user_id: context.userId,
        name: data.name,
        keyword: data.keyword,
        sources: data.sources,
        timeframe: data.timeframe,
      })
      .select("id,name,keyword,sources,timeframe,created_at")
      .single();
    if (error) throw new Error(error.message);
    return row as SavedView;
  });

export const deleteView = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("saved_views")
      .delete()
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true } as const;
  });