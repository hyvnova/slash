import { Server, Socket, type ServerOptions } from 'socket.io';
import { connect, disconnect, get_username, is_online } from '../src/lib/server/db/socket';
import { Events, MessageType } from '../src/lib/types';

// @ts-ignore
function get_chat_id(socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>): string {
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
        socket.on(Events.connect, (username: string) => {
            socket.join(username);

            connect(socket.id, username);

            console.debug(username, 'connected');
        });

        socket.on('disconnect', async () => {
            console.debug('disconnected', await get_username(socket.id));
            await disconnect(socket.id);
        });

        /** 
         * Join Chat
         */
        socket.on(Events.join_chat, async (chat_id: string) => {
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
        socket.on(Events.set_status, async (status: string, friends: string[]) => {
            let username = await get_username(socket.id);
            friends.forEach(async (friend) => {
                if (await is_online(friend)) {
                    io.to(friend).emit(Events.status, status, username);
                }
            });
        });

        /**
         * Friend Requests 
         * Used to update other's friend requests UI on the fly
         */
        const friend_requests_states = [
            Events.new_friend_request,
            Events.cancel_friend_request,
            Events.accept_friend_request,
            Events.reject_friend_request,
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

        socket.on(Events.unfriend, async (friend: string) => {
            if (await is_online(friend)) {
                io.to(friend).emit(Events.unfriend, await get_username(socket.id));
            }
        });


        /**
         * Messages: send, delete, edit
         */
        socket.on(Events.new_message, async (message: Partial<MessageType>) => {
            io.to(get_chat_id(socket)).emit(Events.new_message, message);
        });

        socket.on(Events.delete_message, async (message_id: string) => {
            io.to(get_chat_id(socket)).emit(Events.delete_message, message_id);
        });

        socket.on(Events.edit_message, async (message: MessageType) => {
            io.to(get_chat_id(socket)).emit(Events.edit_message, message);
        });
    });
}
