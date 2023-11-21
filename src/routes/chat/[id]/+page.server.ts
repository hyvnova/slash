import { get_chat } from "$lib/server/db/chat";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { get_by } from "$lib/server/db";


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
    if (!chat || !chat.users.includes(user.username)) {
        throw redirect(302, "/me")
    }

    return {
        chat
    }
}