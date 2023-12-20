import * as server from '../entries/pages/app/_layout.server.ts.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/layout.svelte.js')).default;
export { server };
export const server_id = "src/routes/app/+layout.server.ts";
export const imports = ["_app/immutable/nodes/2.643McJMY.js","_app/immutable/chunks/scheduler.EpWGcs72.js","_app/immutable/chunks/index.vVMILz9O.js"];
export const stylesheets = [];
export const fonts = [];
