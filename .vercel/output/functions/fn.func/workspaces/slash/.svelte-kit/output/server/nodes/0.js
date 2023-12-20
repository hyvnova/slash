import * as universal from '../entries/pages/_layout.ts.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+layout.ts";
export const imports = ["_app/immutable/nodes/0.TqocxurT.js","_app/immutable/chunks/scheduler.EpWGcs72.js","_app/immutable/chunks/index.vVMILz9O.js","_app/immutable/chunks/each.IVg80KZZ.js","_app/immutable/chunks/singletons.HB2epW-c.js","_app/immutable/chunks/index.QmuqCeFS.js","_app/immutable/chunks/user_config.VJ0jylsq.js"];
export const stylesheets = ["_app/immutable/assets/0.pB-7_XFY.css"];
export const fonts = [];
