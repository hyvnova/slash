/**
 * ### GET: /me/chat/[members]
 * Gets the chat id from the server by searching for the chat with the given members on the user chats.
 * @param {string} members - Comma separated list of usernames. (Doesn't include the current user)
 * @param Redirect to `/chat/[id]` if the chat exists. Otherwise, redirect to error page `/me/chat/+error.svelte`.
 */

import { get_by } from "$lib/server/db/user";
import { Routes } from "$lib/types";
import { error, redirect, type RequestHandler } from "@sveltejs/kit";


export const GET: RequestHandler = async ({ params, cookies }) => {
    const { members } = params;

    // Validate members
    if (!members) throw error(400, {
        message: "No members provided",
    }) 

    let members_list: string[] = [];
    try {
        members_list = members.split(",");
    } catch (e) {
        throw error(400, {
            message: "Invalid members list",
        })
    }


    // Get the token from the cookies
    const token = cookies.get("token")

    // If the token is not present, return to / (home)
    if (!token) { throw redirect(302, "/") }

    // Get the user data from the token
    const user = await get_by(token);

    // If the user is not found, return to / (home)
    if (!user) {
        cookies.delete("token", { path: "/", secure: process.env.NODE_ENV === "production" }); throw redirect(302, "/")
    }

    members_list.push(user.username);

    // Search for the chat
    let chat_id: string | null = null;
    for (let chat of user.chats) {
        if (chat.members.sort().toString() === members_list.sort().toString()) {
            chat_id = chat.id;
            break;
        }
    }

    // If the chat is not found, throw an error
    if (!chat_id) { 
        throw error(404, {
            message: "Chat room not found",
        })
    }

    // Otherwise, redirect to the chat room
    throw redirect(302, `${Routes.CHAT}/${chat_id}`)
}
