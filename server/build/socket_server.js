import { Server } from 'socket.io';
import { connect, disconnect, get_online_from, get_status, is_online, set_status, close_client } from './socket_db.js';
const DEFAULT_IDLE_SHUTDOWN_MS = 5 * 60 * 1000; // 5 minutes
export default function injectSocketIO(server) {
    console.log("Injecting SocketIO and configuring server");
    const configuredIdleShutdownMs = Number(process.env.IDLE_SHUTDOWN_MS ?? DEFAULT_IDLE_SHUTDOWN_MS);
    const idleShutdownMs = Number.isFinite(configuredIdleShutdownMs) && configuredIdleShutdownMs >= 0
        ? configuredIdleShutdownMs
        : DEFAULT_IDLE_SHUTDOWN_MS;
    const io = new Server(server, {
        maxHttpBufferSize: 1e7, // 10MB
        cors: {
            origin: '*',
            methods: '*',
            allowedHeaders: '*',
            credentials: false,
            optionsSuccessStatus: 204,
        }
    });
    let activeSockets = 0;
    let idleTimer = null;
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
            console.info(`[socket] No active connections for ${idleShutdownMs}ms, shutting down to reduce cost.`);
            try {
                await close_client();
            }
            catch (error) {
                console.error('[socket] Failed to close MongoDB client cleanly during shutdown', error);
            }
            io.close();
            server.close((closeError) => {
                if (closeError) {
                    console.error('[socket] HTTP server close error', closeError);
                    process.exit(1);
                }
                else {
                    process.exit(0);
                }
            });
            // Fallback exit in case close callback never fires
            setTimeout(() => process.exit(0), 5000);
        }, idleShutdownMs);
    };
    // Schedule shutdown in case the server starts with no clients and never gets any
    scheduleIdleShutdown();
    let username;
    io.on('connection', (socket) => {
        activeSockets += 1;
        cancelIdleShutdown();
        socket.on("user connect" /* Events.CONNECT */, async (_username) => {
            username = _username;
            socket.join(username);
            await connect(socket.id, username);
        });
        socket.on("handshake" /* Events.HANDSHAKE */, (callback) => { callback(true); });
        /**
         * Join Chat
         */
        socket.on("join chat" /* Events.JOIN_CHAT */, async (username, chat_id, chat_members) => {
            await connect(socket.id, username);
            // Leave all other rooms
            Object.keys(socket.rooms).forEach((room) => {
                if (room !== socket.id && room !== chat_id && room !== username) {
                    socket.leave(room);
                }
            });
            socket.join(chat_id);
            // Emit online status to all members of the chat
            io.to(chat_id).emit("status" /* Events.STATUS */, username, "online" /* Status.ONLINE */);
            // Get others online status
            for (const member of await get_online_from(chat_members)) {
                io.to(socket.id).emit("status" /* Events.STATUS */, member.username, member.status);
            }
        });
        /**
         * Receive Status
         * username - user who sent the status
         * status - status of the user
         */
        socket.on("status" /* Events.STATUS */, async (username, status) => {
            if (await is_online(socket.id)) {
                io.to(socket.id).emit("status" /* Events.STATUS */, username, status);
            }
        });
        /**
         * Set Status
         */
        socket.on("set status" /* Events.SET_STATUS */, async (status, friends) => {
            if (!username) {
                return;
            }
            // Set status
            await set_status(username, status);
            for (const friend of friends) {
                if (await is_online(friend)) {
                    io.to(socket.id).emit("status" /* Events.STATUS */, friend, await get_status(friend));
                }
            }
        });
        /**
         * Get status of friends
         */
        socket.on("get friends status" /* Events.GET_FRIENDS_STATUS */, async (friends) => {
            for (const friend of friends) {
                if (await is_online(friend)) {
                    io.to(socket.id).emit("status" /* Events.STATUS */, friend, await get_status(friend));
                }
            }
        });
        /**
         * Friend Requests
         * Used to update other's friend requests UI on the fly
         */
        const friend_requests_states = [
            "new friend request" /* Events.NEW_FRIEND_REQUEST */,
            "cancel friend request" /* Events.CANCEL_FRIEND_REQUEST */,
            "accept friend request" /* Events.ACCEPT_FRIEND_REQUEST */,
            "reject friend request" /* Events.REJECT_FRIEND_REQUEST */,
        ];
        for (const state of friend_requests_states) {
            socket.on(state, async (friend) => {
                if (await is_online(friend)) {
                    io.to(friend).emit(state, username);
                }
            });
        }
        socket.on("unfriend" /* Events.UNFRIEND */, async (friend) => {
            if (await is_online(friend)) {
                io.to(friend).emit("unfriend" /* Events.UNFRIEND */, username);
            }
        });
        /**
         * Messages: send, delete, edit
         */
        socket.on("new message" /* Events.NEW_MESSAGE */, (chat_id, message) => {
            io.to(chat_id).emit("new message" /* Events.NEW_MESSAGE */, message);
        });
        socket.on("delete message" /* Events.DELETE_MESSAGE */, (chat_id, message_id) => {
            io.to(chat_id).emit("delete message" /* Events.DELETE_MESSAGE */, message_id);
        });
        socket.on("edit message" /* Events.EDIT_MESSAGE */, (chat_id, message) => {
            io.to(chat_id).emit("edit message" /* Events.EDIT_MESSAGE */, message);
        });
        /**
         * Only string message
         * Used to save resources by only sending a string
         */
        socket.on("new str message" /* Events.NEW_STR_MESSAGE */, (chat_id, content) => {
            io.to(chat_id).emit("new str message" /* Events.NEW_STR_MESSAGE */, content);
        });
        socket.on('disconnect', async () => {
            await disconnect(socket.id);
            activeSockets = Math.max(0, activeSockets - 1);
            scheduleIdleShutdown();
        });
    });
}
