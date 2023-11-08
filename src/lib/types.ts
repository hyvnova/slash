export type UserType = {
    username: string;
    password: string; // Hashed password
    token: string;
    avatar: string;
    verified: boolean;
    friends: string[]; // Usernames
    requests: string[]; // Usernames
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

