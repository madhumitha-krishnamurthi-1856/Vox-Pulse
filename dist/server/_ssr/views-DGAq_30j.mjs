import { i as SOURCE_LABELS } from "./types-CrR-3oB3.mjs";
import { f as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { s as Trash2 } from "../_libs/lucide-react.mjs";
import { i as useSavedViews, n as Button, t as AppShell } from "./app-shell-CKUU6TqC.mjs";
import { n as Skeleton, t as Card } from "./skeleton-BQigzaoc.mjs";
import { t as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/views-DGAq_30j.js
var import_jsx_runtime = require_jsx_runtime();
function ViewsPage() {
	const { views, loaded, removeView } = useSavedViews();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-4xl px-6 py-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-serif text-3xl tracking-tight",
				children: "Saved views"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Re-run any saved search with one click. Stored locally in your browser."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 space-y-3",
				children: !loaded ? Array.from({ length: 3 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-20 w-full" }, i)) : views.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground",
					children: [
						"No saved views yet.",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/",
							className: "text-primary underline-offset-4 hover:underline",
							children: "Start a search"
						}),
						" ",
						"and save it from the results page."
					]
				}) : views.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					className: "border-border bg-card",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-4 p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-medium",
								children: v.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-1 text-xs text-muted-foreground",
								children: [
									v.keyword,
									" ·",
									" ",
									v.sources.map((s) => SOURCE_LABELS[s] ?? s).join(", "),
									" ",
									"· past ",
									v.timeframe
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								size: "sm",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/search",
									search: {
										q: v.keyword,
										sources: v.sources.join(","),
										timeframe: v.timeframe,
										view: v.id
									},
									children: "Re-run"
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "icon",
								onClick: () => {
									removeView(v.id);
									toast.success("View deleted");
								},
								"aria-label": "Delete view",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4 text-muted-foreground" })
							})]
						})]
					})
				}, v.id))
			})
		]
	}) });
}
//#endregion
export { ViewsPage as component };
