import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";
import { get_by } from "$lib/server/db/user";
import type { UserType } from "$lib/types";


export const load: LayoutServerLoad = async ({ cookies }) => {
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

    // Otherwise, return the user data
    return {
        user: {
            username: user.username,
            avatar: user.avatar,
            friends: user.friends,
            pending_requests: user.pending_requests,
            chats: user.chats,
            verified: user.verified
        } as UserType

    }

}