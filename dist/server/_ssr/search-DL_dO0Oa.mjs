import { t as ALL_SOURCES } from "./types-CrR-3oB3.mjs";
import { a as stringType, i as objectType, n as enumType } from "../_libs/zod.mjs";
import { l as lazyRouteComponent, u as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/search-DL_dO0Oa.js
var $$splitComponentImporter = () => import("./search-4xjDe4wH.mjs");
var searchSchema = objectType({
	q: stringType().optional().default(""),
	sources: stringType().optional().default(ALL_SOURCES.join(",")),
	timeframe: enumType([
		"day",
		"week",
		"month",
		"year",
		"all"
	]).optional().default("month"),
	view: stringType().optional()
});
var Route = createFileRoute("/search")({
	validateSearch: (s) => searchSchema.parse(s),
	head: ({ match }) => {
		const q = match.search.q ?? "";
		return { meta: [{ title: q ? `${q} — Vox Pulse` : "Search — Vox Pulse" }, {
			name: "description",
			content: `Customer feedback about ${q || "your product"} across the public web.`
		}] };
	},
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
