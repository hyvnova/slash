import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";
import { get_by } from "$lib/server/db";


export const load: LayoutServerLoad = async ({ cookies }) => {
    // Get the token from the cookies
    const token = cookies.get("token")

    // If the token is not present, return to / (home)
    if (!token) { throw redirect(302, "/") }

    // Get the user data from the token
    const user = await get_by(token);


    // Otherwise, return the user data
    return {
        username: user.username,
        avatar: user.avatar,
        verified: user.verified
    }
}