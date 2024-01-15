export type SocketUser = {
    username: string;
    socketId: string;
    status: Status;
}


/**
 * Socket events.
 * Read `/server/sockets.md` for more info.
 * @enum {string}
 * @readonly
 * Used to avoid typos and to have a single source of truth
 */
export const enum Events {
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
    NEW_STR_MESSAGE = "new str message", // Message with only text - used to save resources

    DELETE_MESSAGE = "delete message",
    EDIT_MESSAGE = "edit message",
}


export const enum Status {
    OFFLINE = "offline",
    ONLINE = "online",
    TYPING = "typing",
}

export type AttachmentType = {
    id: string;
    type: string; // image, video, audio, file
    name: string; // Original filename
    size: number; // Size in bytes
}

export type MessageType = {
    id: string;
    author: string; // Username
    content: string;
    timestamp: string; // Local time 
    attachments: AttachmentType[]; // URLs
}