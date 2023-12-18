import http from 'http';
import express from 'express';
import { handler } from './build/handler.js';
import { Server, ServerOptions } from 'socket.io';

const app = express();
const server = http.createServer(app);

// Inject SocketIO
// @ts-ignore
injectSocketIO(server);

// SvelteKit handlers
app.use(handler);

server.listen(3000, () => {
    console.log('Running on http://localhost:3000');
});


// TYPES ----------------------------------------------------------------------

/**
 * Socket events.
 * Read `/server/sockets.md` for more info.
 * @enum {string}
 * @readonly
 * Used to avoid typos and to have a single source of truth
 */
const enum Events {
    // Connection
    HANDSHAKE = "handshake", // Used to cofirm the connection
    CONNECT = "user connect",
    JOIN_CHAT = "join chat",

    // Friend Requests / Friendships
    NEW_FRIEND_REQUEST = "new friend request",
    CANCEL_FRIEND_REQUEST = "cancel friend request",
    ACCEPT_FRIEND_REQUEST = "accept friend request",
    REJECT_FRIEND_REQUEST = "reject friend request",
    UNFRIEND = "unfriend",

    // Status
    SET_STATUS = "set status",
    STATUS = "status",
    GET_FRIENDS_STATUS = "get friends status",

    // Messages
    NEW_MESSAGE = "new message",
    DELETE_MESSAGE = "delete message",
    EDIT_MESSAGE = "edit message",
}


const enum Status {
    OFFLINE = "offline",
    ONLINE = "online",
    TYPING = "typing",
}

type AttachmentType = {
    id: string;
    type: string; // image, video, audio, file
    name: string; // Original filename
    size: number; // Size in bytes
}

type MessageType = {
    id: string;
    author: string; // Username
    content: string;
    timestamp: string; // Local time 
    attachments: AttachmentType[]; // URLs
}


// SOCKET ---------------------------------------------------------------------
interface User {
    [x: string]: string;
    socketId: string;
    status: Status;

}


const onlineUsers = new Map<string, User>();

/**
 * Create a user online record
 * @param username 
 */
function create_user(username: string) {
    onlineUsers.set(username, {
        socketId: "",
        status: Status.OFFLINE
    });

    return onlineUsers.get(username) as User;
}

/** 
 * Check if user exists
 * @param username 
 */
function exists(username: string): boolean {
    return onlineUsers.has(username);
}

/**
 * Get user status  
 * @param username 
 * @returns status or "offline" if doesn't exist
 */
function get_status(username: string): Status {
    const user = onlineUsers.get(username);
    if (!user) {
        create_user(username);
    }
    return user?.status ?? Status.OFFLINE
}

/** 
 * Set user status
 * @param username
 * @param status 
 */
function set_status(username: string, status: Status) {
    let user = onlineUsers.get(username);
    if (!user) {
        user = create_user(username);
    }
    user.status = status;
}

/**
 * Log user connection 
 * @param socketId  
 * @param username
 */
function connect(socketId: string, username: string) {
    let user = onlineUsers.get(username);
    if (!user) {
        user = create_user(username);
    }
    user.socketId = socketId;
    user.status = Status.ONLINE;
}

/**
 * Log user disconnection
 * @param socketId 
 */
function disconnect(username: string) {
    const user = onlineUsers.get(username);
    if (!user) {
        return;
    }
    user.status = Status.OFFLINE;
    user.socketId = "";
}

/**
 * Check if user is online
 * @param username
 * @returns true if online, false otherwise
 */
function is_online(username: string): boolean {
    return get_status(username) === "online";
}

/**
 * Get username
 * @param socketId
 * @returns username or null if doesn't exist
 */
function get_username(socketId: string): string | null {
    onlineUsers.forEach((user, username) => {
        if (user.socketId === socketId) {
            return username;
        }
    });
    return null;
}

/**
 * Get online users from a list of usernames
 * @param usernames
 * @returns online users
 */
function get_online_from(usernames: string[]) {
    let online: User[] = [];
    for (const username of usernames) {
        if (is_online(username)) {
            let user = onlineUsers.get(username);

            if (!user) {
                user = create_user(username);
            }

            user.username = username;
            online.push(onlineUsers.get(username)!);
        }
    }
    return online;
}

// SOCKET  SERVER ---------------------------------------------------------------------

type HandshakeCallback = (success: boolean) => void;

function injectSocketIO(server: ServerOptions) {
    server.maxHttpBufferSize = 1e6 // 10MB 

    const io = new Server(server);

    io.on('connection', (socket) => {
        socket.on(Events.CONNECT, async (username: string) => {
            socket.join(username);
            connect(socket.id, username);
        });

        socket.on(Events.HANDSHAKE, (callback: HandshakeCallback) => { callback(true); });

        socket.on('disconnect', async () => {
            disconnect(socket.id);
        });

        /** 
         * Join Chat
         */
        socket.on(Events.JOIN_CHAT, async (chat_id: string, chat_members: string[], username: string) => {
            if (!get_username(socket.id)) {
                connect(socket.id, username);
            }

            // Leave all other rooms
            Object.keys(socket.rooms).forEach((room) => {
                if (room !== socket.id && room !== chat_id && room !== username) {
                    socket.leave(room);
                }
            });
            socket.join(chat_id);

            // Emit online status to all members of the chat
            io.to(chat_id).emit(Events.STATUS, get_username(socket.id), Status.ONLINE);

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
        socket.on(Events.STATUS, async (username: string, status: Status) => {
            console.log("status", username, status);

            if (is_online(socket.id)) {
                console.log("status", username, status);
                io.to(socket.id).emit(Events.STATUS, username, status);
            }
        });

        /**
         * Set Status
         */
        socket.on(Events.SET_STATUS, async (status: Status, friends: string[]) => {

            let username = get_username(socket.id);
            if (!username) { return; }

            // Set status
            set_status(username, status);

            friends.forEach(async (friend) => {
                if (is_online(friend)) {
                    io.to(friend).emit(Events.STATUS, username, status);
                }
            });
        });

        /**
         * Get status of friends 
         */
        socket.on(Events.GET_FRIENDS_STATUS, async (friends: string[]) => {
            friends.forEach(async (friend) => {
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
            socket.on(state, async (friend: string) => {

                let username = get_username(socket.id);
                if (is_online(friend)) {
                    io.to(friend).emit(state, username);
                }
            });
        }

        socket.on(Events.UNFRIEND, async (friend: string) => {
            if (is_online(friend)) {
                io.to(friend).emit(Events.UNFRIEND, get_username(socket.id));
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
