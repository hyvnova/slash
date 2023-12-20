import { sveltekit } from '@sveltejs/kit/vite';
import wss from './src/lib/server/socket_server';
import { defineConfig, type Plugin, type ViteDevServer } from 'vite';

const webSocketServer: Plugin = {
	name: 'webSocketServer',
	configureServer(server: ViteDevServer) {
		// @ts-ignore
		wss(server.httpServer);
	}
};


export default defineConfig({
	server: {
		port: 3000,
		cors: true
	},
	preview: {
		port: 3000,
		cors:true
	},
	plugins: [await sveltekit(), webSocketServer]
});
