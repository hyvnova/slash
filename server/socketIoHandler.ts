import { Server, type ServerOptions } from 'socket.io';
import { connect, disconnect, get_username, is_online } from '../src/lib/server/db/socket';
import { Events, MessageType } from '../src/lib/types';

// @ts-ignore
function get_chat_id(socket): string {
    return Array.from(socket.rooms)[1] as string;
}

export default function injectSocketIO(server: Partial<ServerOptions> | undefined) {
    const io = new Server({
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
        },
        maxHttpBufferSize: 1e8, // 100 MB
        ...server,
    });

    io.on('connection', (socket) => {
        socket.on(Events.CONNECT, async (username: string) => {
            socket.join(username);
            await connect(socket.id, username);
            console.debug(username, 'connected');
        });

        socket.on('disconnect', async () => {
            console.debug('disconnected', await get_username(socket.id));
            await disconnect(socket.id);
        });

        /** 
         * Join Chat
         */
        socket.on(Events.JOIN_CHAT, async (chat_id: string) => {
            console.debug("join_chat", chat_id)
            console.debug(await get_username(socket.id), 'joined chat');

            // Leave all other rooms
            Object.keys(socket.rooms).forEach((room) => {
                if (room !== socket.id) {
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
        socket.on(Events.NEW_MESSAGE, (message: Partial<MessageType>) => {
            io.to(get_chat_id(socket)).emit(Events.NEW_MESSAGE, message);
        });

        socket.on(Events.DELETE_MESSAGE, (message_id: string) => {
            io.to(get_chat_id(socket)).emit(Events.DELETE_MESSAGE, message_id);
        });

        socket.on(Events.EDIT_MESSAGE, (message: MessageType) => {
            io.to(get_chat_id(socket)).emit(Events.EDIT_MESSAGE, message);
        });
    });
}
