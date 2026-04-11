import { browser } from '$app/environment';
import { Events } from '$lib/types';
import {
	parseRealtimePacket,
	serializeRealtimePacket,
	type RealtimeClientPacket,
	type RealtimeEventPacket,
	type RealtimeAckPacket
} from './protocol';

type EventHandler = (...args: any[]) => void;
type EventCallback = (...args: unknown[]) => void;

const RECONNECT_BASE_MS = 1000;
const RECONNECT_MAX_MS = 10000;
const PING_INTERVAL_MS = 30000;
const CONNECT_TIMEOUT_MS = 8000;

const REPLAYABLE_EVENTS = new Set<string>([
	Events.CONNECT,
	Events.JOIN_CHAT,
	Events.SET_STATUS,
	Events.GET_FRIENDS_STATUS
]);

export class SlashWebSocketClient {
	private readonly listeners = new Map<string, Set<EventHandler>>();
	private readonly pendingAcks = new Map<string, EventCallback>();
	private readonly queuedPackets: RealtimeClientPacket[] = [];
	private readonly replayPackets = new Map<string, RealtimeClientPacket>();

	private socket: WebSocket | null = null;
	private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
	private connectTimeout: ReturnType<typeof setTimeout> | null = null;
	private pingInterval: ReturnType<typeof setInterval> | null = null;
	private reconnectAttempts = 0;
	private hasConnectedOnce = false;
	private destroyed = false;

	constructor(private readonly url: string) {
		if (browser) {
			this.connect();
		}
	}

	on(event: string, handler: EventHandler) {
		let handlers = this.listeners.get(event);
		if (!handlers) {
			handlers = new Set<EventHandler>();
			this.listeners.set(event, handlers);
		}
		handlers.add(handler);
		return this;
	}

	off(event: string, handler?: EventHandler) {
		if (!handler) {
			this.listeners.delete(event);
			return this;
		}

		const handlers = this.listeners.get(event);
		if (!handlers) {
			return this;
		}

		handlers.delete(handler);
		if (handlers.size === 0) {
			this.listeners.delete(event);
		}
		return this;
	}

	once(event: string, handler: EventHandler) {
		const onceHandler: EventHandler = (...args) => {
			this.off(event, onceHandler);
			handler(...args);
		};

		return this.on(event, onceHandler);
	}

	emit(event: string, ...args: unknown[]) {
		let ackCallback: EventCallback | undefined;
		const lastArg = args.at(-1);
		if (typeof lastArg === 'function') {
			ackCallback = lastArg as EventCallback;
			args = args.slice(0, -1);
		}

		const packet: RealtimeClientPacket = {
			kind: 'emit',
			event,
			args
		};

		if (ackCallback) {
			packet.ackId = crypto.randomUUID();
			this.pendingAcks.set(packet.ackId, ackCallback);
		}

		if (REPLAYABLE_EVENTS.has(event)) {
			this.replayPackets.set(event, packet);
		}

		this.sendOrQueue(packet);
		return this;
	}

	disconnect() {
		this.destroyed = true;
		this.clearReconnectTimer();
		this.clearConnectTimeout();
		this.stopPing();
		this.socket?.close(1000, 'Client disconnect');
		this.socket = null;
		this.pendingAcks.clear();
	}

	private connect() {
		if (!browser || this.destroyed) {
			return;
		}

		if (
			this.socket &&
			(this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)
		) {
			return;
		}

		const socket = new WebSocket(this.url);
		this.socket = socket;

		this.connectTimeout = setTimeout(() => {
			if (socket.readyState === WebSocket.CONNECTING) {
				socket.close();
			}
		}, CONNECT_TIMEOUT_MS);

		socket.addEventListener('open', () => {
			this.clearConnectTimeout();
			this.reconnectAttempts = 0;
			this.startPing();
			this.flushQueuedPackets();

			if (this.hasConnectedOnce) {
				this.replayState();
			}

			this.hasConnectedOnce = true;
			this.notify('connect');
		});

		socket.addEventListener('message', (event) => {
			if (typeof event.data !== 'string') {
				return;
			}

			if (event.data === 'pong') {
				return;
			}

			const packet = parseRealtimePacket(event.data);
			if (!packet) {
				return;
			}

			if (packet.kind === 'event') {
				this.handleEventPacket(packet);
				return;
			}

			if (packet.kind === 'ack') {
				this.handleAckPacket(packet);
			}
		});

		socket.addEventListener('error', (error) => {
			this.notify('connect_error', error);
		});

		socket.addEventListener('close', () => {
			this.clearConnectTimeout();
			this.stopPing();

			if (this.socket === socket) {
				this.socket = null;
			}

			if (!this.destroyed) {
				this.notify('connect_error', new Error('Connection closed'));
				this.notify('disconnect');
				this.scheduleReconnect();
			}
		});
	}

	private sendOrQueue(packet: RealtimeClientPacket) {
		if (this.socket?.readyState === WebSocket.OPEN) {
			this.socket.send(serializeRealtimePacket(packet));
			return;
		}

		this.queuedPackets.push(packet);
		this.connect();
	}

	private flushQueuedPackets() {
		if (this.socket?.readyState !== WebSocket.OPEN || this.queuedPackets.length === 0) {
			return;
		}

		while (this.queuedPackets.length > 0) {
			const packet = this.queuedPackets.shift();
			if (!packet) {
				continue;
			}

			this.socket.send(serializeRealtimePacket(packet));
		}
	}

	private replayState() {
		if (this.socket?.readyState !== WebSocket.OPEN) {
			return;
		}

		for (const packet of this.replayPackets.values()) {
			this.socket.send(serializeRealtimePacket(packet));
		}
	}

	private handleEventPacket(packet: RealtimeEventPacket) {
		this.notify(packet.event, ...packet.args);
	}

	private handleAckPacket(packet: RealtimeAckPacket) {
		const callback = this.pendingAcks.get(packet.ackId);
		if (!callback) {
			return;
		}

		this.pendingAcks.delete(packet.ackId);
		callback(...packet.args);
	}

	private scheduleReconnect() {
		this.clearReconnectTimer();

		const delay = Math.min(RECONNECT_BASE_MS * 2 ** this.reconnectAttempts, RECONNECT_MAX_MS);
		this.reconnectAttempts += 1;

		this.reconnectTimer = setTimeout(() => {
			this.connect();
		}, delay);
	}

	private startPing() {
		this.stopPing();
		this.pingInterval = setInterval(() => {
			if (this.socket?.readyState === WebSocket.OPEN) {
				this.socket.send('ping');
			}
		}, PING_INTERVAL_MS);
	}

	private stopPing() {
		if (this.pingInterval) {
			clearInterval(this.pingInterval);
			this.pingInterval = null;
		}
	}

	private clearReconnectTimer() {
		if (this.reconnectTimer) {
			clearTimeout(this.reconnectTimer);
			this.reconnectTimer = null;
		}
	}

	private clearConnectTimeout() {
		if (this.connectTimeout) {
			clearTimeout(this.connectTimeout);
			this.connectTimeout = null;
		}
	}

	private notify(event: string, ...args: unknown[]) {
		const handlers = this.listeners.get(event);
		if (!handlers) {
			return;
		}

		for (const handler of handlers) {
			handler(...args);
		}
	}
}
