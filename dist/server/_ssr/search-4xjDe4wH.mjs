import { i as __toESM } from "../_runtime.mjs";
import { c as createServerFn, i as TSS_SERVER_FUNCTION } from "./createServerFn-BfDQLD5K.mjs";
import { i as SOURCE_LABELS, n as CATEGORY_LABELS, t as ALL_SOURCES } from "./types-CrR-3oB3.mjs";
import { a as stringType, i as objectType, n as enumType, r as numberType, t as arrayType } from "../_libs/zod.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { f as Link, h as isRedirect, m as useRouter, p as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as Route } from "./search-DL_dO0Oa.mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { A as Bookmark, C as Funnel, D as ChevronDown, E as ChevronRight, O as Check, S as Info, T as ChevronUp, _ as OctagonAlert, a as TrendingUp, b as Link2, c as ThumbsUp, d as Search, f as RefreshCw, i as TriangleAlert, l as Star, m as PenLine, n as X, o as TrendingDown, r as Wrench, t as Zap, u as Sparkles, v as Minus, w as ExternalLink, x as Lightbulb, y as Megaphone } from "../_libs/lucide-react.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { n as CheckboxIndicator, t as Checkbox$1 } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { a as DialogOverlay$1, c as DialogTrigger$1, i as DialogDescription$1, n as DialogClose, o as DialogPortal$1, r as DialogContent$1, s as DialogTitle$1, t as Dialog$1 } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { i as useSavedViews, n as Button, r as cn, t as AppShell } from "./app-shell-CKUU6TqC.mjs";
import { i as Trigger, n as Portal, r as Root2, t as Content2 } from "../_libs/@radix-ui/react-popover+[...].mjs";
import { a as SelectTrigger, i as SelectItem, n as Select, o as SelectValue, r as SelectContent, t as Input } from "./select-DN8BvDQo.mjs";
import { t as getServerFnById } from "../__23tanstack-start-server-fn-resolver-BV5ET66z.mjs";
import { n as Skeleton, t as Card } from "./skeleton-BQigzaoc.mjs";
import { a as XAxis, c as Pie, d as Tooltip, i as YAxis, l as Cell, n as BarChart, o as Line, r as LineChart, s as Bar, t as PieChart, u as ResponsiveContainer } from "../_libs/recharts+[...].mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { t as Root } from "../_libs/radix-ui__react-label.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/search-4xjDe4wH.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function useServerFn(serverFn) {
	const router = useRouter();
	return import_react.useCallback(async (...args) => {
		try {
			const res = await serverFn(...args);
			if (isRedirect(res)) throw res;
			return res;
		} catch (err) {
			if (isRedirect(err)) {
				err.options._fromLocation = router.stores.location.get();
				return router.navigate(router.resolveRedirect(err).options);
			}
			throw err;
		}
	}, [router, serverFn]);
}
function buildActionItems(items) {
	const actions = [];
	const critical = items.filter((i) => i.sentiment === "negative" && i.severity === "critical");
	const major = items.filter((i) => i.sentiment === "negative" && i.severity === "major");
	const minor = items.filter((i) => i.sentiment === "negative" && i.severity === "minor");
	const features = items.filter((i) => i.category === "feature_request");
	const praise = items.filter((i) => i.sentiment === "positive" && i.impact === "high");
	const questions = items.filter((i) => i.category === "question");
	if (critical.length > 0) actions.push({
		id: "critical",
		priority: "urgent",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OctagonAlert, { className: "h-4 w-4" }),
		heading: `Fix ${critical.length} critical issue${critical.length > 1 ? "s" : ""} immediately`,
		detail: "Outages, security concerns, or data-loss reports — escalate to engineering now.",
		persona: ["Engineering", "CTO"],
		items: critical
	});
	if (major.length > 0) actions.push({
		id: "major",
		priority: "high",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wrench, { className: "h-4 w-4" }),
		heading: `Triage ${major.length} major bug${major.length > 1 ? "s" : ""} / complaint${major.length > 1 ? "s" : ""}`,
		detail: "Reproducible defects or strong user frustration that should land in the next sprint.",
		persona: ["Engineering", "PM"],
		items: major
	});
	if (features.length > 0) actions.push({
		id: "features",
		priority: "medium",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lightbulb, { className: "h-4 w-4" }),
		heading: `${features.length} feature request${features.length > 1 ? "s" : ""} to review`,
		detail: "Users asking for capabilities not yet in the product — route to product management.",
		persona: ["PM", "Senior PM"],
		items: features
	});
	if (minor.length > 0) actions.push({
		id: "minor",
		priority: "medium",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-4 w-4" }),
		heading: `${minor.length} minor friction point${minor.length > 1 ? "s" : ""} to track`,
		detail: "Small pain points that won't break users but accumulate into churn — log for the backlog.",
		persona: ["PM"],
		items: minor
	});
	if (praise.length > 0) actions.push({
		id: "praise",
		priority: "opportunity",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Megaphone, { className: "h-4 w-4" }),
		heading: `Amplify ${praise.length} strong advocate${praise.length > 1 ? "s" : ""}`,
		detail: "High-signal praise worth surfacing to marketing, sales, and case-study pipelines.",
		persona: ["Marketing", "Sales"],
		items: praise
	});
	if (questions.length > 0 && actions.length < 5) actions.push({
		id: "questions",
		priority: "opportunity",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4" }),
		heading: `Answer ${questions.length} open question${questions.length > 1 ? "s" : ""}`,
		detail: "Users asking in-the-wild — a support or docs response can turn these into loyalty.",
		persona: ["Support", "Developer"],
		items: questions
	});
	return actions;
}
var PRIORITY_STYLES = {
	urgent: {
		bar: "bg-red-500",
		badge: "bg-red-100 text-red-700 border-red-200",
		text: "text-red-700",
		snippetBg: "bg-red-50/60"
	},
	high: {
		bar: "bg-orange-400",
		badge: "bg-orange-100 text-orange-700 border-orange-200",
		text: "text-orange-700",
		snippetBg: "bg-orange-50/60"
	},
	medium: {
		bar: "bg-amber-400",
		badge: "bg-amber-50 text-amber-700 border-amber-200",
		text: "text-amber-700",
		snippetBg: "bg-amber-50/40"
	},
	opportunity: {
		bar: "bg-emerald-400",
		badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
		text: "text-emerald-700",
		snippetBg: "bg-emerald-50/40"
	}
};
var PRIORITY_LABEL = {
	urgent: "Urgent",
	high: "High",
	medium: "Medium",
	opportunity: "Opportunity"
};
var PERSONA_STYLE = {
	Engineering: "bg-blue-50 text-blue-700 border-blue-200",
	CTO: "bg-blue-50 text-blue-700 border-blue-200",
	PM: "bg-violet-50 text-violet-700 border-violet-200",
	"Senior PM": "bg-violet-50 text-violet-700 border-violet-200",
	Marketing: "bg-pink-50 text-pink-700 border-pink-200",
	Sales: "bg-pink-50 text-pink-700 border-pink-200",
	Support: "bg-cyan-50 text-cyan-700 border-cyan-200",
	Developer: "bg-blue-50 text-blue-700 border-blue-200"
};
function FeedbackSnippet({ item }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
		href: item.url,
		target: "_blank",
		rel: "noopener noreferrer",
		className: "group flex flex-col gap-1 rounded-md border border-border/50 bg-background px-3 py-2.5 hover:border-border transition-colors",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs font-medium text-foreground line-clamp-1 group-hover:underline",
					children: item.title || item.snippet.slice(0, 80)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-3 w-3 flex-shrink-0 text-muted-foreground opacity-0 group-hover:opacity-70 transition-opacity mt-0.5" })]
			}),
			item.snippet && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] text-muted-foreground line-clamp-2 leading-relaxed",
				children: item.snippet
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-[10px] font-medium text-muted-foreground/70 uppercase tracking-wide",
				children: SOURCE_LABELS[item.source]
			})
		]
	});
}
function ActionRow({ action, detailRef }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const s = PRIORITY_STYLES[action.priority];
	const preview = action.items.slice(0, 3);
	const remaining = action.items.length - preview.length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `rounded-lg border overflow-hidden transition-all duration-150 ${open ? "border-border shadow-sm" : "border-border/60 hover:border-border hover:shadow-sm"}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			className: `w-full flex gap-0 text-left cursor-pointer transition-colors duration-150 ${open ? "bg-muted/40" : "bg-card hover:bg-muted/20"}`,
			onClick: () => setOpen((v) => !v),
			"aria-expanded": open,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `w-1.5 flex-shrink-0 self-stretch ${s.bar}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-1 items-center gap-3 py-3.5 px-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: `flex-shrink-0 ${s.text}`,
						children: action.icon
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1 min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm font-semibold text-foreground",
									children: action.heading
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${s.badge}`,
									children: PRIORITY_LABEL[action.priority]
								}),
								action.persona.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${PERSONA_STYLE[p] ?? "bg-muted text-muted-foreground border-border"}`,
									children: p
								}, p))
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-0.5 text-xs text-muted-foreground leading-relaxed",
							children: action.detail
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: `flex-shrink-0 inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[11px] font-medium transition-colors ${open ? `${s.badge}` : "border-border/60 bg-muted/30 text-muted-foreground hover:bg-muted"}`,
						children: open ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { className: "h-3.5 w-3.5" }), " Hide"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-3.5 w-3.5" }),
							" View ",
							action.items.length
						] })
					})
				]
			})]
		}), open && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: `px-4 pb-4 pt-2 space-y-2 ${s.snippetBg}`,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2",
					children: "Related feedback"
				}),
				preview.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FeedbackSnippet, { item }, item.id)),
				remaining > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
					href: `#${detailRef}`,
					className: `inline-flex items-center gap-1 text-xs font-medium mt-1 ${s.text} hover:underline`,
					onClick: (e) => {
						e.preventDefault();
						document.getElementById(detailRef)?.scrollIntoView({
							behavior: "smooth",
							block: "start"
						});
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-3 w-3" }),
						"View ",
						remaining,
						" more in detail below"
					]
				})
			]
		})]
	});
}
function ActionReport({ items, detailSectionId = "feedback-detail" }) {
	const actions = buildActionItems(items);
	if (actions.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "border-border/70 bg-card p-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground mb-3",
			children: "Action Report"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: "Not enough feedback items to generate action items yet."
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "border-border/70 bg-card p-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex items-center justify-between mb-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground",
				children: "Action Report"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-0.5 text-xs text-muted-foreground",
				children: [
					actions.length,
					" prioritised action",
					actions.length > 1 ? "s" : "",
					" · click ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "View N" }),
					" on any row to see related feedback"
				]
			})] })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-2",
			children: actions.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionRow, {
				action: a,
				detailRef: detailSectionId
			}, a.id))
		})]
	});
}
var Popover = Root2;
var PopoverTrigger = Trigger;
var PopoverContent = import_react.forwardRef(({ className, align = "center", sideOffset = 4, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
	ref,
	align,
	sideOffset,
	className: cn("z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-popover-content-transform-origin)", className),
	...props
}) }));
PopoverContent.displayName = Content2.displayName;
var FALLBACK = {
	primary: "#5b4ee0",
	positive: "#1f9d6d",
	negative: "#dc4b3e",
	warn: "#e5a533",
	muted: "#eef0f4",
	mutedFg: "#6b7280",
	border: "#e4e7ec"
};
function useThemeColors() {
	const [c, setC] = (0, import_react.useState)(FALLBACK);
	(0, import_react.useEffect)(() => {
		const s = getComputedStyle(document.documentElement);
		const read = (k, f) => {
			return s.getPropertyValue(k).trim() || f;
		};
		setC({
			primary: read("--primary", FALLBACK.primary),
			positive: read("--positive", FALLBACK.positive),
			negative: read("--negative", FALLBACK.negative),
			warn: read("--warn", FALLBACK.warn),
			muted: read("--muted", FALLBACK.muted),
			mutedFg: read("--muted-foreground", FALLBACK.mutedFg),
			border: read("--border", FALLBACK.border)
		});
	}, []);
	return c;
}
function mix(a, b, pct) {
	return `color-mix(in oklab, ${a} ${pct}%, ${b})`;
}
function StatCard({ label, labelRight, children, tone = "default" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: `relative overflow-hidden border-border/70 p-5 ${tone === "score" ? "bg-score-bg" : "bg-card"}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground",
				children: label
			}), labelRight]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-3",
			children
		})]
	});
}
function trendIcon(t) {
	if (t === "rising") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-3.5 w-3.5 text-positive" });
	if (t === "falling") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingDown, { className: "h-3.5 w-3.5 text-negative" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { className: "h-3.5 w-3.5 text-muted-foreground" });
}
function DashboardStats({ scorecard, items, compact = false }) {
	const c = useThemeColors();
	const breakdown = [
		{
			name: "Critical",
			value: items.filter((i) => i.severity === "critical").length,
			fill: c.negative
		},
		{
			name: "Major",
			value: items.filter((i) => i.severity === "major").length,
			fill: mix(c.negative, "white", 70)
		},
		{
			name: "Minor",
			value: items.filter((i) => i.severity === "minor").length,
			fill: c.warn
		},
		{
			name: "Pos. high",
			value: items.filter((i) => i.impact === "high").length,
			fill: c.positive
		},
		{
			name: "Pos. low",
			value: items.filter((i) => i.impact === "low").length,
			fill: mix(c.positive, "white", 50)
		}
	].filter((d) => d.value > 0);
	const volume = Object.entries(scorecard.bySource).filter(([, n]) => n > 0).map(([s, n]) => ({
		source: SOURCE_LABELS[s],
		count: n
	}));
	const buckets = 6;
	const trendData = items.length > 0 ? Array.from({ length: buckets }, (_, i) => {
		const slice = items.slice(Math.floor(i / buckets * items.length), Math.floor((i + 1) / buckets * items.length));
		if (slice.length === 0) return {
			x: i + 1,
			score: scorecard.score
		};
		const pos = slice.filter((s) => s.sentiment === "positive").length;
		const neg = slice.filter((s) => s.sentiment === "negative").length;
		const score = Math.round(50 + (pos - neg) / slice.length * 50);
		return {
			x: i + 1,
			score: Math.max(0, Math.min(100, score))
		};
	}) : [];
	const chartH = compact ? 140 : 200;
	const barH = compact ? 160 : 240;
	if (compact) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid grid-cols-2 gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(StatCard, {
			label: "Breakdown",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				style: { height: chartH },
				children: breakdown.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid h-full place-items-center text-xs text-muted-foreground",
					children: "No data"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
					width: "100%",
					height: "100%",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pie, {
						data: breakdown,
						dataKey: "value",
						nameKey: "name",
						innerRadius: 35,
						outerRadius: 58,
						paddingAngle: 2,
						stroke: "none",
						children: breakdown.map((d, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: d.fill }, i))
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
						borderRadius: 8,
						border: `1px solid ${c.border}`,
						fontSize: 11
					} })] })
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-1 flex flex-wrap gap-x-2 gap-y-1 text-[10px]",
				children: breakdown.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "inline-flex items-center gap-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "h-2 w-2 rounded-full flex-shrink-0",
							style: { background: d.fill }
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted-foreground",
							children: d.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-medium",
							children: d.value
						})
					]
				}, d.name))
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
			label: "Volume by Source",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				style: { height: barH },
				children: volume.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid h-full place-items-center text-xs text-muted-foreground",
					children: "No data"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
					width: "100%",
					height: "100%",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
						data: volume,
						margin: {
							top: 8,
							right: 6,
							left: -22,
							bottom: 24
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
								dataKey: "source",
								tick: {
									fontSize: 9,
									fill: c.mutedFg
								},
								axisLine: false,
								tickLine: false,
								interval: 0,
								angle: -20,
								textAnchor: "end",
								height: 32
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
								tick: {
									fontSize: 9,
									fill: c.mutedFg
								},
								axisLine: false,
								tickLine: false,
								allowDecimals: false,
								width: 24
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
								cursor: { fill: c.muted },
								contentStyle: {
									borderRadius: 8,
									border: `1px solid ${c.border}`,
									fontSize: 11
								}
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
								dataKey: "count",
								fill: c.primary,
								radius: [
									4,
									4,
									0,
									0
								]
							})
						]
					})
				})
			})
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(StatCard, {
				label: "Sentiment Score",
				tone: "score",
				labelRight: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Popover, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverTrigger, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "inline-flex items-center text-muted-foreground hover:text-foreground transition-colors",
						"aria-label": "How is this score calculated?",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "h-3.5 w-3.5" })
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PopoverContent, {
					side: "right",
					align: "start",
					className: "w-72 text-xs space-y-2.5 p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-semibold text-sm",
							children: "How the score is calculated"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-muted-foreground leading-relaxed",
							children: [
								"Each feedback item is weighted by its ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "source trust" }),
								" (G2 & Capterra count 2×, Reddit 0.8×) and its ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "sentiment strength" }),
								":"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "space-y-1 text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
									"🟢 ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Positive — high impact" }),
									" (e.g. \"game-changer\", \"highly recommend\"): 1.5×"
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
									"🟡 ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Positive — low impact" }),
									": 1.0×"
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
									"⚪ ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Neutral" }),
									": 0.5× (dampens extremes)"
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
									"🟠 ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Negative — minor" }),
									": 1.0×"
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
									"🔴 ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Negative — major" }),
									" (bugs, complaints): 1.5×"
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
									"🚨 ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Critical" }),
									" (outage, data loss): 2.0×"
								] })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-muted-foreground leading-relaxed",
							children: [
								"The final score is ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
									className: "bg-muted px-1 rounded",
									children: "50 + (positive − negative) ÷ total_weight × 50"
								}),
								", always between 0 and 100."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-muted-foreground",
							children: [
								"A score of ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "50" }),
								" is neutral. Above 65 = rising, below 40 = falling."
							]
						})
					]
				})] }),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-baseline gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-serif text-5xl font-semibold text-positive",
							children: scorecard.score
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-sm text-muted-foreground",
							children: "/ 100"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-1 flex items-center gap-1.5 text-sm font-medium capitalize text-foreground/80",
						children: [
							trendIcon(scorecard.trend),
							" ",
							scorecard.trend
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-3 text-xs text-muted-foreground",
						children: [
							"Weighted by severity & impact across ",
							scorecard.total,
							" feedback item",
							scorecard.total === 1 ? "" : "s",
							"."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex items-center gap-1.5 text-xs text-muted-foreground",
						children: [
							trendIcon(scorecard.trend),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: scorecard.delta >= 0 ? "text-positive" : "text-negative",
								children: [scorecard.delta >= 0 ? "+" : "", scorecard.delta]
							}),
							" ",
							"vs baseline"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("hr", { className: "my-4 border-border" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-3 gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-serif text-2xl",
								children: scorecard.total
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[10px] uppercase tracking-wider text-muted-foreground",
								children: "Total"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-serif text-2xl text-negative",
								children: items.filter((i) => i.sentiment === "negative").length
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[10px] uppercase tracking-wider text-muted-foreground",
								children: "Negative"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-serif text-2xl text-positive",
								children: items.filter((i) => i.sentiment === "positive").length
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[10px] uppercase tracking-wider text-muted-foreground",
								children: "Positive"
							})] })
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(StatCard, {
				label: "Breakdown",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-[200px]",
					children: breakdown.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid h-full place-items-center text-xs text-muted-foreground",
						children: "No data"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: "100%",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pie, {
							data: breakdown,
							dataKey: "value",
							nameKey: "name",
							innerRadius: 50,
							outerRadius: 85,
							paddingAngle: 2,
							stroke: "none",
							children: breakdown.map((d, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: d.fill }, i))
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
							borderRadius: 8,
							border: `1px solid ${c.border}`,
							fontSize: 12
						} })] })
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[11px]",
					children: breakdown.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex items-center gap-1.5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "h-2 w-2 rounded-full",
								style: { background: d.fill }
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground",
								children: d.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium",
								children: d.value
							})
						]
					}, d.name))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
				label: "Volume by Source",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-[240px]",
					children: volume.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid h-full place-items-center text-xs text-muted-foreground",
						children: "No data"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: "100%",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
							data: volume,
							margin: {
								top: 10,
								right: 8,
								left: -18,
								bottom: 28
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
									dataKey: "source",
									tick: {
										fontSize: 10,
										fill: c.mutedFg
									},
									axisLine: false,
									tickLine: false,
									interval: 0,
									angle: -30,
									textAnchor: "end",
									height: 40
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
									tick: {
										fontSize: 10,
										fill: c.mutedFg
									},
									axisLine: false,
									tickLine: false,
									allowDecimals: false,
									width: 28
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
									cursor: { fill: c.muted },
									contentStyle: {
										borderRadius: 8,
										border: `1px solid ${c.border}`,
										fontSize: 12
									}
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
									dataKey: "count",
									fill: c.primary,
									radius: [
										6,
										6,
										0,
										0
									]
								})
							]
						})
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
				label: "Sentiment Over Time",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-[240px]",
					children: trendData.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid h-full place-items-center text-xs text-muted-foreground",
						children: "No data"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: "100%",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
							data: trendData,
							margin: {
								top: 10,
								right: 12,
								left: -10,
								bottom: 8
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
									dataKey: "x",
									hide: true
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
									domain: [0, 100],
									tick: {
										fontSize: 10,
										fill: c.mutedFg
									},
									axisLine: false,
									tickLine: false,
									width: 28
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
									borderRadius: 8,
									border: `1px solid ${c.border}`,
									fontSize: 12
								} }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
									type: "monotone",
									dataKey: "score",
									stroke: c.primary,
									strokeWidth: 2,
									dot: {
										r: 3,
										fill: c.primary
									}
								})
							]
						})
					})
				})
			})
		]
	});
}
function TopThemes({ scorecard }) {
	if (scorecard.themes.length === 0) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "border-border/70 bg-card p-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground",
			children: "Top Themes"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-3 flex flex-wrap gap-2",
			children: scorecard.themes.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "inline-flex items-center gap-2 rounded-full border border-border bg-muted px-3 py-1.5 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-medium",
					children: CATEGORY_LABELS[t.category]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-foreground px-1.5 text-[10px] font-semibold text-background",
					children: t.count
				})]
			}, t.category))
		})]
	});
}
var Checkbox = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox$1, {
	ref,
	className: cn("grid place-content-center peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckboxIndicator, {
		className: cn("grid place-content-center text-current"),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" })
	})
}));
Checkbox.displayName = Checkbox$1.displayName;
var Dialog = Dialog$1;
var DialogTrigger = DialogTrigger$1;
var DialogPortal = DialogPortal$1;
var DialogOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay$1, {
	ref,
	className: cn("fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props
}));
DialogOverlay.displayName = DialogOverlay$1.displayName;
var DialogContent = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
	ref,
	className: cn("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
		className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: "Close"
		})]
	})]
})] }));
DialogContent.displayName = DialogContent$1.displayName;
var DialogHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col space-y-1.5 text-center sm:text-left", className),
	...props
});
DialogHeader.displayName = "DialogHeader";
var DialogFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
DialogFooter.displayName = "DialogFooter";
var DialogTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle$1, {
	ref,
	className: cn("text-lg font-semibold leading-none tracking-tight", className),
	...props
}));
DialogTitle.displayName = DialogTitle$1.displayName;
var DialogDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription$1, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
DialogDescription.displayName = DialogDescription$1.displayName;
var labelVariants = cva("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70");
var Label = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root, {
	ref,
	className: cn(labelVariants(), className),
	...props
}));
Label.displayName = Root.displayName;
function EditViewDialog({ view, onUpdated }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [name, setName] = (0, import_react.useState)(view.name);
	const [keyword, setKeyword] = (0, import_react.useState)(view.keyword);
	const [sources, setSources] = (0, import_react.useState)(new Set(view.sources));
	const [timeframe, setTimeframe] = (0, import_react.useState)(view.timeframe);
	const { updateView } = useSavedViews();
	(0, import_react.useEffect)(() => {
		if (open) {
			setName(view.name);
			setKeyword(view.keyword);
			setSources(new Set(view.sources));
			setTimeframe(view.timeframe);
		}
	}, [open, view]);
	const toggleSource = (s) => {
		setSources((cur) => {
			const next = new Set(cur);
			if (next.has(s)) next.delete(s);
			else next.add(s);
			return next;
		});
	};
	const onSave = () => {
		if (!name.trim() || !keyword.trim() || sources.size === 0) return;
		const patch = {
			name: name.trim(),
			keyword: keyword.trim(),
			sources: [...sources],
			timeframe
		};
		updateView(view.id, patch);
		onUpdated?.(patch);
		toast.success("View updated");
		setOpen(false);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
		open,
		onOpenChange: setOpen,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "outline",
				size: "sm",
				className: "gap-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PenLine, { className: "h-3.5 w-3.5" }), "Edit View"]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "sm:max-w-md",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Edit saved view" }) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "ev-name",
								children: "View name"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "ev-name",
								value: name,
								onChange: (e) => setName(e.target.value),
								placeholder: "e.g. Zoho Mail"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "ev-keyword",
								children: "Search keyword"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "ev-keyword",
								value: keyword,
								onChange: (e) => setKeyword(e.target.value),
								placeholder: "e.g. Zoho Mail"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Sources" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-wrap gap-4",
								children: ALL_SOURCES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
										id: `ev-src-${s}`,
										checked: sources.has(s),
										onCheckedChange: () => toggleSource(s)
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										htmlFor: `ev-src-${s}`,
										className: "text-sm cursor-pointer",
										children: SOURCE_LABELS[s]
									})]
								}, s))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "ev-timeframe",
								children: "Timeframe"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: timeframe,
								onValueChange: (v) => setTimeframe(v),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									id: "ev-timeframe",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "day",
										children: "Past 24h"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "week",
										children: "Past Week"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "month",
										children: "Past Month"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "year",
										children: "Past Year"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "all",
										children: "All Time"
									})
								] })]
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					onClick: () => setOpen(false),
					children: "Cancel"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: onSave,
					disabled: !name.trim() || !keyword.trim() || sources.size === 0,
					children: "Save changes"
				})] })
			]
		})]
	});
}
var SECTIONS = [
	{
		id: "critical",
		label: "Critical Issues",
		blurb: "Outages, blocking failures, or trust-breaking complaints — escalate immediately",
		accentBg: "bg-red-50",
		accentBorder: "border-red-200",
		accentText: "text-red-700",
		headerBg: "bg-red-100",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OctagonAlert, { className: "h-4 w-4" }),
		match: (i) => i.sentiment === "negative" && i.severity === "critical"
	},
	{
		id: "major",
		label: "Major Issues",
		blurb: "Reproducible defects & strong frustration to triage",
		accentBg: "bg-orange-50",
		accentBorder: "border-orange-200",
		accentText: "text-orange-700",
		headerBg: "bg-orange-100",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-4 w-4" }),
		match: (i) => i.sentiment === "negative" && i.severity === "major"
	},
	{
		id: "minor",
		label: "Minor Issues",
		blurb: "Friction worth tracking but not urgent",
		accentBg: "bg-yellow-50",
		accentBorder: "border-yellow-200",
		accentText: "text-yellow-700",
		headerBg: "bg-yellow-50",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-4 w-4" }),
		match: (i) => i.sentiment === "negative" && i.severity === "minor"
	},
	{
		id: "pos-high",
		label: "Positive — High Impact",
		blurb: "Strong promoters and enthusiastic praise — surface to marketing & sales",
		accentBg: "bg-emerald-50",
		accentBorder: "border-emerald-200",
		accentText: "text-emerald-700",
		headerBg: "bg-emerald-100",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4" }),
		match: (i) => i.sentiment === "positive" && i.impact === "high"
	},
	{
		id: "pos-low",
		label: "Positive — Low Impact",
		blurb: "Mild positives that boost the baseline",
		accentBg: "bg-emerald-50",
		accentBorder: "border-emerald-200",
		accentText: "text-emerald-700",
		headerBg: "bg-emerald-50",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ThumbsUp, { className: "h-4 w-4" }),
		match: (i) => i.sentiment === "positive" && i.impact === "low"
	},
	{
		id: "neutral",
		label: "Neutral & Questions",
		blurb: "Mentions, queries, and context to monitor",
		accentBg: "bg-slate-50",
		accentBorder: "border-slate-200",
		accentText: "text-slate-600",
		headerBg: "bg-slate-100",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "h-4 w-4" }),
		match: (i) => i.sentiment === "neutral"
	}
];
function ItemCard({ item, accentBorder, accentText, accentBg }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `rounded-xl border ${accentBorder} bg-white shadow-sm transition-shadow hover:shadow-md`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: `flex items-center justify-between gap-2 rounded-t-xl ${accentBg} px-4 py-2.5`,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: `rounded-full border ${accentBorder} bg-white px-2.5 py-0.5 text-[11px] font-semibold ${accentText}`,
					children: SOURCE_LABELS[item.source]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "rounded-full bg-white/80 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-slate-500",
					children: CATEGORY_LABELS[item.category]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "shrink-0 text-[10px] font-semibold uppercase tracking-widest text-slate-400",
				children: "AI Classified"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "px-4 pb-4 pt-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "line-clamp-2 text-sm font-semibold leading-snug text-slate-900",
					children: item.title || item.url
				}),
				item.snippet && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1.5 line-clamp-3 text-sm leading-relaxed text-slate-500",
					children: item.snippet
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 flex items-end justify-between gap-3 border-t border-slate-100 pt-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: `text-xs italic ${accentText} opacity-80`,
						children: item.reason
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: item.url,
						target: "_blank",
						rel: "noreferrer",
						className: `inline-flex shrink-0 items-center gap-1 rounded-lg border ${accentBorder} px-2.5 py-1 text-xs font-semibold ${accentText} transition-colors hover:bg-white`,
						children: ["Open ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-3 w-3" })]
					})]
				})
			]
		})]
	});
}
function FeedbackSections({ items }) {
	if (items.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground",
		children: "No mentions surfaced. Try a different keyword or broaden the timeframe."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "space-y-8",
		children: SECTIONS.map((s) => ({
			section: s,
			items: items.filter(s.match)
		})).filter((g) => g.items.length > 0).map(({ section, items: sItems }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: `mb-4 flex items-center gap-3 rounded-xl border ${section.accentBorder} ${section.headerBg} px-4 py-3`,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: section.accentText,
				children: section.icon
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1 min-w-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: `text-sm font-bold ${section.accentText}`,
						children: section.label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: `rounded-full border ${section.accentBorder} bg-white px-2 py-0.5 text-xs font-bold ${section.accentText}`,
						children: sItems.length
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-0.5 text-xs text-slate-500",
					children: section.blurb
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-3 md:grid-cols-2",
			children: sItems.map((it) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemCard, {
				item: it,
				accentBorder: section.accentBorder,
				accentText: section.accentText,
				accentBg: section.accentBg
			}, it.id))
		})] }, section.id))
	});
}
function FilterBar({ sources, activeSources, toggleSource, themes, themeFilter, setThemeFilter, query, setQuery, shown, total }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card p-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "inline-flex items-center gap-1.5 pl-1 text-sm font-medium text-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Funnel, { className: "h-3.5 w-3.5 text-muted-foreground" }), " Filter by"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-1.5",
				children: sources.map((s) => {
					const active = activeSources.has(s);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => toggleSource(s),
						className: cn("inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition-colors", active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-accent"),
						children: [active && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							"aria-hidden": true,
							children: "✓"
						}), SOURCE_LABELS[s]]
					}, s);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
				value: themeFilter,
				onValueChange: (v) => setThemeFilter(v),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
					className: "h-8 w-40 text-xs",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "All themes" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
					value: "all",
					children: "All themes"
				}), themes.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
					value: t.category,
					children: [
						CATEGORY_LABELS[t.category],
						" (",
						t.count,
						")"
					]
				}, t.category))] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative ml-auto w-full max-w-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: query,
					onChange: (e) => setQuery(e.target.value),
					placeholder: "Search within results…",
					className: "h-8 pl-8 text-xs"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "text-xs text-muted-foreground",
				children: [
					"Showing ",
					shown,
					" of ",
					total
				]
			})
		]
	});
}
var KNOWN_RATINGS = {
	"Zoho Mail": {
		g2: 4.4,
		capterra: 4.5,
		g2ReviewCount: 520,
		capterraReviewCount: 310,
		g2Url: "https://www.g2.com/products/zoho-mail/reviews",
		capterraUrl: "https://www.capterra.com/search/?query=Zoho+Mail"
	},
	"Zoho Calendar": {
		g2: 4.3,
		capterra: 4.3,
		g2ReviewCount: 180,
		capterraReviewCount: 95,
		g2Url: "https://www.g2.com/products/zoho-calendar/reviews",
		capterraUrl: "https://www.capterra.com/search/?query=Zoho+Calendar"
	},
	"ZeptoMail": {
		g2: 4.5,
		capterra: 4.7,
		g2ReviewCount: 140,
		capterraReviewCount: 78,
		g2Url: "https://www.g2.com/products/zeptomail/reviews",
		capterraUrl: "https://www.capterra.com/search/?query=ZeptoMail"
	}
};
function getRatings(keyword) {
	const key = Object.keys(KNOWN_RATINGS).find((k) => k.toLowerCase() === keyword.toLowerCase());
	return key ? KNOWN_RATINGS[key] : null;
}
function MiniStars({ score, color }) {
	const filled = Math.round(score);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "inline-flex items-center gap-0.5",
		style: { color },
		children: Array.from({ length: 5 }, (_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, {
			className: "h-3 w-3",
			fill: i < filled ? "currentColor" : "none",
			strokeWidth: 1.5
		}, i))
	});
}
function TrendIcon({ trend }) {
	if (trend === "rising") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-3.5 w-3.5 text-emerald-500" });
	if (trend === "falling") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingDown, { className: "h-3.5 w-3.5 text-red-500" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { className: "h-3.5 w-3.5 text-muted-foreground" });
}
var SCORE_COLOR = (s) => s >= 65 ? "text-emerald-600" : s <= 40 ? "text-red-500" : "text-amber-600";
function ScoreSummaryBar({ scorecard, keyword }) {
	const ratings = getRatings(keyword);
	const platforms = [{
		key: "g2",
		label: "G2",
		color: "#FF492C",
		score: ratings?.g2 ?? null,
		url: ratings?.g2Url ?? `https://www.g2.com/search?q=${encodeURIComponent(keyword)}`
	}, {
		key: "capterra",
		label: "Capterra",
		color: "#3E86F5",
		score: ratings?.capterra ?? null,
		url: ratings?.capterraUrl ?? `https://www.capterra.com/search/?query=${encodeURIComponent(keyword)}`
	}];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-wrap items-center gap-px rounded-xl border border-border/60 bg-card overflow-hidden divide-x divide-border/60",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2.5 px-5 py-3.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] font-semibold uppercase tracking-widest text-muted-foreground",
							children: "Sentiment"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Popover, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverTrigger, {
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								className: "text-muted-foreground hover:text-foreground transition-colors",
								"aria-label": "How is this score calculated?",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "h-3 w-3" })
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PopoverContent, {
							side: "bottom",
							align: "start",
							className: "w-72 text-xs space-y-2 p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-semibold text-sm",
									children: "How the score is calculated"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-muted-foreground leading-relaxed",
									children: [
										"Each item is weighted by ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "source trust" }),
										" (G2 & Capterra = 2×, Reddit = 0.8×) and ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "sentiment strength" }),
										":"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
									className: "space-y-1 text-muted-foreground",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "🟢 Positive high-impact (e.g. \"game-changer\"): 1.5×" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "🟡 Positive low: 1.0× · ⚪ Neutral: 0.5×" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "🟠 Negative minor: 1.0× · 🔴 Major bug: 1.5×" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "🚨 Critical (outage/data loss): 2.0×" })
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-muted-foreground",
									children: [
										"Formula: ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
											className: "bg-muted px-1 rounded",
											children: "50 + (pos − neg) ÷ total × 50"
										}),
										". Always 0–100. Score 50 = neutral; above 65 = rising, below 40 = falling."
									]
								})
							]
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-baseline gap-1.5 mt-0.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `font-serif text-2xl font-semibold ${SCORE_COLOR(scorecard.score)}`,
							children: scorecard.score
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-muted-foreground",
							children: "/ 100"
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1 text-xs text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendIcon, { trend: scorecard.trend }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "capitalize",
						children: scorecard.trend
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "px-3 py-3.5 self-stretch flex items-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-[10px] uppercase tracking-widest text-muted-foreground/60 rotate-0",
					children: "Platform Ratings"
				})
			}),
			platforms.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
				href: p.url,
				target: "_blank",
				rel: "noopener noreferrer",
				className: "group flex items-center gap-3 px-5 py-3.5 hover:bg-muted/40 transition-colors",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] font-semibold uppercase tracking-widest",
							style: { color: p.color },
							children: p.label
						}), p.score !== null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-baseline gap-1 mt-0.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-serif text-2xl font-semibold text-foreground",
								children: p.score.toFixed(1)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-muted-foreground",
								children: "/ 5"
							})]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-serif text-xl text-muted-foreground mt-0.5",
							children: "—"
						})]
					}),
					p.score !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniStars, {
						score: p.score,
						color: p.color
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-60 transition-opacity ml-1" })
				]
			}, p.key)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-4 px-5 py-3.5 ml-auto",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-serif text-lg font-medium text-foreground",
							children: scorecard.total
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[10px] uppercase tracking-wider text-muted-foreground",
							children: "Items"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "font-serif text-lg font-medium text-red-500",
							children: [scorecard.negativePct, "%"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[10px] uppercase tracking-wider text-muted-foreground",
							children: "Negative"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "font-serif text-lg font-medium text-emerald-600",
							children: [scorecard.positivePct, "%"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[10px] uppercase tracking-wider text-muted-foreground",
							children: "Positive"
						})]
					})
				]
			})
		]
	});
}
function SaveViewDialog({ keyword, sources, timeframe }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [name, setName] = (0, import_react.useState)(keyword);
	const { addView } = useSavedViews();
	const navigate = useNavigate();
	const onSave = () => {
		if (!name.trim()) return;
		const view = addView({
			name: name.trim(),
			keyword,
			sources,
			timeframe
		});
		toast.success("View saved");
		setOpen(false);
		navigate({
			to: "/search",
			search: {
				q: keyword,
				sources: sources.join(","),
				timeframe,
				view: view.id
			},
			replace: true
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
		open,
		onOpenChange: setOpen,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "outline",
				size: "sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bookmark, { className: "mr-1.5 h-4 w-4" }), "Save view"]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Save this view" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Re-run the same keyword, sources, and timeframe later in one click." })] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "view-name",
					children: "Name"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: "view-name",
					value: name,
					onChange: (e) => setName(e.target.value),
					placeholder: "e.g. Notion — past month"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: onSave,
				disabled: !name.trim(),
				children: "Save view"
			}) })
		] })]
	});
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
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
var fetchFeedback = createServerFn({ method: "POST" }).inputValidator((input) => inputSchema.parse(input)).handler(createSsrRpc("f6744d6cce096299c2f47e1badbf4073553b183f5ea881452a4d14e5b9fd4659"));
var CACHE_TTL = 360 * 60 * 1e3;
function getCached(key) {
	try {
		const raw = localStorage.getItem(`vox-pulse:cache:v2:${key}`);
		if (!raw) return null;
		const { data, ts } = JSON.parse(raw);
		if (Date.now() - ts > CACHE_TTL) return null;
		return data;
	} catch {
		return null;
	}
}
function setCached(key, data) {
	try {
		localStorage.setItem(`vox-pulse:cache:v2:${key}`, JSON.stringify({
			data,
			ts: Date.now()
		}));
	} catch {}
}
function getCacheTimestamp(key) {
	try {
		const raw = localStorage.getItem(`vox-pulse:cache:v2:${key}`);
		if (!raw) return null;
		const { ts } = JSON.parse(raw);
		return typeof ts === "number" ? ts : null;
	} catch {
		return null;
	}
}
function formatTimeLeft(ts) {
	const left = CACHE_TTL - (Date.now() - ts);
	if (left <= 0) return "expiring";
	const h = Math.floor(left / 36e5);
	const m = Math.floor(left % 36e5 / 6e4);
	return h > 0 ? `${h}h ${m}m` : `${m}m`;
}
function SearchPage() {
	const { q, sources, timeframe, view } = Route.useSearch();
	const navigate = useNavigate();
	const { views, updateView } = useSavedViews();
	const sourceList = sources.split(",").map((s) => s.trim()).filter((s) => ALL_SOURCES.includes(s));
	const fetchFn = useServerFn(fetchFeedback);
	const enabled = q.trim().length >= 2 && sourceList.length > 0;
	const cacheKey = `${q.trim()}|${sourceList.join(",")}|${timeframe}`;
	const query = useQuery({
		queryKey: [
			"feedback",
			q,
			sourceList.join(","),
			timeframe
		],
		queryFn: async () => {
			const cached = getCached(cacheKey);
			if (cached) return cached;
			const result = await fetchFn({ data: {
				keyword: q.trim(),
				sources: sourceList,
				timeframe
			} });
			setCached(cacheKey, result);
			return result;
		},
		enabled,
		staleTime: CACHE_TTL,
		gcTime: CACHE_TTL
	});
	const savedView = (0, import_react.useMemo)(() => views.find((v) => v.id === view), [views, view]);
	(0, import_react.useEffect)(() => {
		if (savedView && query.data && query.data.scorecard.score !== savedView.lastScore) updateView(savedView.id, { lastScore: query.data.scorecard.score });
	}, [savedView?.id, query.data?.scorecard.score]);
	const [, setTick] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		const id = setInterval(() => setTick((n) => n + 1), 6e4);
		return () => clearInterval(id);
	}, []);
	const cacheTs = getCacheTimestamp(cacheKey);
	const isCached = cacheTs !== null && Date.now() - cacheTs < CACHE_TTL;
	const [activeSources, setActiveSources] = (0, import_react.useState)(new Set(sourceList));
	(0, import_react.useEffect)(() => setActiveSources(new Set(sourceList)), [sources]);
	const [themeFilter, setThemeFilter] = (0, import_react.useState)("all");
	const [textQ, setTextQ] = (0, import_react.useState)("");
	const filteredItems = (0, import_react.useMemo)(() => {
		if (!query.data) return [];
		return query.data.items.filter((i) => {
			if (!activeSources.has(i.source)) return false;
			if (themeFilter !== "all" && i.category !== themeFilter) return false;
			if (textQ.trim()) {
				const t = textQ.toLowerCase();
				if (!`${i.title} ${i.snippet}`.toLowerCase().includes(t)) return false;
			}
			return true;
		});
	}, [
		query.data,
		activeSources,
		themeFilter,
		textQ
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto w-full max-w-[1400px] px-6 py-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-start justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground",
							children: savedView ? "Saved View" : "Search"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-1 font-serif text-4xl font-medium tracking-tight",
							children: savedView?.name || q || "Untitled"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1 text-foreground/70",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link2, { className: "h-3 w-3" }),
										" \"",
										q,
										"\""
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "·" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: sourceList.map((s) => SOURCE_LABELS[s]).join(" / ") }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "·" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-full bg-accent px-2 py-0.5 text-accent-foreground",
									children: {
										day: "Past 24h",
										week: "Past Week",
										month: "Past Month",
										year: "Past Year",
										all: "All Time"
									}[timeframe]
								}),
								isCached && cacheTs && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "·" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 px-2 py-0.5 text-amber-700",
									title: "Results are cached. Refresh is blocked until the cache expires to save API credits.",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-2.5 w-2.5" }),
										"Cached · refreshes in ",
										formatTimeLeft(cacheTs)
									]
								})] }),
								savedView && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "·" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Updated ", new Date(savedView.updatedAt).toLocaleDateString()] })] })
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-shrink-0 items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							size: "sm",
							onClick: () => {
								if (isCached && cacheTs) localStorage.removeItem(`vox-pulse:cache:v2:${cacheKey}`);
								query.refetch();
							},
							disabled: query.isFetching || !enabled || isCached,
							title: isCached && cacheTs ? `Data is cached for 6h to save API credits. Refreshes in ${formatTimeLeft(cacheTs)}.` : void 0,
							className: "gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: `h-3.5 w-3.5 ${query.isFetching ? "animate-spin" : ""}` }), "Refresh"]
						}),
						enabled && !savedView && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SaveViewDialog, {
							keyword: q.trim(),
							sources: sourceList,
							timeframe
						}),
						savedView && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditViewDialog, {
							view: savedView,
							onUpdated: (patch) => {
								const oldKey = `${q.trim()}|${sourceList.join(",")}|${timeframe}`;
								const newKey = `${patch.keyword}|${patch.sources.join(",")}|${patch.timeframe}`;
								localStorage.removeItem(`vox-pulse:cache:v2:${oldKey}`);
								localStorage.removeItem(`vox-pulse:cache:v2:${newKey}`);
								navigate({
									to: "/search",
									search: {
										q: patch.keyword,
										sources: patch.sources.join(","),
										timeframe: patch.timeframe,
										view: savedView.id
									}
								});
							}
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "sm",
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/",
								children: "New search"
							})
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 space-y-5",
				children: !enabled ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground",
					children: "Enter a keyword and pick at least one source to start listening."
				}) : query.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-14 w-full rounded-xl" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-40 w-full" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid gap-3 md:grid-cols-2",
						children: Array.from({ length: 2 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-48 w-full" }, i))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid gap-3 md:grid-cols-2",
						children: Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-28 w-full" }, i))
					})
				] }) : query.isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-xl border border-destructive/40 bg-destructive/10 p-6 text-sm text-destructive",
					children: query.error instanceof Error ? query.error.message : "Something went wrong."
				}) : query.data ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScoreSummaryBar, {
						scorecard: query.data.scorecard,
						keyword: q
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionReport, { items: query.data.items }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 md:grid-cols-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "md:col-span-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DashboardStats, {
								scorecard: query.data.scorecard,
								items: query.data.items,
								compact: true
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TopThemes, { scorecard: query.data.scorecard }) })]
					}),
					Object.keys(query.data.errors).length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-lg border border-warn/40 bg-warn/10 p-3 text-xs text-foreground/70",
						children: [
							"Some sources returned no results:",
							" ",
							Object.entries(query.data.errors).map(([s]) => SOURCE_LABELS[s]).join(", ")
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						id: "feedback-detail",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mb-3 flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-sm font-semibold text-foreground",
									children: "Detailed Feedback"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-muted-foreground",
									children: "— filtered & classified by source"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterBar, {
								sources: sourceList,
								activeSources,
								toggleSource: (s) => {
									setActiveSources((cur) => {
										const next = new Set(cur);
										if (next.has(s)) next.delete(s);
										else next.add(s);
										return next;
									});
								},
								themes: query.data.scorecard.themes,
								themeFilter,
								setThemeFilter,
								query: textQ,
								setQuery: setTextQ,
								shown: filteredItems.length,
								total: query.data.items.length
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FeedbackSections, { items: filteredItems })
							})
						]
					})
				] }) : null
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "hidden",
				children: navigate.length
			})
		]
	}) }), query.data && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		style: {
			position: "fixed",
			bottom: "1.25rem",
			right: "1.25rem",
			zIndex: 9999
		},
		className: "flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50 px-3 py-1.5 text-[11px] font-medium shadow-md",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "h-3 w-3 text-amber-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "text-amber-800",
			children: [
				query.data.creditsUsed,
				" used",
				query.data.creditsRemaining != null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					" · ",
					query.data.creditsRemaining,
					" remaining"
				] })
			]
		})]
	})] });
}
//#endregion
export { SearchPage as component };
