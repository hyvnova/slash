import * as server from '../entries/pages/app/chat/_id_/_page.server.ts.js';

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/app/chat/_id_/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/app/chat/[id]/+page.server.ts";
export const imports = ["_app/immutable/nodes/5._4heihoU.js","_app/immutable/chunks/scheduler.EpWGcs72.js","_app/immutable/chunks/index.vVMILz9O.js","_app/immutable/chunks/types.emqlGWVk.js","_app/immutable/chunks/index.5n3f9oEu.js","_app/immutable/chunks/api_shortcuts.noIhwHbn.js","_app/immutable/chunks/index.QmuqCeFS.js","_app/immutable/chunks/websocket.UFKR6r8E.js","_app/immutable/chunks/each.IVg80KZZ.js","_app/immutable/chunks/Notification.veq9gESc.js"];
export const stylesheets = ["_app/immutable/assets/5.RE1V_mDD.css","_app/immutable/assets/index.omLGGTPY.css"];
export const fonts = [];
