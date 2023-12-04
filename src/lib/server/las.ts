import { Server, type ServerOptions } from 'socket.io';
import { connect, disconnect, get_username, is_online } from './db/socket';

export default function injectSocketIO(server: Partial<ServerOptions> | undefined) {
    const io = new Server(server);

    io.on('connection', (socket) => {

        socket.on('user connect', async (username: string) => {
            socket.join(username);
            await connect(socket.id, username);
            console.debug('connected', username);
        });

        socket.on('disconnect', async () => {
            console.debug('disconnected', await get_username(socket.id));
            await disconnect(socket.id);
        });

        /**
         * Set Status
         */
        socket.on('set status', async (status: string, friends: string[]) => {
            let username = await get_username(socket.id);
            friends.forEach(async (friend) => {
                if (await is_online(friend)) {
                    io.to(friend).emit('status', status, username);
                }
            });
        });

        /**
         * Friend Requests 
         * Used to update other's friend requests UI on the fly
         */
        const friend_requests_states = ['new', 'cancel', 'accept', 'reject'];
        for (const state of friend_requests_states) {
            socket.on(`${state} friend request`, async (friend: string) => {

                let username = await get_username(socket.id);
                console.debug(`${state} friend request`, friend, username);

                if (await is_online(friend)) {
                    io.to(friend).emit(`${state} friend request`, username);
                }
            });
        }

        socket.on('unfriend', async (friend: string) => {
            if (await is_online(friend)) {
                io.to(friend).emit('unfriend', await get_username(socket.id));
            }
        });

    });
}
