import { Server } from 'socket.io';
import type { Server as HTTPServer } from 'http';
import {
	connect,
	disconnect,
	get_online_from,
	get_status,
	is_online,
	set_status,
	close_client
} from './socket_db.js';
import { Events, type MessageType, Status } from './types.js';

type HandshakeCallback = (success: boolean) => void;

const DEFAULT_IDLE_SHUTDOWN_MS = 5 * 60 * 1000; // 5 minutes

export default function injectSocketIO(server: HTTPServer) {
	console.log('Injecting SocketIO and configuring server');

	const configuredIdleShutdownMs = Number(process.env.IDLE_SHUTDOWN_MS ?? DEFAULT_IDLE_SHUTDOWN_MS);
	const idleShutdownMs =
		Number.isFinite(configuredIdleShutdownMs) && configuredIdleShutdownMs >= 0
			? configuredIdleShutdownMs
			: DEFAULT_IDLE_SHUTDOWN_MS;

	const io = new Server(server, {
		maxHttpBufferSize: 1e6,
		cors: {
			origin: '*',
			methods: '*',
			allowedHeaders: '*',
			credentials: false,
			optionsSuccessStatus: 204
		}
	});

	let activeSockets = 0;
	let idleTimer: ReturnType<typeof setTimeout> | null = null;
	let shuttingDown = false;

	const cancelIdleShutdown = () => {
		if (idleTimer) {
			clearTimeout(idleTimer);
			idleTimer = null;
		}
	};

	const scheduleIdleShutdown = () => {
		if (idleShutdownMs === 0 || activeSockets > 0 || shuttingDown) {
			return;
		}

		cancelIdleShutdown();

		idleTimer = setTimeout(async () => {
			if (shuttingDown || io.engine.clientsCount > 0) {
				return;
			}

			shuttingDown = true;
			console.info(
				`[socket] No active connections for ${idleShutdownMs}ms, shutting down to reduce cost.`
			);

			try {
				await close_client();
			} catch (error) {
				console.error('[socket] Failed to close MongoDB client cleanly during shutdown', error);
			}

			io.close();

			server.close((closeError) => {
				if (closeError) {
					console.error('[socket] HTTP server close error', closeError);
					process.exit(1);
				} else {
					process.exit(0);
				}
			});

			// Fallback exit in case close callback never fires
			setTimeout(() => process.exit(0), 5000);
		}, idleShutdownMs);
	};

	// Schedule shutdown in case the server starts with no clients and never gets any
	scheduleIdleShutdown();

	let username: string;

	io.on('connection', (socket) => {
		activeSockets += 1;
		cancelIdleShutdown();

		socket.on(Events.CONNECT, async (_username: string) => {
			username = _username;
			socket.join(username);
			await connect(socket.id, username);
		});

		socket.on(Events.HANDSHAKE, (callback: HandshakeCallback) => {
			callback(true);
		});

		/**
		 * Join Chat
		 */
		socket.on(
			Events.JOIN_CHAT,
			async (username: string, chat_id: string, chat_members: string[]) => {
				await connect(socket.id, username);

				// Leave all other rooms
				Object.keys(socket.rooms).forEach((room) => {
					if (room !== socket.id && room !== chat_id && room !== username) {
						socket.leave(room);
					}
				});
				socket.join(chat_id);

				// Emit online status to all members of the chat
				io.to(chat_id).emit(Events.STATUS, username, Status.ONLINE);

				// Get others online status
				for (const member of await get_online_from(chat_members)) {
					io.to(socket.id).emit(Events.STATUS, member.username, member.status);
				}
			}
		);

		/**
		 * Receive Status
		 * username - user who sent the status
		 * status - status of the user
		 */
		socket.on(Events.STATUS, async (username: string, status: Status) => {
			if (await is_online(socket.id)) {
				io.to(socket.id).emit(Events.STATUS, username, status);
			}
		});

		/**
		 * Set Status
		 */
		socket.on(Events.SET_STATUS, async (status: Status, friends: string[]) => {
			if (!username) {
				return;
			}

			// Set status
			await set_status(username, status);

			for (const friend of friends) {
				if (await is_online(friend)) {
					io.to(socket.id).emit(Events.STATUS, friend, await get_status(friend));
				}
			}
		});

		/**
		 * Get status of friends
		 */
		socket.on(Events.GET_FRIENDS_STATUS, async (friends: string[]) => {
			for (const friend of friends) {
				if (await is_online(friend)) {
					io.to(socket.id).emit(Events.STATUS, friend, await get_status(friend));
				}
			}
		});

		/**
		 * Friend Requests
		 * Used to update other's friend requests UI on the fly
		 */
		const friend_requests_states = [
			Events.NEW_FRIEND_REQUEST,
			Events.CANCEL_FRIEND_REQUEST,
			Events.ACCEPT_FRIEND_REQUEST,
			Events.REJECT_FRIEND_REQUEST
		];
		for (const state of friend_requests_states) {
			socket.on(state, async (friend: string) => {
				if (await is_online(friend)) {
					io.to(friend).emit(state, username);
				}
			});
		}

		socket.on(Events.UNFRIEND, async (friend: string) => {
			if (await is_online(friend)) {
				io.to(friend).emit(Events.UNFRIEND, username);
			}
		});

		/**
		 * Messages: send, delete, edit
		 */
		socket.on(Events.NEW_MESSAGE, (chat_id: string, message: Partial<MessageType>) => {
			io.to(chat_id).emit(Events.NEW_MESSAGE, message);
		});

		socket.on(Events.DELETE_MESSAGE, (chat_id: string, message_id: string) => {
			io.to(chat_id).emit(Events.DELETE_MESSAGE, message_id);
		});

		socket.on(Events.EDIT_MESSAGE, (chat_id: string, message: MessageType) => {
			io.to(chat_id).emit(Events.EDIT_MESSAGE, message);
		});

		/**
		 * Only string message
		 * Used to save resources by only sending a string
		 */
		socket.on(Events.NEW_STR_MESSAGE, (chat_id: string, content: string) => {
			io.to(chat_id).emit(Events.NEW_STR_MESSAGE, content);
		});

		socket.on('disconnect', async () => {
			await disconnect(socket.id);
			activeSockets = Math.max(0, activeSockets - 1);
			scheduleIdleShutdown();
		});
	});
}
