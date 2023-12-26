import { Server, type ServerOptions } from 'socket.io';
import { connect, disconnect, get_online_from, get_status, is_online, set_status } from './socket_db.js';
import { Events, type MessageType, Status } from './types.js';


type HandshakeCallback = (success: boolean) => void;
let username = "";

export default function injectSocketIO(server: ServerOptions) {
    server.maxHttpBufferSize = 1e6 // 10MB 

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
        socket.on(Events.CONNECT, (_username: string) => {
            username = _username;
            socket.join(username);
            connect(socket.id, username);
        });

        socket.on(Events.HANDSHAKE, (callback: HandshakeCallback) => { callback(true); });

        socket.on('disconnect', () => {
            disconnect(socket.id);
        });

        /** 
         * Join Chat
         */
        socket.on(Events.JOIN_CHAT, (chat_id: string, chat_members: string[], username: string) => {
            connect(socket.id, username);

            // Leave all other rooms
            Object.keys(socket.rooms).forEach((room) => {
                if (room !== socket.id && room !== chat_id && room !== username) {
                    socket.leave(room);
                }
            });
            socket.join(chat_id);

            // Emit online status to all members of the chat
            io.to(chat_id).emit(Events.STATUS, username, Status.ONLINE);

            // Get others' online status
            const members = get_online_from(chat_members)
            members.forEach((member) => {
                io.to(socket.id).emit(Events.STATUS, member.username, member.status);
            });
        });


        /**
         * Receive Status
         * username - user who sent the status
         * status - status of the user
         */
        socket.on(Events.STATUS, (username: string, status: Status) => {
            console.log("status", username, status);

            if (is_online(socket.id)) {
                console.log("status", username, status);
                io.to(socket.id).emit(Events.STATUS, username, status);
            }
        });

        /**
         * Set Status
         */
        socket.on(Events.SET_STATUS, (status: Status, friends: string[]) => {
            if (!username) { return; }

            // Set status
            set_status(username, status);

            friends.forEach((friend) => {
                if (is_online(friend)) {
                    io.to(friend).emit(Events.STATUS, username, status);
                }
            });
        });

        /**
         * Get status of friends 
         */
        socket.on(Events.GET_FRIENDS_STATUS, (friends: string[]) => {
            friends.forEach((friend) => {
                io.to(socket.id).emit(Events.STATUS, friend, get_status(friend));
            });
        })


        /**
         * Friend Requests 
         * Used to update other's friend requests UI on the fly
         */
        const friend_requests_states = [
            Events.NEW_FRIEND_REQUEST,
            Events.CANCEL_FRIEND_REQUEST,
            Events.ACCEPT_FRIEND_REQUEST,
            Events.REJECT_FRIEND_REQUEST,
        ]
        for (const state of friend_requests_states) {
            socket.on(state, (friend: string) => {

                console.log(username, "send a", state, "to", friend)
                console.log("is online", is_online(friend))

                if (is_online(friend)) {
                    io.to(friend).emit(state, username);
                }
            });
        }

        socket.on(Events.UNFRIEND, (friend: string) => {
            if (is_online(friend)) {
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
    });
}
