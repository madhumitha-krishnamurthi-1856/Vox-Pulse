# Replace Twitter/X with Bluesky + Hacker News

Firecrawl can't return usable Twitter/X snippets (login wall). Instead of a broken X source, add two free public APIs that return real product-discussion signal.

## New sources

**Bluesky** — public search, no auth
- `GET https://public.api.bsky.app/xrpc/app.bsky.feed.searchPosts?q=<kw>&limit=15&sort=latest`
- Returns full post text, author, timestamp, like/repost counts
- Post URL built from `at://did/…/post/<rkey>` → `https://bsky.app/profile/<handle>/post/<rkey>`

**Hacker News (Algolia)** — public search, no auth, no limits
- `GET https://hn.algolia.com/api/v1/search?query=<kw>&tags=(story,comment)&hitsPerPage=15`
- Optional time filter via `numericFilters=created_at_i>UNIX_TS`
- Returns story title / comment text, author, points, URL

Both bypass Firecrawl entirely — direct fetch inside the server function, no API key.

## Changes

**`src/lib/feedback/types.ts`**
- `SourceId`: drop `twitter` (if present), add `"bluesky"` and `"hackernews"`
- Add labels + domains + `ALL_SOURCES` entries
- Add `SOURCE_WEIGHT` entries in `fetch.functions.ts`: bluesky 1.0, hackernews 1.3

**`src/lib/feedback/fetch.functions.ts`**
- New `searchBluesky(keyword, timeframe, limit)` — direct fetch, map posts to `RawFeedbackItem`, filter by `indexedAt` for timeframe
- New `searchHackerNews(keyword, timeframe, limit)` — direct fetch with `numericFilters` for timeframe, map hits (title for stories, comment_text for comments) to `RawFeedbackItem`
- In the main handler, branch per source: bluesky/hackernews use their own fetcher; reddit/g2/capterra/trustpilot keep using Firecrawl
- Zod enum updated to include new sources
- `creditsUsed` only counts Firecrawl-backed sources

**`src/routes/index.tsx` and `src/routes/search.tsx`**
- Source checkbox list picks up new sources automatically via `ALL_SOURCES`
- Validate that any Twitter references in default `sources` search param are removed

**`src/components/dashboard-stats.tsx` / source-color helpers**
- Add colors for `bluesky` (sky blue) and `hackernews` (orange) so bar chart + badges render

**`src/lib/feedback/classify.ts`**
- No change; classifier is source-agnostic and works on title+snippet

## Out of scope

- No X API integration, no RapidAPI scraper, no unofficial Twitter endpoints
- No database migration (sources are strings; existing saved views with `twitter` in `sources` will just be filtered out client-side by the `ALL_SOURCES` guard already in `search.tsx`)

## Verification

After build: run a search for "notion" with all sources selected — expect real Bluesky posts and HN threads in results, source bar chart shows 6 sources, no 404s.
