//#region node_modules/.nitro/vite/services/ssr/assets/__23tanstack-start-server-fn-resolver-BV5ET66z.js
var manifest = { "f6744d6cce096299c2f47e1badbf4073553b183f5ea881452a4d14e5b9fd4659": {
	functionName: "fetchFeedback_createServerFn_handler",
	importer: () => import("./_ssr/fetch.functions-DXuBdsur.mjs")
} };
async function getServerFnById(id, access) {
	const serverFnInfo = manifest[id];
	if (!serverFnInfo) throw new Error("Server function info not found for " + id);
	const fnModule = serverFnInfo.module ?? await serverFnInfo.importer();
	if (!fnModule) throw new Error("Server function module not resolved for " + id);
	const action = fnModule[serverFnInfo.functionName];
	if (!action) throw new Error("Server function module export not resolved for serverFn ID: " + id);
	return action;
}
//#endregion
export { getServerFnById as t };
