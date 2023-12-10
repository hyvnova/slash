import { create_chat, get_chat } from "$lib/server/db/chat";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { get_by } from "$lib/server/db/user";
import {  Routes } from "$lib/types";

export const load: PageServerLoad = async ({ params, cookies }) => {
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

    const chat = await get_chat(params.id);

    // If the chat is not found or user is not included in it, return to /me user page
    if (!chat || !chat.members.includes(user.username)) {
        throw redirect(302, Routes.HOME)
    }

    return {
        chat,
        user: {
            username: user.username,
            avatar: user.avatar,
            friends: user.friends,
            pending_requests: user.pending_requests,
            chats: user.chats,
            verified: user.verified
        },
        other: chat.members.find((u) => u !== user.username) as string
    }
}