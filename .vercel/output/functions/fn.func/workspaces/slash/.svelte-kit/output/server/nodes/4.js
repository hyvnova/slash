import * as server from '../entries/pages/_page.server.ts.js';

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/+page.server.ts";
export const imports = ["_app/immutable/nodes/4.WH1sPB2W.js","_app/immutable/chunks/scheduler.EpWGcs72.js","_app/immutable/chunks/index.vVMILz9O.js","_app/immutable/chunks/Notification.veq9gESc.js","_app/immutable/chunks/index.QmuqCeFS.js"];
export const stylesheets = [];
export const fonts = [];
