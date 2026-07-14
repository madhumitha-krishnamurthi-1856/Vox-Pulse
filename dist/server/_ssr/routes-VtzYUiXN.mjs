import { i as __toESM } from "../_runtime.mjs";
import { i as SOURCE_LABELS, t as ALL_SOURCES } from "./types-CrR-3oB3.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { p as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { d as Search } from "../_libs/lucide-react.mjs";
import { n as Button, r as cn, t as AppShell } from "./app-shell-CKUU6TqC.mjs";
import { a as SelectTrigger, i as SelectItem, n as Select, o as SelectValue, r as SelectContent, t as Input } from "./select-DN8BvDQo.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-VtzYUiXN.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SearchBar({ defaultKeyword = "", defaultSources = ALL_SOURCES, defaultTimeframe = "month", size = "md" }) {
	const navigate = useNavigate();
	const [keyword, setKeyword] = (0, import_react.useState)(defaultKeyword);
	const [sources, setSources] = (0, import_react.useState)(defaultSources);
	const [timeframe, setTimeframe] = (0, import_react.useState)(defaultTimeframe);
	const toggleSource = (s) => {
		setSources((cur) => cur.includes(s) ? cur.filter((x) => x !== s) : [...cur, s]);
	};
	const onSubmit = (e) => {
		e.preventDefault();
		if (!keyword.trim() || sources.length === 0) return;
		navigate({
			to: "/search",
			search: {
				q: keyword.trim(),
				sources: sources.join(","),
				timeframe
			}
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit,
		className: "w-full space-y-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-3 sm:flex-row",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: keyword,
						onChange: (e) => setKeyword(e.target.value),
						placeholder: "Search a brand, product, or topic…",
						className: cn("pl-11", size === "lg" && "h-14 text-base")
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
					value: timeframe,
					onValueChange: (v) => setTimeframe(v),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
						className: cn("w-full sm:w-40", size === "lg" && "h-14"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "day",
							children: "Past 24h"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "week",
							children: "Past week"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "month",
							children: "Past month"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "year",
							children: "Past year"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "all",
							children: "All time"
						})
					] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					className: cn(size === "lg" && "h-14 px-8"),
					children: "Listen in"
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-wrap gap-2",
			children: ALL_SOURCES.map((s) => {
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => toggleSource(s),
					className: cn("rounded-full border px-3 py-1 text-xs font-medium transition-colors", sources.includes(s) ? "border-primary/60 bg-primary/15 text-primary" : "border-border bg-muted/40 text-muted-foreground hover:text-foreground"),
					children: SOURCE_LABELS[s]
				}, s);
			})
		})]
	});
}
function Index() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-3xl px-6 pb-24 pt-16 sm:pt-24",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-10 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-primary",
						children: "Customer Voice Analyser"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
						className: "mt-6 font-serif text-5xl leading-tight tracking-tight sm:text-6xl",
						children: [
							"Hear every voice",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-primary",
								children: "about your product."
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mx-auto mt-5 max-w-xl text-muted-foreground",
						children: "Aggregate feedback from Reddit, G2, Capterra, Trustpilot, Bluesky and Hacker News. Save the views you care about, refresh whenever, triage by severity."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SearchBar, { size: "lg" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-6 text-center text-xs text-muted-foreground",
				children: [
					"Try",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-foreground",
						children: "Notion"
					}),
					",",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-foreground",
						children: "Linear"
					}),
					", or",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-foreground",
						children: "Figma"
					}),
					"."
				]
			})
		]
	}) });
}
//#endregion
export { Index as component };
