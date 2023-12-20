export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["default_avatars/1.jpg","default_avatars/2.jpg","default_avatars/3.jpg","default_avatars/4.jpg","favicon.png","fonts/Writer/Writer-Bold.ttf","fonts/Writer/Writer-BoldItalic.ttf","fonts/Writer/Writer-Italic.ttf","fonts/Writer/Writer-Medium.ttf","fonts/Writer/Writer-MediumItalic.ttf","fonts/Writer/Writer-Regular.ttf","fonts/Writer/Writer-SemiBold.ttf","fonts/Writer/Writer-SemiBoldItalic.ttf","nova-auth.png"]),
	mimeTypes: {".jpg":"image/jpeg",".png":"image/png",".ttf":"font/ttf"},
	_: {
		client: {"start":"_app/immutable/entry/start.RXRQ4_aY.js","app":"_app/immutable/entry/app.W4x2mrCx.js","imports":["_app/immutable/entry/start.RXRQ4_aY.js","_app/immutable/chunks/scheduler.EpWGcs72.js","_app/immutable/chunks/singletons.jeDsdSwJ.js","_app/immutable/chunks/index.QmuqCeFS.js","_app/immutable/entry/app.W4x2mrCx.js","_app/immutable/chunks/scheduler.EpWGcs72.js","_app/immutable/chunks/index.vVMILz9O.js"],"stylesheets":[],"fonts":[],"uses_env_dynamic_public":false},
		nodes: [
			__memo(() => import('../output/server/nodes/0.js')),
			__memo(() => import('../output/server/nodes/1.js')),
			__memo(() => import('../output/server/nodes/2.js')),
			__memo(() => import('../output/server/nodes/3.js')),
			__memo(() => import('../output/server/nodes/4.js')),
			__memo(() => import('../output/server/nodes/5.js')),
			__memo(() => import('../output/server/nodes/6.js')),
			__memo(() => import('../output/server/nodes/7.js')),
			__memo(() => import('../output/server/nodes/8.js'))
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 4 },
				endpoint: null
			},
			{
				id: "/api/file/upload",
				pattern: /^\/api\/file\/upload\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('../output/server/entries/endpoints/api/file/upload/_server.ts.js'))
			},
			{
				id: "/api/message",
				pattern: /^\/api\/message\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('../output/server/entries/endpoints/api/message/_server.ts.js'))
			},
			{
				id: "/api/search",
				pattern: /^\/api\/search\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('../output/server/entries/endpoints/api/search/_server.ts.js'))
			},
			{
				id: "/api/session",
				pattern: /^\/api\/session\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('../output/server/entries/endpoints/api/session/_server.ts.js'))
			},
			{
				id: "/api/test",
				pattern: /^\/api\/test\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('../output/server/entries/endpoints/api/test/_server.ts.js'))
			},
			{
				id: "/api/update_friendship",
				pattern: /^\/api\/update_friendship\/?$/,
				params: [],
				page: null,
				endpoint: __memo(() => import('../output/server/entries/endpoints/api/update_friendship/_server.ts.js'))
			},
			{
				id: "/app/chat/[id]",
				pattern: /^\/app\/chat\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 5 },
				endpoint: null
			},
			{
				id: "/app/me",
				pattern: /^\/app\/me\/?$/,
				params: [],
				page: { layouts: [0,2,3,], errors: [1,,,], leaf: 6 },
				endpoint: null
			},
			{
				id: "/app/me/chat/[members]",
				pattern: /^\/app\/me\/chat\/([^/]+?)\/?$/,
				params: [{"name":"members","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('../output/server/entries/endpoints/app/me/chat/_members_/_server.ts.js'))
			},
			{
				id: "/app/me/settings",
				pattern: /^\/app\/me\/settings\/?$/,
				params: [],
				page: { layouts: [0,2,3,], errors: [1,,,], leaf: 7 },
				endpoint: null
			},
			{
				id: "/app/profile/[username]",
				pattern: /^\/app\/profile\/([^/]+?)\/?$/,
				params: [{"name":"username","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,2,], errors: [1,,], leaf: 8 },
				endpoint: null
			},
			{
				id: "/avatar/[username]",
				pattern: /^\/avatar\/([^/]+?)\/?$/,
				params: [{"name":"username","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('../output/server/entries/endpoints/avatar/_username_/_server.ts.js'))
			},
			{
				id: "/file/[id]",
				pattern: /^\/file\/([^/]+?)\/?$/,
				params: [{"name":"id","optional":false,"rest":false,"chained":false}],
				page: null,
				endpoint: __memo(() => import('../output/server/entries/endpoints/file/_id_/_server.ts.js'))
			}
		],
		matchers: async () => {
			
			return {  };
		}
	}
}
})();
