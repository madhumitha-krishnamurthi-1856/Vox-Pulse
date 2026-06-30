import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/app-shell";
import { SearchBar } from "@/components/search-bar";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Vox Pulse — Listen to what customers say" },
      { name: "description", content: "Aggregate customer feedback for any brand from Reddit, Twitter/X, G2, Capterra and Trustpilot in seconds." },
      { property: "og:title", content: "Vox Pulse" },
      { property: "og:description", content: "Customer feedback intelligence across the public web." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <AppShell>
      <main className="mx-auto max-w-3xl px-6 pb-24 pt-16 sm:pt-24">
        <div className="mb-10 text-center">
          <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-primary">
            Customer Voice Analyser
          </span>
          <h1 className="mt-6 font-serif text-5xl leading-tight tracking-tight sm:text-6xl">
            Hear every voice<br />
            <span className="text-primary">about your product.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-muted-foreground">
            Aggregate feedback from Reddit, Twitter/X, G2, Capterra and Trustpilot.
            Save the views you care about, refresh whenever, triage by severity.
          </p>
        </div>
        <SearchBar size="lg" />
        <p className="mt-6 text-center text-xs text-muted-foreground">
          Try{" "}
          <span className="text-foreground">Notion</span>,{" "}
          <span className="text-foreground">Linear</span>, or{" "}
          <span className="text-foreground">Figma</span>.
        </p>
      </main>
    </AppShell>
  );
}
