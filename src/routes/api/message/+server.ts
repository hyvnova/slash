/**
 * Handle message actions
 */

import { add_message, delete_message, edit_message } from "$lib/server/db/chat";
import type { MessageType } from "$lib/types";
import { json, type RequestHandler } from "@sveltejs/kit";
import "dotenv/config";


enum ActionType {
    send = "send", // Send message
    delete = "delete", // Delete message
    edit = "edit", // Edit message
}

type ExpectedParams = {
    action?: ActionType,
    chat_id?: string,
    message_id?: string,
    message?: Partial<MessageType>,
}


const MissingParameters = json({
    error: "Missing parameters at message handler."
}, { status: 400 })

export const POST: RequestHandler = async ({ request, cookies }) => {
    let data: ExpectedParams = await request.json();

    let { action, chat_id, message_id, message } = data;

    // Check if action is present
    if (!action) {
        return MissingParameters
    }

    // Check if action is valid
    if (!(action in ActionType)) {
        return json({
            error: "Invalid action at message handler."
        }, { status: 400 })
    }

    // Check if user is logged in
    if (!cookies.get("token")) {
        return json({
            error: "You are not logged in"
        }, { status: 400 })
    }

    switch (action) {
        case ActionType.send:
            // Check if chat_id and message are present
            if (!chat_id || !message) {
                return MissingParameters
            }
            // Send message
            await add_message(chat_id, message);
            break;

        
        case ActionType.delete:
            // Check if chat_id and message_id are present
            if (!chat_id || !message_id) {
                return MissingParameters
            }
            // Delete message
            await delete_message(chat_id, message_id);
            break;

        case ActionType.edit:
            // Check if chat_id, message_id and message are present
            if (!chat_id || !message_id || !message) {
                return MissingParameters
            }
            await edit_message(chat_id, message_id, message);
            break;
    }


    return json({
        success: true
    }, { status: 200 })

}