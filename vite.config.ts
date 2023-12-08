import { sveltekit } from '@sveltejs/kit/vite';

import wss from './src/lib/server/socket_server';
import type { ServerOptions } from 'socket.io';

const webSocketServer = {
	name: 'webSocketServer',
	configureServer(server: { httpServer: Partial<ServerOptions> | undefined; }) {
		wss(server.httpServer);
	}
};

/** @type {import('vite').UserConfig} */
const config = {
	server: {
		port: 3000
	},
	preview: {
		port: 3000
	},
	plugins: [sveltekit(), webSocketServer]
};

export default config;