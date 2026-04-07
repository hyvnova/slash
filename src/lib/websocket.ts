import { browser, dev } from '$app/environment';
import { env as publicEnv } from '$env/dynamic/public';
import toast from './stores/toast';
import { SlashWebSocketClient } from './realtime/client';
import { SOCKET_ENDPOINT_PATH } from './realtime/protocol';

function normalizeSocketUrl(url: string): string {
	const trimmed = url.trim().replace(/\/$/, '');
	if (!trimmed) {
		return trimmed;
	}

	const withPath = trimmed.endsWith(SOCKET_ENDPOINT_PATH)
		? trimmed
		: `${trimmed}${SOCKET_ENDPOINT_PATH}`;

	if (withPath.startsWith('ws://') || withPath.startsWith('wss://')) {
		return withPath;
	}

	if (withPath.startsWith('http://')) {
		return withPath.replace(/^http:\/\//, 'ws://');
	}

	if (withPath.startsWith('https://')) {
		return withPath.replace(/^https:\/\//, 'wss://');
	}

	return withPath;
}

function getDefaultSocketUrl(): string {
	const configuredSocketUrl = publicEnv.PUBLIC_SOCKET_SERVER_URL ?? '';

	if (!browser) {
		return normalizeSocketUrl(configuredSocketUrl);
	}

	if (configuredSocketUrl) {
		return normalizeSocketUrl(configuredSocketUrl);
	}

	if (dev) {
		return 'ws://localhost:8787/websocket';
	}

	const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
	return `${protocol}//${window.location.host}${SOCKET_ENDPOINT_PATH}`;
}

export const ws = new SlashWebSocketClient(getDefaultSocketUrl());

ws.on('connect_error', (error) => {
	if (dev) {
		console.error(error);
	}

	toast.set({
		type: 'error',
		title: 'Connection Error',
		message: 'Failed to connect to the realtime server.'
	});
});
