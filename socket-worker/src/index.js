import { DurableObject } from 'cloudflare:workers';
import {
	SOCKET_ENDPOINT_PATH,
	parseRealtimePacket,
	serializeRealtimePacket
} from '../../src/lib/realtime/protocol';

const EVENTS = Object.freeze({
	HANDSHAKE: 'handshake',
	CONNECT: 'user connect',
	JOIN_CHAT: 'join chat',
	NEW_FRIEND_REQUEST: 'new friend request',
	CANCEL_FRIEND_REQUEST: 'cancel friend request',
	ACCEPT_FRIEND_REQUEST: 'accept friend request',
	REJECT_FRIEND_REQUEST: 'reject friend request',
	UNFRIEND: 'unfriend',
	SET_STATUS: 'set status',
	STATUS: 'status',
	GET_FRIENDS_STATUS: 'get friends status',
	NEW_MESSAGE: 'new message',
	CONTACT_MESSAGE: 'contact message',
	NEW_STR_MESSAGE: 'new str message',
	DELETE_MESSAGE: 'delete message',
	EDIT_MESSAGE: 'edit message'
});

const STATUS = Object.freeze({
	OFFLINE: 'offline',
	ONLINE: 'online',
	TYPING: 'typing'
});

const DIRECT_USER_EVENTS = new Set([
	EVENTS.NEW_FRIEND_REQUEST,
	EVENTS.CANCEL_FRIEND_REQUEST,
	EVENTS.ACCEPT_FRIEND_REQUEST,
	EVENTS.REJECT_FRIEND_REQUEST,
	EVENTS.UNFRIEND
]);

export default {
	async fetch(request, env) {
		const url = new URL(request.url);

		if (url.pathname === '/') {
			return Response.json({ status: 'ok' });
		}

		if (url.pathname !== SOCKET_ENDPOINT_PATH) {
			return new Response('Not found', { status: 404 });
		}

		if (request.headers.get('Upgrade') !== 'websocket') {
			return new Response('Expected websocket upgrade', { status: 426 });
		}

		const id = env.SLASH_REALTIME_SERVER.idFromName('global');
		const stub = env.SLASH_REALTIME_SERVER.get(id);
		return stub.fetch(request);
	}
};

export class SlashRealtimeServer extends DurableObject {
	constructor(ctx, env) {
		super(ctx, env);

		this.sessions = new Map();
		this.userSessions = new Map();
		this.chatSessions = new Map();
		this.userStatuses = new Map();

		if (typeof this.ctx.setWebSocketAutoResponse === 'function') {
			this.ctx.setWebSocketAutoResponse(new WebSocketRequestResponsePair('ping', 'pong'));
		}

		this.rehydrateSessions();
	}

	async fetch(request) {
		if (request.headers.get('Upgrade') !== 'websocket') {
			return Response.json({ status: 'ok' });
		}

		const pair = new WebSocketPair();
		const [client, server] = Object.values(pair);
		const session = this.createSession(server);

		this.sessions.set(session.id, session);
		this.ctx.acceptWebSocket(server);

		return new Response(null, {
			status: 101,
			webSocket: client
		});
	}

	webSocketMessage(webSocket, message) {
		if (message === 'ping' || message === 'pong' || typeof message !== 'string') {
			return;
		}

		const packet = parseRealtimePacket(message);
		if (!packet || packet.kind !== 'emit') {
			return;
		}

		const session = this.getSession(webSocket);
		if (!session) {
			return;
		}

		this.handleEmit(session, packet);
	}

	webSocketClose(webSocket) {
		this.removeSession(webSocket);
	}

	webSocketError(webSocket) {
		this.removeSession(webSocket);
	}

	rehydrateSessions() {
		for (const webSocket of this.ctx.getWebSockets()) {
			const attachment = this.deserializeAttachment(webSocket);
			const session = {
				id: attachment.id ?? crypto.randomUUID(),
				socket: webSocket,
				username: attachment.username ?? null,
				chatId: attachment.chatId ?? null,
				friends: Array.isArray(attachment.friends) ? attachment.friends : [],
				status: attachment.status ?? STATUS.ONLINE
			};

			this.sessions.set(session.id, session);
			this.indexSession(session);

			if (session.username) {
				this.userStatuses.set(session.username, session.status);
			}
		}
	}

	createSession(socket) {
		const session = {
			id: crypto.randomUUID(),
			socket,
			username: null,
			chatId: null,
			friends: [],
			status: STATUS.OFFLINE
		};

		socket.serializeAttachment(this.serializeSession(session));
		return session;
	}

	getSession(socket) {
		const attachment = this.deserializeAttachment(socket);
		if (!attachment.id) {
			return null;
		}

		const existing = this.sessions.get(attachment.id);
		if (existing) {
			return existing;
		}

		const restored = {
			id: attachment.id,
			socket,
			username: attachment.username ?? null,
			chatId: attachment.chatId ?? null,
			friends: Array.isArray(attachment.friends) ? attachment.friends : [],
			status: attachment.status ?? STATUS.ONLINE
		};

		this.sessions.set(restored.id, restored);
		this.indexSession(restored);
		return restored;
	}

	handleEmit(session, packet) {
		switch (packet.event) {
			case EVENTS.HANDSHAKE:
				this.reply(packet.ackId, session, true);
				return;

			case EVENTS.CONNECT: {
				const [username] = packet.args;
				if (typeof username !== 'string' || !username) {
					this.reply(packet.ackId, session, false);
					return;
				}

				this.updateSession(session, {
					username,
					chatId: null,
					status: STATUS.ONLINE
				});

				this.reply(packet.ackId, session, true);
				return;
			}

			case EVENTS.JOIN_CHAT: {
				const [username, chatId, chatMembers] = packet.args;
				if (
					typeof username !== 'string' ||
					typeof chatId !== 'string' ||
					!Array.isArray(chatMembers)
				) {
					this.reply(packet.ackId, session, false);
					return;
				}

				this.updateSession(session, {
					username,
					chatId,
					status: STATUS.ONLINE
				});

				this.emitToChat(chatId, EVENTS.STATUS, username, STATUS.ONLINE);

				for (const member of chatMembers) {
					if (typeof member !== 'string' || !this.isOnline(member)) {
						continue;
					}

					this.emitToSession(session, EVENTS.STATUS, member, this.getUserStatus(member));
				}

				this.reply(packet.ackId, session, true);
				return;
			}

			case EVENTS.SET_STATUS: {
				const [status, friends] = packet.args;
				if (!session.username || typeof status !== 'string' || !Array.isArray(friends)) {
					this.reply(packet.ackId, session, false);
					return;
				}

				const cleanFriends = friends.filter((friend) => typeof friend === 'string');
				this.updateSession(session, {
					status,
					friends: cleanFriends
				});
				this.userStatuses.set(session.username, status);

				for (const friend of cleanFriends) {
					if (this.isOnline(friend)) {
						this.emitToUser(friend, EVENTS.STATUS, session.username, status);
						this.emitToSession(session, EVENTS.STATUS, friend, this.getUserStatus(friend));
					}
				}

				this.reply(packet.ackId, session, true);
				return;
			}

			case EVENTS.GET_FRIENDS_STATUS: {
				const [friends] = packet.args;
				if (!Array.isArray(friends)) {
					this.reply(packet.ackId, session, false);
					return;
				}

				for (const friend of friends) {
					if (typeof friend !== 'string' || !this.isOnline(friend)) {
						continue;
					}

					this.emitToSession(session, EVENTS.STATUS, friend, this.getUserStatus(friend));
				}

				this.reply(packet.ackId, session, true);
				return;
			}

			case EVENTS.DELETE_MESSAGE:
			case EVENTS.EDIT_MESSAGE:
			case EVENTS.NEW_STR_MESSAGE: {
				const [chatId, payload] = packet.args;
				if (typeof chatId !== 'string') {
					this.reply(packet.ackId, session, false);
					return;
				}

				this.emitToChat(chatId, packet.event, payload);
				this.reply(packet.ackId, session, true);
				return;
			}

			case EVENTS.NEW_MESSAGE: {
				const [chatId, payload, members] = packet.args;
				if (typeof chatId !== 'string') {
					this.reply(packet.ackId, session, false);
					return;
				}

				this.emitToChat(chatId, packet.event, payload);

				if (payload && typeof payload === 'object' && Array.isArray(members)) {
					const author = payload.author;
					for (const member of members) {
						if (typeof member !== 'string' || member === author) {
							continue;
						}

						this.emitToUser(member, EVENTS.CONTACT_MESSAGE, {
							chatId,
							from: author,
							message: payload
						});
					}
				}

				this.reply(packet.ackId, session, true);
				return;
			}

			default:
				if (DIRECT_USER_EVENTS.has(packet.event)) {
					const [targetUsername] = packet.args;
					if (typeof targetUsername !== 'string' || !session.username) {
						this.reply(packet.ackId, session, false);
						return;
					}

					this.emitToUser(targetUsername, packet.event, session.username);
					this.reply(packet.ackId, session, true);
				}
		}
	}

	updateSession(session, updates) {
		const previousUsername = session.username;
		const previousChatId = session.chatId;

		Object.assign(session, updates);

		if (previousUsername !== session.username) {
			this.unindexByValue(this.userSessions, previousUsername, session.id);
			this.indexValue(this.userSessions, session.username, session.id);
		}

		if (previousChatId !== session.chatId) {
			this.unindexByValue(this.chatSessions, previousChatId, session.id);
			this.indexValue(this.chatSessions, session.chatId, session.id);
		}

		if (session.username) {
			this.userStatuses.set(session.username, session.status);
		}

		session.socket.serializeAttachment(this.serializeSession(session));
	}

	removeSession(socket) {
		const session = this.getSession(socket);
		if (!session) {
			return;
		}

		this.sessions.delete(session.id);
		this.unindexByValue(this.userSessions, session.username, session.id);
		this.unindexByValue(this.chatSessions, session.chatId, session.id);

		if (!session.username) {
			return;
		}

		const remainingSessions = this.userSessions.get(session.username);
		if (remainingSessions && remainingSessions.size > 0) {
			return;
		}

		this.userStatuses.set(session.username, STATUS.OFFLINE);

		for (const friend of session.friends) {
			this.emitToUser(friend, EVENTS.STATUS, session.username, STATUS.OFFLINE);
		}

		if (session.chatId) {
			this.emitToChat(session.chatId, EVENTS.STATUS, session.username, STATUS.OFFLINE);
		}
	}

	indexSession(session) {
		this.indexValue(this.userSessions, session.username, session.id);
		this.indexValue(this.chatSessions, session.chatId, session.id);
	}

	indexValue(index, key, sessionId) {
		if (!key) {
			return;
		}

		const values = index.get(key) ?? new Set();
		values.add(sessionId);
		index.set(key, values);
	}

	unindexByValue(index, key, sessionId) {
		if (!key) {
			return;
		}

		const values = index.get(key);
		if (!values) {
			return;
		}

		values.delete(sessionId);
		if (values.size === 0) {
			index.delete(key);
		}
	}

	isOnline(username) {
		return (this.userSessions.get(username)?.size ?? 0) > 0;
	}

	getUserStatus(username) {
		if (!this.isOnline(username)) {
			return STATUS.OFFLINE;
		}

		return this.userStatuses.get(username) ?? STATUS.ONLINE;
	}

	emitToUser(username, event, ...args) {
		const sessionIds = this.userSessions.get(username);
		if (!sessionIds) {
			return;
		}

		for (const sessionId of sessionIds) {
			const session = this.sessions.get(sessionId);
			if (!session) {
				continue;
			}

			this.emitToSession(session, event, ...args);
		}
	}

	emitToChat(chatId, event, ...args) {
		const sessionIds = this.chatSessions.get(chatId);
		if (!sessionIds) {
			return;
		}

		for (const sessionId of sessionIds) {
			const session = this.sessions.get(sessionId);
			if (!session) {
				continue;
			}

			this.emitToSession(session, event, ...args);
		}
	}

	emitToSession(session, event, ...args) {
		session.socket.send(
			serializeRealtimePacket({
				kind: 'event',
				event,
				args
			})
		);
	}

	reply(ackId, session, ...args) {
		if (!ackId) {
			return;
		}

		session.socket.send(
			serializeRealtimePacket({
				kind: 'ack',
				ackId,
				args
			})
		);
	}

	serializeSession(session) {
		return {
			id: session.id,
			username: session.username,
			chatId: session.chatId,
			friends: session.friends,
			status: session.status
		};
	}

	deserializeAttachment(socket) {
		return socket.deserializeAttachment() ?? {};
	}
}
