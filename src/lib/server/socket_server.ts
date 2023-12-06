import { Server, Socket, type ServerOptions } from 'socket.io';
import { connect, disconnect, get_username, is_online } from './db/socket';
import { Events, type MessageType } from './../types';


export default function injectSocketIO(server: ServerOptions) {
    server.maxHttpBufferSize = 1e6 // 10MB 

    const io = new Server(server);

    io.on('connection', (socket) => {
        socket.on(Events.CONNECT, async (username: string) => {
            socket.join(username);
            await connect(socket.id, username);
        });

        socket.on('disconnect', async () => {
            await disconnect(socket.id);
        });

        /** 
         * Join Chat
         */
        socket.on(Events.JOIN_CHAT, async (chat_id: string, username: string) => {
            if (!await get_username(socket.id)) {
                await connect(socket.id, username);
            }

            console.debug(username, 'joined chat');

            // Leave all other rooms
            Object.keys(socket.rooms).forEach((room) => {
                if (room !== socket.id) {
                    console.log("LEAVING ROOM", room);
                    socket.leave(room);
                }
            });
            socket.join(chat_id);
        });

        /**
         * Set Status
         */
        socket.on(Events.SET_STATUS, async (status: string, friends: string[]) => {
            let username = await get_username(socket.id);
            friends.forEach(async (friend) => {
                if (await is_online(friend)) {
                    io.to(friend).emit(Events.STATUS, status, username);
                }
            });
        });

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

                let username = await get_username(socket.id);
                console.debug(state, friend, username);

                if (await is_online(friend)) {
                    io.to(friend).emit(state, username);
                }
            });
        }

        socket.on(Events.UNFRIEND, async (friend: string) => {
            if (await is_online(friend)) {
                io.to(friend).emit(Events.UNFRIEND, await get_username(socket.id));
            }
        });

        /**
         * Messages: send, delete, edit
         */
        socket.on(Events.NEW_MESSAGE, async (chat_id: string, message: Partial<MessageType>) => {
            io.to(chat_id).emit(Events.NEW_MESSAGE, message);
        });

        socket.on(Events.DELETE_MESSAGE, async (chat_id: string, message_id: string) => {
            io.to(chat_id).emit(Events.DELETE_MESSAGE, message_id);
        });

        socket.on(Events.EDIT_MESSAGE, async (chat_id: string, message: MessageType) => {
            io.to(chat_id).emit(Events.EDIT_MESSAGE, message);
        });
    });
}
