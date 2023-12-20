import type { AttachmentType, FriendshipStatusType, MessageType, UserSearchResult, UserType } from "$lib/types";
import { writable } from "svelte/store";


export async function search_users(query: string, user: UserType): Promise<UserSearchResult[]> {
    let res = await fetch("/api/search", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ query, user })
    })

    // map the friendship status to a writable store so it can be updated in ui
    let json: {
        username: string,
        avatar: string,
        friendship: FriendshipStatusType 
    }[]  = await res.json();

    let result = json.map((result) => {
        return {
            ...result,
            friendship: writable(result.friendship)
        };

    });

    return result;
}


/**
 * Updates the friendship status between two users
 * @param {string} user User making the change of friendship status
 * @param {string} other Other user
 * @param {FriendshipStatusType} status New friendship status
 */
export async function update_friendship(user: string, other: string, status: FriendshipStatusType) {
    let res = await fetch(`/api/update_friendship`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ user, other, status })
    })
    return res.status === 200;
}

/**
 * Handles message events/actions
 */
export async function handle_message(params: {
    action: "send" | "delete" | "edit",
    chat_id: string,
    message_id?: string,
    message?: Partial<MessageType>,
}) {
    let res = await fetch("/api/message", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(params)
    })

    return res.status === 200;
}


/**
 * Message attachment upload
 */
export async function upload_attachments(files: FormData): Promise<AttachmentType[]> {
    let res = await fetch("/api/file/upload", {
        method: "POST",
        body: files 
    })

    if (!res.ok) {
        console.log("Error uploading attachments", res);
        return [];
    }
    return res.json() as Promise<AttachmentType[]>;
}