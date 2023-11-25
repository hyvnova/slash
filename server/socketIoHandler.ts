import { Server, type ServerOptions } from 'socket.io';
import { connect, disconnect, get_username, is_online } from '../src/lib/server/db/socket';
import { Events } from '../src/lib/types';

export default function injectSocketIO(server: Partial<ServerOptions> | undefined) {
    const io = new Server(server);

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

    });
}
