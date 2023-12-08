import { randomUUID } from "crypto";
import { with_db } from "./db";
import type { ChatType, MessageType } from "$lib/types";

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
        last_message: null,
        id: randomUUID(),
        messages: [],
        users: users
    }

    await with_db(async (db) => {
        await db.collection("chats").insertOne(chat);

        // Add the chat to the users
        for (const user of users) {
            await db.collection("users").updateOne({ username: user }, {
                $push: {
                    chats: {
                        id: chat.id,
                        members: users
                    }
                }
            });
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
        return await db.collection<ChatType>("chats").findOne({ users: { $all: users } }, { projection: { id: 1 } })
    });

}

/**
 * Get a chat by id
 * Returns the last 30 messages
 * @param id 
 * @returns The chat object
 */
export async function get_chat(id: string) {
    return await with_db(async (db) => {
        const chats = db.collection<ChatType>("chats")
        return await chats.findOne(
            { id: id },
            { projection: { _id: 0, messages: { $slice: -30 } } }
        );


    });
}

/**
 * Delete a chat
 * @param chat_id 
 */
export async function delete_chat(chat_id: string) {
    return await with_db(async (db) => {
        await db.collection<ChatType>("chats").deleteOne({ id: chat_id });
    });
}

/**
 * MESSAGES --------------------------------------------------------------------
 */

/**
 * Add a message to a chat
 * @param chat_id 
 * @param message 
 */
export async function add_message(chat_id: string, message: Partial<MessageType>) {
    message.id = randomUUID();
    message.attachments ||= [];
    
    return await with_db(async (db) => {
        await db.collection<ChatType>("chats").updateOne({ id: chat_id }, { $push: { messages: message as MessageType } });
    });
}

/** 
 * Delete a message from a chat
 * @param chat_id
 * @param message_id
 */
export async function delete_message(chat_id: string, message_id: string) {
    return await with_db(async (db) => {
        await db.collection<ChatType>("chats").updateOne({ id: chat_id }, { $pull: { messages: { id: message_id } } });
    });
}

/**
 * Edit a message from a chat
 * @param chat_id
 * @param message_id
 * @param new_message
 */
export async function edit_message(chat_id: string, message_id: string, new_message: Partial<MessageType>) {
    new_message.id = randomUUID();
    new_message.attachments ||= [];

    return await with_db(async (db) => {
        await db.collection<ChatType>("chats").updateOne({ id: chat_id, "messages.id": message_id }, { $set: { "messages.$": new_message as MessageType } });
    })
}

