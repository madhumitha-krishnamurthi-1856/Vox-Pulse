# Vox-Pulse Clone — Firecrawl Edition

A customer feedback aggregator that searches public chatter (Reddit, Twitter/X, G2, Capterra, Trustpilot) for a keyword/brand, classifies the snippets, and surfaces a scorecard plus categorized sections. Saved views let users re-run the same query later.

## Stack

- TanStack Start + React 19 + Tailwind v4 + shadcn/ui
- Lovable Cloud (auth + Postgres) for user accounts and saved views
- **Firecrawl connector** for source data (web search + structured extraction)
- Lovable AI Gateway (Gemini 2.5 Flash) for snippet classification + sentiment

## Pages / Routes

- `/` — landing + hero + search bar
- `/search?q=...&sources=...&timeframe=...` — runs the fetch pipeline, shows scorecard + sections
- `/_authenticated/views` — list of saved views
- `/_authenticated/view/$viewId` — re-runs a saved view
- `/auth` — Lovable Cloud sign in / up

## Backend

**Lovable Cloud migration** — `saved_views` table:
`id uuid pk, user_id uuid, name text, keyword text, sources text[], timeframe text, created_at timestamptz`
RLS: owner-only CRUD. Standard GRANTs to `authenticated` + `service_role`.

**Server functions** (`src/lib/feedback/`, all `*.functions.ts`):

- `fetch.functions.ts` — `fetchFeedback({ keyword, sources, timeframe })`
  - For each selected source, run `firecrawl.search` in parallel with a `site:` filter (e.g. `site:reddit.com "<keyword>"`, `site:twitter.com`, `site:g2.com`, `site:capterra.com`, `site:trustpilot.com`)
  - Pass `tbs` based on timeframe (`qdr:d|w|m|y`) and `scrapeOptions: { formats: ['markdown'] }` so we get snippet content
  - Normalize each result into `{ source, url, title, snippet, publishedAt? }`
  - Hard cap results per source; graceful per-source error fallback `{ data: [], error }`
- `classify.functions.ts` — heuristic keyword rules for `category` (bug, feature request, praise, complaint, question) + `sentiment` (pos/neu/neg); AI Gateway fallback for ambiguous items, batched
- `views.functions.ts` — `listViews`, `createView`, `deleteView` with `requireSupabaseAuth`

Public read path (`/search`) calls `fetchFeedback` + `classify` from the component via `useServerFn` (no protected middleware), so unauthenticated users can search. Saving a view requires auth.

## UI

Dark editorial theme, warm coral accent, serif headings (Fraunces) + clean sans body (Inter). Semantic tokens in `src/styles.css`; no hardcoded colors in components.

Components:
- `SearchBar` — keyword input, source multi-select chips, timeframe select
- `Scorecard` — sentiment %, total mentions, top category, source breakdown
- `FeedbackSections` — tabs per category, each card shows source badge, snippet, link out
- `SaveViewDialog` — gated behind auth
- `AppSidebar` — saved views nav (auth only)

## Build order

1. Enable Lovable Cloud + auth route + `saved_views` migration
2. Link Firecrawl connector
3. `fetch.functions.ts` (Firecrawl) + `classify.functions.ts`
4. `/` landing + `/search` page + components
5. `/_authenticated/views` + `view/$viewId` + `views.functions.ts`
6. Verify via build + Playwright run on `/search?q=notion`

## Out of scope

Official platform APIs, multi-user orgs, CSV export, payments, email digests.
