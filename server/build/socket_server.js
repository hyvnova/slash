import { Server } from 'socket.io';
import { connect, disconnect, get_online_from, get_status, is_online, set_status } from './socket_db.js';
let username = "";
export default function injectSocketIO(server) {
    server.maxHttpBufferSize = 1e6; // 10MB 
    const io = new Server(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
            allowedHeaders: '*',
            credentials: true,
            optionsSuccessStatus: 204,
        }
    });
    io.on('connection', (socket) => {
        socket.on("user connect" /* Events.CONNECT */, (_username) => {
            username = _username;
            socket.join(username);
            connect(socket.id, username);
        });
        socket.on("handshake" /* Events.HANDSHAKE */, (callback) => { callback(true); });
        socket.on('disconnect', () => {
            disconnect(socket.id);
        });
        /**
         * Join Chat
         */
        socket.on("join chat" /* Events.JOIN_CHAT */, (chat_id, chat_members, username) => {
            connect(socket.id, username);
            // Leave all other rooms
            Object.keys(socket.rooms).forEach((room) => {
                if (room !== socket.id && room !== chat_id && room !== username) {
                    socket.leave(room);
                }
            });
            socket.join(chat_id);
            // Emit online status to all members of the chat
            io.to(chat_id).emit("status" /* Events.STATUS */, username, "online" /* Status.ONLINE */);
            // Get others' online status
            const members = get_online_from(chat_members);
            members.forEach((member) => {
                io.to(socket.id).emit("status" /* Events.STATUS */, member.username, member.status);
            });
        });
        /**
         * Receive Status
         * username - user who sent the status
         * status - status of the user
         */
        socket.on("status" /* Events.STATUS */, (username, status) => {
            console.log("status", username, status);
            if (is_online(socket.id)) {
                console.log("status", username, status);
                io.to(socket.id).emit("status" /* Events.STATUS */, username, status);
            }
        });
        /**
         * Set Status
         */
        socket.on("set status" /* Events.SET_STATUS */, (status, friends) => {
            if (!username) {
                return;
            }
            // Set status
            set_status(username, status);
            friends.forEach((friend) => {
                if (is_online(friend)) {
                    io.to(friend).emit("status" /* Events.STATUS */, username, status);
                }
            });
        });
        /**
         * Get status of friends
         */
        socket.on("get friends status" /* Events.GET_FRIENDS_STATUS */, (friends) => {
            friends.forEach((friend) => {
                io.to(socket.id).emit("status" /* Events.STATUS */, friend, get_status(friend));
            });
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
            socket.on(state, (friend) => {
                console.log(username, "send a", state, "to", friend);
                console.log("is online", is_online(friend));
                if (is_online(friend)) {
                    io.to(friend).emit(state, username);
                }
            });
        }
        socket.on("unfriend" /* Events.UNFRIEND */, (friend) => {
            if (is_online(friend)) {
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
    });
}
