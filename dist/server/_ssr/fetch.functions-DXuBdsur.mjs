import { c as createServerFn, i as TSS_SERVER_FUNCTION } from "./createServerFn-BfDQLD5K.mjs";
import { r as SOURCE_DOMAINS, t as ALL_SOURCES } from "./types-CrR-3oB3.mjs";
import { a as stringType, i as objectType, n as enumType, r as numberType, t as arrayType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/fetch.functions-DXuBdsur.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var BUG = /\b(bug|broken|crash(?:ed|ing)?|error|fails?|doesn'?t work|not working|glitch|freezes?|hangs?)\b/i;
var FEATURE = /\b(feature request|wish|would love|please add|missing|should (?:have|add)|need(?:s)? a)\b/i;
var QUESTION = /\?|\bhow (?:do|to)\b|\bcan (?:i|you)\b|\bany(?:one|body) know\b/i;
var PRAISE = /\b(love|amazing|awesome|great|fantastic|excellent|best|recommend|reliable|intuitive|seamless)\b/i;
var COMPLAINT = /\b(hate|terrible|awful|worst|disappointed|frustrat(?:ed|ing)|annoying|slow|expensive|unreliable|overpriced)\b/i;
var NEG = /\b(hate|terrible|awful|worst|broken|crash|bug|disappoint|frustrat|annoying|slow|useless|garbage|sucks?|unreliable|overpriced|way too expensive|keeps? (?:crashing|failing)|support is (?:bad|terrible|nonexistent))\b/i;
var POS = /\b(love|amazing|awesome|great|fantastic|excellent|best|recommend|perfect|smooth|fast|reliable|intuitive|seamless|easy to use|works (?:great|well|perfectly)|no issues|highly recommend)\b/i;
var NEGATED_POS = /\b(?:not|never|doesn'?t|don'?t|won'?t|isn'?t|aren'?t|hardly|barely)\s+(?:love|great|amazing|good|recommend|perfect|fast|smooth|reliable|work(?:s|ing)?)\b/i;
var CRITICAL = /\b(security|breach|data ?loss|outage|down|cannot (?:log ?in|access)|charged twice|fraud|locked out|deleted (?:all )?(?:my )?(?:data|emails?|events?))\b/i;
var HIGH_IMPACT = /\b(love|best|amazing|recommend|game[- ]changer|favorite|fantastic|switched to|life[- ]?saver|highly recommend)\b/i;
function classifyItem(item) {
	const text = `${item.title} ${item.snippet}`;
	let category = "other";
	if (BUG.test(text)) category = "bug";
	else if (FEATURE.test(text)) category = "feature_request";
	else if (PRAISE.test(text)) category = "praise";
	else if (COMPLAINT.test(text)) category = "complaint";
	else if (QUESTION.test(text)) category = "question";
	let sentiment = "neutral";
	const hasPos = POS.test(text) && !NEGATED_POS.test(text);
	const hasNeg = NEG.test(text) || NEGATED_POS.test(text);
	if (hasPos && !hasNeg) sentiment = "positive";
	else if (hasNeg && !hasPos) sentiment = "negative";
	else if (category === "praise") sentiment = "positive";
	else if (category === "bug" || category === "complaint") sentiment = "negative";
	let severity = null;
	let impact = null;
	let reason = "";
	if (sentiment === "negative") {
		if (CRITICAL.test(text)) severity = "critical";
		else if (BUG.test(text) || category === "bug" || category === "complaint") severity = "major";
		else severity = "minor";
		reason = severity === "critical" ? "Mentions outage, security, or blocking failure — escalate immediately." : severity === "major" ? "Reproducible defect or strong complaint — schedule a fix." : "Minor friction or dissatisfaction — track for trends.";
	} else if (sentiment === "positive") {
		impact = HIGH_IMPACT.test(text) ? "high" : "low";
		reason = impact === "high" ? "Strong advocacy signal — surface to marketing & sales." : "Mild positive — useful for sentiment baseline.";
	} else reason = category === "question" ? "Open question from the community — opportunity for support." : "Neutral mention — useful for volume tracking.";
	return {
		category,
		sentiment,
		severity,
		impact,
		reason
	};
}
var inputSchema = objectType({
	keyword: stringType().trim().min(2).max(120),
	sources: arrayType(enumType([
		"reddit",
		"g2",
		"capterra",
		"trustpilot",
		"bluesky",
		"hackernews"
	])).min(1),
	timeframe: enumType([
		"day",
		"week",
		"month",
		"year",
		"all"
	]).default("month"),
	perSourceLimit: numberType().int().min(1).max(15).default(8)
});
function tbsFor(timeframe) {
	switch (timeframe) {
		case "day": return "qdr:d";
		case "week": return "qdr:w";
		case "month": return "qdr:m";
		case "year": return "qdr:y";
		default: return;
	}
}
async function searchSource(source, keyword, timeframe, perSourceLimit, apiKey) {
	const body = {
		query: `site:${SOURCE_DOMAINS[source]} "${keyword}"`,
		limit: perSourceLimit,
		sources: ["web"]
	};
	const tbs = tbsFor(timeframe);
	if (tbs) body.tbs = tbs;
	const res = await fetch("https://api.firecrawl.dev/v2/search", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${apiKey}`,
			"Content-Type": "application/json"
		},
		body: JSON.stringify(body)
	});
	if (!res.ok) {
		const text = await res.text().catch(() => "");
		throw new Error(`Firecrawl ${res.status}: ${text.slice(0, 200)}`);
	}
	const json = await res.json();
	return (Array.isArray(json.data) ? json.data : json.data?.web ?? []).filter((r) => r.url && (r.title || r.description)).map((r) => ({
		source,
		url: r.url,
		title: (r.title ?? "").slice(0, 200),
		snippet: (r.description ?? r.markdown ?? "").slice(0, 600)
	}));
}
async function fetchCreditsRemaining(apiKey) {
	try {
		const res = await fetch("https://api.firecrawl.dev/v1/credits", { headers: { Authorization: `Bearer ${apiKey}` } });
		if (!res.ok) return null;
		return (await res.json()).credits ?? null;
	} catch {
		return null;
	}
}
var FIRECRAWL_SOURCES = [
	"reddit",
	"g2",
	"capterra",
	"trustpilot"
];
function timeframeCutoffMs(timeframe) {
	const now = Date.now();
	switch (timeframe) {
		case "day": return now - 1440 * 60 * 1e3;
		case "week": return now - 10080 * 60 * 1e3;
		case "month": return now - 720 * 60 * 60 * 1e3;
		case "year": return now - 365 * 24 * 60 * 60 * 1e3;
		default: return null;
	}
}
async function searchBluesky(keyword, timeframe, limit) {
	const url = new URL("https://public.api.bsky.app/xrpc/app.bsky.feed.searchPosts");
	url.searchParams.set("q", keyword);
	url.searchParams.set("limit", String(Math.min(Math.max(limit, 1), 25)));
	url.searchParams.set("sort", "latest");
	const res = await fetch(url.toString(), { headers: { Accept: "application/json" } });
	if (!res.ok) {
		const text = await res.text().catch(() => "");
		throw new Error(`Bluesky ${res.status}: ${text.slice(0, 200)}`);
	}
	const json = await res.json();
	const cutoff = timeframeCutoffMs(timeframe);
	return (json.posts ?? []).filter((p) => {
		if (!cutoff) return true;
		const t = p.indexedAt ? Date.parse(p.indexedAt) : NaN;
		return isNaN(t) ? true : t >= cutoff;
	}).map((p) => {
		const handle = p.author?.handle;
		const rkey = p.uri.split("/").pop();
		if (!handle || !rkey) return null;
		const text = (p.record?.text ?? "").trim();
		if (!text) return null;
		const displayName = p.author?.displayName ?? handle;
		return {
			source: "bluesky",
			url: `https://bsky.app/profile/${handle}/post/${rkey}`,
			title: `@${handle}${displayName !== handle ? ` (${displayName})` : ""}`.slice(0, 200),
			snippet: text.slice(0, 600)
		};
	}).filter((x) => x !== null);
}
function stripHtml(html) {
	return html.replace(/<[^>]+>/g, " ").replace(/&#x27;/g, "'").replace(/&quot;/g, "\"").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/\s+/g, " ").trim();
}
async function searchHackerNews(keyword, timeframe, limit) {
	const url = new URL("https://hn.algolia.com/api/v1/search");
	url.searchParams.set("query", keyword);
	url.searchParams.set("tags", "(story,comment)");
	url.searchParams.set("hitsPerPage", String(Math.min(Math.max(limit, 1), 25)));
	const cutoff = timeframeCutoffMs(timeframe);
	if (cutoff) url.searchParams.set("numericFilters", `created_at_i>${Math.floor(cutoff / 1e3)}`);
	const res = await fetch(url.toString(), { headers: { Accept: "application/json" } });
	if (!res.ok) {
		const text = await res.text().catch(() => "");
		throw new Error(`Hacker News ${res.status}: ${text.slice(0, 200)}`);
	}
	return ((await res.json()).hits ?? []).map((h) => {
		const isComment = (h._tags ?? []).includes("comment");
		const title = (h.title ?? h.story_title ?? "").trim();
		const body = stripHtml(isComment ? h.comment_text ?? "" : h.story_text ?? "");
		const displayTitle = isComment ? `Comment on: ${title || "HN thread"}` : title;
		const snippet = body || title;
		if (!displayTitle || !snippet) return null;
		return {
			source: "hackernews",
			url: `https://news.ycombinator.com/item?id=${h.objectID}`,
			title: displayTitle.slice(0, 200),
			snippet: snippet.slice(0, 600)
		};
	}).filter((x) => x !== null);
}
var SOURCE_WEIGHT = {
	g2: 2,
	capterra: 2,
	reddit: .8,
	trustpilot: 1.5,
	bluesky: 1,
	hackernews: 1.3
};
function buildScorecard(items) {
	const total = items.length;
	const bySource = ALL_SOURCES.reduce((acc, s) => {
		acc[s] = 0;
		return acc;
	}, {});
	const catCount = {
		bug: 0,
		feature_request: 0,
		praise: 0,
		complaint: 0,
		question: 0,
		other: 0
	};
	let pos = 0;
	let neu = 0;
	let neg = 0;
	for (const it of items) {
		bySource[it.source] += 1;
		catCount[it.category] += 1;
		if (it.sentiment === "positive") pos += 1;
		else if (it.sentiment === "negative") neg += 1;
		else neu += 1;
	}
	const safe = total || 1;
	const topCategory = Object.entries(catCount).filter(([k]) => k !== "other").sort((a, b) => b[1] - a[1])[0];
	const themes = Object.entries(catCount).filter(([k, v]) => k !== "other" && v > 0).sort((a, b) => b[1] - a[1]).map(([category, count]) => ({
		category,
		count
	}));
	let weightedPos = 0, weightedNeg = 0, weightedNeu = 0;
	for (const it of items) {
		const w = SOURCE_WEIGHT[it.source] ?? 1;
		if (it.sentiment === "positive") weightedPos += w * (it.impact === "high" ? 1.5 : 1);
		else if (it.sentiment === "negative") weightedNeg += w * (it.severity === "critical" ? 2 : it.severity === "major" ? 1.5 : 1);
		else weightedNeu += w * .5;
	}
	const span = weightedPos + weightedNeg + weightedNeu || 1;
	const score = Math.max(0, Math.min(100, Math.round(50 + (weightedPos - weightedNeg) / span * 50)));
	return {
		total,
		positivePct: Math.round(pos / safe * 100),
		neutralPct: Math.round(neu / safe * 100),
		negativePct: Math.round(neg / safe * 100),
		topCategory: topCategory && topCategory[1] > 0 ? topCategory[0] : null,
		bySource,
		score,
		trend: score >= 65 ? "rising" : score <= 40 ? "falling" : "stable",
		delta: score - 50,
		themes
	};
}
var fetchFeedback_createServerFn_handler = createServerRpc({
	id: "f6744d6cce096299c2f47e1badbf4073553b183f5ea881452a4d14e5b9fd4659",
	name: "fetchFeedback",
	filename: "src/lib/feedback/fetch.functions.ts"
}, (opts) => fetchFeedback.__executeServer(opts));
var fetchFeedback = createServerFn({ method: "POST" }).inputValidator((input) => inputSchema.parse(input)).handler(fetchFeedback_createServerFn_handler, async ({ data }) => {
	const needsFirecrawl = data.sources.some((s) => FIRECRAWL_SOURCES.includes(s));
	const apiKey = process.env.FIRECRAWL_API_KEY ?? "";
	if (needsFirecrawl && !apiKey) throw new Error("FIRECRAWL_API_KEY is not configured");
	const errors = {};
	const [results, creditsRemaining] = await Promise.all([Promise.all(data.sources.map(async (source) => {
		try {
			if (source === "bluesky") return await searchBluesky(data.keyword, data.timeframe, data.perSourceLimit);
			if (source === "hackernews") return await searchHackerNews(data.keyword, data.timeframe, data.perSourceLimit);
			return await searchSource(source, data.keyword, data.timeframe, data.perSourceLimit, apiKey);
		} catch (err) {
			console.error(`[fetchFeedback] ${source} failed`, err);
			errors[source] = err instanceof Error ? err.message : String(err);
			return [];
		}
	})), apiKey ? fetchCreditsRemaining(apiKey) : Promise.resolve(null)]);
	const items = results.flat().map((raw, idx) => {
		const c = classifyItem(raw);
		return {
			...raw,
			id: `${raw.source}-${idx}-${raw.url.slice(0, 32)}`,
			category: c.category,
			sentiment: c.sentiment,
			severity: c.severity,
			impact: c.impact,
			reason: c.reason
		};
	});
	return {
		items,
		scorecard: buildScorecard(items),
		errors,
		creditsUsed: data.sources.filter((s) => FIRECRAWL_SOURCES.includes(s)).length * data.perSourceLimit,
		creditsRemaining
	};
});
//#endregion
export { fetchFeedback_createServerFn_handler };
