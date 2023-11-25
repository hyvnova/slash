import type { Writable } from "svelte/store";



const BASE = "/app"; /* Base route, where the app is hosted. Accessed after login. */

/**
 * Routes
 * @enum {string}
 * @readonly
 * Used to avoid typos and to have a single source of truth
 */
export const enum Routes {
    HOME = BASE + "/me",
    SETTINGS = BASE + "/me/settings",
    CHAT = BASE + "/chat", // Follwed /[chat_id]
    CHAT_REDIRECT = BASE + "/me/chat", // Used to redirect to the chat page. Followed by /[meembers]
    PROFILE = BASE + "/profile",
}



/**
 * Socket events.
 * Read `/server/sockets.md` for more info.
 * @enum {string}
 * @readonly
 * Used to avoid typos and to have a single source of truth
 */
export const enum Events {
    // General
    connect = "user connect",

    // Friend Requests / Friendships
    new_friend_request = "new friend request",
    cancel_friend_request = "cancel friend request",
    accept_friend_request = "accept friend request",
    reject_friend_request = "reject friend request",
    unfriend = "unfriend",

    // Status
    set_status = "set status",
    status = "status",
}

export type UserType = {
    username: string; //Works as an id
    password: string; // Hashed password
    token: string;
    avatar: string;
    verified: boolean;
    friends: string[]; // Usernames
    pending_requests: string[]; // Usernames - Pending friend requests 
    rejected_requests: string[]; // Usernames - Rejected friend requests
    chats: {
        id: string;
        members: string[]; // Usernames
    }[]; // Chat ids
}

export type AttachmentType = {
    id: string;
    url: string; // A way to point to attachments, contains: sender, chat, filename
    type: string; // image, video, audio, file
}

export type MessageType = {
    id: string;
    author: string; // Username
    content: string;
    timestamp: number;
    attachments: AttachmentType[]; // URLs
}

export type ChatType = {
    id: string;
    users: string[]; // Usernames
    messages: string[]; // Message ids
    head: MessageType | null; // Last message
    attachments: string[]; // Attachment ids
}

export type NotificationType = Writable<{
    type: "error" | "info";
    title: string;
    message: string;
    duration?: number;
} | null>;



/**
 * Represents the relationship between two users
 */
export enum FriendshipStatusType {
    NONE = "none", // both sideas; default state
    FRIENDS = "friends", // both sides; after accepting a friend request
    REQUESTED = "requested", // both sides; after sending a friend request
    REJECTED = "rejected",  // for rejecter's side; after rejecting a friend request
    WAS_REJECTED = "was_rejected" // for rejected side; after rejecting a friend request
}

export type UserSearchResult = {
    username: string,
    avatar: string,
    friendship: Writable<FriendshipStatusType> 
}


