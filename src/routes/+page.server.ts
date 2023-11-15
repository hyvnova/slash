import type { Actions, PageServerLoad } from "./$types";
import { get_by, get_from, add_user, exists,  } from "$lib/server/db";
import { redirect } from "@sveltejs/kit";
import bcrypt from 'bcrypt';
import type { UserType } from "$lib/types";
import "dotenv/config";


export const load: PageServerLoad = async ({ cookies }) => {

    // If user is already logged in, redirect to /me
    let token = cookies.get("token");
    if (token && await exists(token)) { throw redirect(302, "/me"); }

}


/**
 * Actions object containing default action
 * Handles both sign up and login forms submission
 */
export const actions = {
    default: async ({ request, cookies }) => {

        const data = await request.formData();
        const username = data.get("username") as string;
        const password = data.get("password") as string

        // If username doesn't exist, then it's a sign up form
        if (!await get_by(username)) {
            await add_user({
                username,
                password: bcrypt.hashSync(password, 11),
            });

        // Otherwise it's a login form
        } else {
            const user = await get_by(username) as UserType;

            // If password is incorrect, then it's an error
            if (!bcrypt.compareSync(password, user.password)) {
                return { error: "Incorrect password" };
            }
        }

        // Get token from database to check if user exists / everything is correct
        let token = await get_from(username, "token");
        
        if (!token) { return { error: "User not found" }; }

        // Save token to session cookie
        cookies.set("token", token, {
            path: "/",
            secure: process.env.NODE_ENV === "production"
        });


        // If everything is correct, then redirect to /me
        throw redirect(302, "/me");
    }
} satisfies Actions;