

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.8496OevT.js","_app/immutable/chunks/scheduler.EpWGcs72.js","_app/immutable/chunks/index.vVMILz9O.js","_app/immutable/chunks/singletons.jeDsdSwJ.js","_app/immutable/chunks/index.QmuqCeFS.js"];
export const stylesheets = [];
export const fonts = [];