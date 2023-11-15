import type { Writable } from "svelte/store";

export type UserType = {
    username: string; //Works as an id
    password: string; // Hashed password
    token: string;
    avatar: string;
    verified: boolean;
    friends: string[]; // Usernames
    pending_requests: string[]; // Usernames - Pending friend requests 
    rejected_requests: string[]; // Usernames - Rejected friend requests
    chats: string[]; // Chat ids
}

export type AttachmentType = {
    id: string;
    url: string;
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
    head: MessageType[]; // Last 10 messages
    attachments: string[]; // Attachment ids
}

export type NotificationType = Writable<{
    type: "error" | "info";
    title: string;
    message: string;
    duration?: number;
} | null>;



export enum FriendshipStatusType {
    NONE = "none",
    FRIENDS = "friends",
    REQUESTED = "requested",
    REJECTED = "rejected"
}

export type UserSearchResult = {
    username: string,
    avatar: string,
    friendship: Writable<FriendshipStatusType> 
}

