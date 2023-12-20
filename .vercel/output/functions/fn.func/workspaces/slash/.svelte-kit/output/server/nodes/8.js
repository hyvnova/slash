import * as server from '../entries/pages/app/profile/_username_/_page.server.ts.js';

export const index = 8;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/app/profile/_username_/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/app/profile/[username]/+page.server.ts";
export const imports = ["_app/immutable/nodes/8.yEVXSBYF.js","_app/immutable/chunks/scheduler.EpWGcs72.js","_app/immutable/chunks/index.vVMILz9O.js","_app/immutable/chunks/index.5n3f9oEu.js","_app/immutable/chunks/Notification.veq9gESc.js","_app/immutable/chunks/index.QmuqCeFS.js","_app/immutable/chunks/types.emqlGWVk.js"];
export const stylesheets = ["_app/immutable/assets/index.omLGGTPY.css"];
export const fonts = [];
