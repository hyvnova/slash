import { Server, type ServerOptions } from 'socket.io';

// map of socket id to username
const socket_name: Record<string, string> = {}

const is_online = (username: string) => Object.values(socket_name).includes(username);

export default function injectSocketIO(server: Partial<ServerOptions> | undefined) {
    const io = new Server(server);

    io.on('connection', (socket) => {
        
        socket.on('user connect', (username: string) => {
            socket.join(username);
            socket_name[socket.id] = username;
        });

        socket.on('disconnect', () => {
            socket.leave(socket_name[socket.id]);
            delete socket_name[socket.id];
        });

        /**
         * Status
         */
        socket.on('status', (status: string, friends: string[]) => {
            friends.forEach((friend) => {
                if (is_online(friend)) {
                    io.to(friend).emit('status', status, socket_name[socket.id]);
                }
            });
        })

        // Request statuses
        socket.on('request statuses', (friends: string[]) => {
            friends.forEach((friend) => {
                if (is_online(friend)) {
                    io.to(socket_name[socket.id]).emit('status', socket_name[socket.id]);
                }
            });
        })


        /**
         * Friend Requests 
         * Used to update other's friend requests UI on the fly
         */
        const friend_requests_states = ['new', 'cancel', 'accept', 'reject'];
        for (const state of friend_requests_states) {
            socket.on(`${state} friend request`, (friend: string) => {
                console.log(`${state} friend request`, friend, socket_name[socket.id]);
                if (is_online(friend)) {
                    io.to(friend).emit(`${state} friend request`, socket_name[socket.id]);
                }
            });
        }

        socket.on('unfriend', (friend: string) => {
            if (is_online(friend)) {
                io.to(friend).emit('unfriend', socket_name[socket.id]);
            }
        });

    });
}
