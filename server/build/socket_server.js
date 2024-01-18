import { Server } from 'socket.io';
import { connect, disconnect, get_online_from, get_status, is_online, set_status } from './socket_db.js';
export default function injectSocketIO(server) {
    server.maxHttpBufferSize = 1e6; // 10MB 
    const io = new Server(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
            allowedHeaders: '*',
            credentials: false,
            optionsSuccessStatus: 204,
        }
    });
    let username;
    io.on('connection', (socket) => {
        socket.on("user connect" /* Events.CONNECT */, async (_username) => {
            username = _username;
            socket.join(username);
            await connect(socket.id, username);
        });
        socket.on("handshake" /* Events.HANDSHAKE */, (callback) => { callback(true); });
        socket.on('disconnect', async () => { await disconnect(socket.id); });
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
    });
}
