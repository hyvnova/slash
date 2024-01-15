import { Server, type ServerOptions } from 'socket.io';
import { connect, disconnect, get_online_from, get_status, get_username, is_online, set_status } from './socket_db.js';
import { Events, type MessageType, Status } from './types.js';


type HandshakeCallback = (success: boolean) => void;

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

    let username: string;

    io.on('connection', (socket) => {
        socket.on(Events.CONNECT, async (_username: string) => {
            username = _username;
            socket.join(username);
            await connect(socket.id, username);
        });

        socket.on(Events.HANDSHAKE, (callback: HandshakeCallback) => { callback(true); });

        socket.on('disconnect', async () => { await disconnect(socket.id); });

        /** 
         * Join Chat
         */
        socket.on(Events.JOIN_CHAT, async (chat_id: string, chat_members: string[], username: string) => {
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

            // Get others' online status
            const members = await get_online_from(chat_members)
            members.forEach((member) => {
                io.to(socket.id).emit(Events.STATUS, member.username, member.status);
            });
        });


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
            if (!username) { return;}

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
    });
}
