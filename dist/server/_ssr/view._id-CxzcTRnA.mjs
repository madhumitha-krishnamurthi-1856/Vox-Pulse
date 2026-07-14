import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { f as Link, p as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as Route } from "./view._id-BQ-Mdk8c.mjs";
import { i as useSavedViews, t as AppShell } from "./app-shell-CKUU6TqC.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/view._id-CxzcTRnA.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ViewRedirect() {
	const { id } = Route.useParams();
	const { views, loaded } = useSavedViews();
	const navigate = useNavigate();
	const view = views.find((v) => v.id === id);
	(0, import_react.useEffect)(() => {
		if (!loaded) return;
		if (!view) return;
		navigate({
			to: "/search",
			search: {
				q: view.keyword,
				sources: view.sources.join(","),
				timeframe: view.timeframe,
				view: view.id
			},
			replace: true
		});
	}, [
		loaded,
		view,
		navigate
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto max-w-xl px-6 py-20 text-center",
		children: !loaded ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: "Loading saved view…"
		}) : view ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "text-sm text-muted-foreground",
			children: [
				"Opening \"",
				view.name,
				"\"…"
			]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-serif text-3xl font-medium tracking-tight",
				children: "Saved view not found"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: "Saved views live in this browser. If you cleared site data or are on a different device, this view is no longer available."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/",
				className: "mt-6 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90",
				children: "Start a new search"
			})
		] })
	}) });
}
//#endregion
export { ViewRedirect as component };
