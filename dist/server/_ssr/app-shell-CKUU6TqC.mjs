import { i as __toESM } from "../_runtime.mjs";
import { t as ALL_SOURCES } from "./types-CrR-3oB3.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { a as useRouterState, f as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as Slot, s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { d as Search, g as PanelLeftClose, h as PanelLeftOpen, k as ChartColumn, p as Plus } from "../_libs/lucide-react.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { a as Viewport, i as ScrollAreaThumb, n as Root, r as ScrollAreaScrollbar, t as Corner } from "../_libs/radix-ui__react-scroll-area.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app-shell-CKUU6TqC.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
			destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
			outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
			secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
			ghost: "hover:bg-accent hover:text-accent-foreground",
			link: "text-primary underline-offset-4 hover:underline"
		},
		size: {
			default: "h-9 px-4 py-2",
			sm: "h-8 rounded-md px-3 text-xs",
			lg: "h-10 rounded-md px-8",
			icon: "h-9 w-9"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		ref,
		...props
	});
});
Button.displayName = "Button";
var ScrollArea = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Root, {
	ref,
	className: cn("relative overflow-hidden", className),
	...props,
	children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Viewport, {
			className: "h-full w-full rounded-[inherit]",
			children
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollBar, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Corner, {})
	]
}));
ScrollArea.displayName = Root.displayName;
var ScrollBar = import_react.forwardRef(({ className, orientation = "vertical", ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollAreaScrollbar, {
	ref,
	orientation,
	className: cn("flex touch-none select-none transition-colors", orientation === "vertical" && "h-full w-2.5 border-l border-l-transparent p-[1px]", orientation === "horizontal" && "h-2.5 flex-col border-t border-t-transparent p-[1px]", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollAreaThumb, { className: "relative flex-1 rounded-full bg-border" })
}));
ScrollBar.displayName = ScrollAreaScrollbar.displayName;
var NOW = (/* @__PURE__ */ new Date()).toISOString();
var DEFAULT_VIEWS = [
	{
		id: "default-0",
		name: "Zoho Mail",
		keyword: "Zoho Mail",
		sources: ALL_SOURCES,
		timeframe: "year",
		createdAt: NOW,
		updatedAt: NOW
	},
	{
		id: "default-1",
		name: "Zoho Calendar",
		keyword: "Zoho Calendar",
		sources: ALL_SOURCES,
		timeframe: "year",
		createdAt: NOW,
		updatedAt: NOW
	},
	{
		id: "default-2",
		name: "ZeptoMail",
		keyword: "ZeptoMail",
		sources: ALL_SOURCES,
		timeframe: "year",
		createdAt: NOW,
		updatedAt: NOW
	}
];
var LS_KEY = "vox-pulse:saved-views";
function lsRead() {
	if (typeof window === "undefined") return [];
	try {
		const raw = localStorage.getItem(LS_KEY);
		if (!raw) return [];
		const parsed = JSON.parse(raw);
		return Array.isArray(parsed) ? parsed : [];
	} catch {
		return [];
	}
}
function lsWrite(views) {
	if (typeof window === "undefined") return;
	try {
		localStorage.setItem(LS_KEY, JSON.stringify(views));
	} catch {}
}
var store = (() => {
	const stored = lsRead();
	return stored.length > 0 ? stored : DEFAULT_VIEWS;
})();
var listeners = /* @__PURE__ */ new Set();
function setStore(next) {
	store = next;
	lsWrite(next);
	listeners.forEach((l) => l());
}
function subscribe(cb) {
	listeners.add(cb);
	const onStorage = (e) => {
		if (e.key !== LS_KEY) return;
		const next = lsRead();
		store = next.length > 0 ? next : DEFAULT_VIEWS;
		listeners.forEach((l) => l());
	};
	if (typeof window !== "undefined") window.addEventListener("storage", onStorage);
	return () => {
		listeners.delete(cb);
		if (typeof window !== "undefined") window.removeEventListener("storage", onStorage);
	};
}
if (typeof window !== "undefined" && lsRead().length === 0) lsWrite(DEFAULT_VIEWS);
function sameSources(a, b) {
	if (a.length !== b.length) return false;
	return [...a].sort().join(",") === [...b].sort().join(",");
}
function useSavedViews() {
	return {
		views: (0, import_react.useSyncExternalStore)(subscribe, () => store, () => store),
		loaded: true,
		addView: (0, import_react.useCallback)((input) => {
			const existing = store.find((v) => v.name === input.name && v.keyword === input.keyword && v.timeframe === input.timeframe && sameSources(v.sources, input.sources));
			if (existing) return existing;
			const now = (/* @__PURE__ */ new Date()).toISOString();
			const view = {
				...input,
				id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
				createdAt: now,
				updatedAt: now
			};
			setStore([view, ...store]);
			return view;
		}, []),
		removeView: (0, import_react.useCallback)((id) => {
			setStore(store.filter((v) => v.id !== id));
		}, []),
		updateView: (0, import_react.useCallback)((id, patch) => {
			setStore(store.map((v) => v.id === id ? {
				...v,
				...patch,
				updatedAt: (/* @__PURE__ */ new Date()).toISOString()
			} : v));
		}, [])
	};
}
function scoreTone(score) {
	if (score === void 0) return "bg-muted text-muted-foreground";
	if (score >= 65) return "bg-positive/15 text-positive";
	if (score <= 40) return "bg-negative/15 text-negative";
	return "bg-warn/20 text-foreground/70";
}
function timeAgo(iso) {
	const diff = Date.now() - new Date(iso).getTime();
	const m = Math.floor(diff / 6e4);
	if (m < 1) return "just now";
	if (m < 60) return `${m}m ago`;
	const h = Math.floor(m / 60);
	if (h < 24) return `${h}h ago`;
	const d = Math.floor(h / 24);
	if (d < 7) return `${d}d ago`;
	return new Date(iso).toLocaleDateString();
}
function AppShell({ title, children }) {
	const [open, setOpen] = (0, import_react.useState)(true);
	const { views, loaded } = useSavedViews();
	const path = useRouterState({ select: (r) => r.location.pathname });
	const search = useRouterState({ select: (r) => r.location.search });
	const activeViewId = search && typeof search === "object" && "view" in search ? String(search.view) : void 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-screen w-full bg-background text-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: cn("hidden shrink-0 border-r border-border bg-sidebar transition-[width] md:flex md:flex-col", open ? "w-72" : "w-0 overflow-hidden"),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-2 px-5 py-5",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/",
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartColumn, { className: "h-4 w-4" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-serif text-lg leading-none",
							children: ["Vox ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-primary",
								children: "Pulse"
							})]
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "px-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						className: "w-full justify-start gap-2",
						size: "sm",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), "New Search"]
						})
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 px-5 text-xs font-medium uppercase tracking-wider text-muted-foreground",
					children: ["Saved Views ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-muted-foreground/70",
						children: [
							"(",
							views.length,
							")"
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollArea, {
					className: "mt-2 flex-1",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-1 px-3 pb-6",
						children: !loaded ? null : views.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "px-2 py-3 text-xs text-muted-foreground",
							children: "No saved views yet. Run a search and save it."
						}) : views.map((v) => {
							const active = path === "/search" && activeViewId === v.id;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/search",
								search: {
									q: v.keyword,
									sources: v.sources.join(","),
									timeframe: v.timeframe,
									view: v.id
								},
								className: cn("block rounded-lg px-3 py-2.5 text-sm transition-colors", active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "hover:bg-muted"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "truncate font-medium",
										children: v.name
									}), v.lastScore !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: cn("rounded-md px-1.5 py-0.5 text-[10px] font-semibold", scoreTone(v.lastScore)),
										children: v.lastScore
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-0.5 text-[11px] text-muted-foreground",
									children: ["Updated ", timeAgo(v.updatedAt)]
								})]
							}, v.id);
						})
					})
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex min-w-0 flex-1 flex-col",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background/85 px-4 backdrop-blur",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "icon",
						onClick: () => setOpen((o) => !o),
						"aria-label": "Toggle sidebar",
						children: open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelLeftClose, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelLeftOpen, { className: "h-4 w-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm font-medium text-foreground/80",
						children: title ?? "Customer Voice Analyser"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "ml-auto flex items-center gap-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							variant: "ghost",
							size: "sm",
							className: "gap-1.5",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-3.5 w-3.5" }), " Search"]
							})
						})
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "min-w-0 flex-1",
				children
			})]
		})]
	});
}
//#endregion
export { useSavedViews as i, Button as n, cn as r, AppShell as t };
