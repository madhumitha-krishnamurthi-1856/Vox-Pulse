import { useEffect } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";

import { AppShell } from "@/components/app-shell";
import { useSavedViews } from "@/hooks/use-saved-views";

export const Route = createFileRoute("/view/$id")({
  component: ViewRedirect,
});

function ViewRedirect() {
  const { id } = Route.useParams();
  const { views, loaded } = useSavedViews();
  const navigate = useNavigate();
  const view = views.find((v) => v.id === id);

  useEffect(() => {
    if (!loaded) return;
    if (!view) return;
    navigate({
      to: "/search",
      search: {
        q: view.keyword,
        sources: view.sources.join(","),
        timeframe: view.timeframe,
        view: view.id,
      },
      replace: true,
    });
  }, [loaded, view, navigate]);

  return (
    <AppShell>
      <div className="mx-auto max-w-xl px-6 py-20 text-center">
        {!loaded ? (
          <p className="text-sm text-muted-foreground">Loading saved view…</p>
        ) : view ? (
          <p className="text-sm text-muted-foreground">Opening "{view.name}"…</p>
        ) : (
          <>
            <h1 className="font-serif text-3xl font-medium tracking-tight">
              Saved view not found
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Saved views live in this browser. If you cleared site data or are on a
              different device, this view is no longer available.
            </p>
            <Link
              to="/"
              className="mt-6 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Start a new search
            </Link>
          </>
        )}
      </div>
    </AppShell>
  );
}