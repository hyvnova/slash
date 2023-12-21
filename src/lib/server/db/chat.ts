import { randomUUID } from "crypto";
import { db } from "./db";
import type { ChatType, MessageType } from "$lib/types";

/**
 *  Create a chat with the given members
 * @param members 
 * @returns The chat object
 */
export async function create_chat(members: string[]) {

    if (await exists_chat(members)) {
        return;
    }

    let chat: ChatType = {
        attachments: [],
        last_message: null,
        id: randomUUID(),
        messages: [],
        members
    }

    await db.collection("chats").insertOne(chat);

    // Add the chat to the members 
    for (const user of members) {
        await db.collection("users").updateOne({ username: user }, {
            $push: {
                chats: {
                    id: chat.id,
                    members
                }
            }
        });
    }
}

/**
 * Find an existing chat between the given members
 * @param members 
 * @returns The chat id or null if no chat exists
 */
export async function exists_chat(members: string[]) {
    return await db.collection<ChatType>("chats").findOne({ members: { $all: members } }, { projection: { id: 1 } })
}

/**
 * Get a chat by id
 * Returns the last 30 messages
 * @param id 
 * @returns The chat object
 */
export async function get_chat(id: string) {
    const chats = db.collection<ChatType>("chats")
    return await chats.findOne(
        { id: id },
        { projection: { _id: 0, messages: { $slice: -30 } } }
    );


}

/**
 * Delete a chat
 * @param chat_id 
 */
export async function delete_chat(chat_id: string) {
    await db.collection<ChatType>("chats").deleteOne({ id: chat_id });
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

    // If there's 100 or more messages, remove the extra ones
    const chat = await db.collection<ChatType>("chats").findOne({ id: chat_id }, { projection: { messages: { $slice: -100 } } });
    if (chat && chat.messages.length >= 100) {
        await db.collection<ChatType>("chats").updateOne({ id: chat_id }, { $pop: { messages: -1 } });
    }

    await db.collection<ChatType>("chats").updateOne({ id: chat_id }, { $push: { messages: message as MessageType } });
}

/** 
 * Delete a message from a chat
 * @param chat_id
 * @param message_id
 */
export async function delete_message(chat_id: string, message_id: string) {
    await db.collection<ChatType>("chats").updateOne({ id: chat_id }, { $pull: { messages: { id: message_id } } });
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

    await db.collection<ChatType>("chats").updateOne({ id: chat_id, "messages.id": message_id }, { $set: { "messages.$": new_message as MessageType } });
}

