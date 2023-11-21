import { randomUUID } from "crypto";
import { with_db } from "./db";
import type { ChatType } from "$lib/types";

/**
 *  Create a chat with the given users
 * @param users 
 * @returns The chat object
 */
export async function create_chat(users: string[]) {

    if (await exists_chat(users)) {
        return;
    }   


    let chat: ChatType = {
        attachments: [],
        head: null,
        id: randomUUID(),
        messages: [],
        users: users
    }

    await with_db(async (db) => {
        await db.collection("chats").insertOne(chat);

        // Add the chat to the users
        for (const user of users) {
            await db.collection("users").updateOne({ username: user }, { $push: { chats: {
                id: chat.id,
                members: users
            }} });
        }
    });
}

/**
 * Find an existing chat between the given users
 * @param users
 * @returns The chat id or null if no chat exists
 */
export async function exists_chat(users: string[]) {
    return await with_db(async (db) => {
        return await db.collection<ChatType>("chats").findOne({ users: { $all: users } }, { projection: { id: 1} })
    });

}

/**
 * Get a chat by id
 * @param id 
 * @returns The chat object
 */
export async function get_chat(id: string) {
    return await with_db(async (db) => {
        return await db.collection<ChatType>("chats").findOne({ id: id }, { projection: { _id: 0 } }); 

    });
}