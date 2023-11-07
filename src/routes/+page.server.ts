import type { Actions, PageServerLoad } from "./$types";
import { get_by, get_from, add_user,  } from "$lib/server/db";
import { redirect } from "@sveltejs/kit";
import bcrypt from 'bcrypt';
import type { UserData } from "$lib/types";
import "dotenv/config";


/**
 * Endpoint to request user data from nova-auth
 * @param token - The token to request user data with
 * @returns The user data: { username, avatar, verified }
 */
const NA_USER_ENDPOINT = "https://nova-auth.vercel.app/api/user";

export const load: PageServerLoad = async ({ cookies, url }) => {

    // Create nova auth redirect url
    let p = new URLSearchParams({
        who: process.env.NA_API_KEY as string,
        callback: url.origin,
        want: 'username,avatar,verified'
    });
    let auth_url = 'https://nova-auth.vercel.app/auth?' + p.toString(); // This is the URL you need to redirect the user to


    // If user is already logged in, redirect to /me
    let token = cookies.get("token");
    if (token && await get_by(token)) { throw redirect(302, "/me"); }

    // Check of login through nova-auth, url params {success, token | error}
    let params = new URLSearchParams(url.search);
    let success = params.get("success") == "true";

    if (success) {
        let access_token = decodeURIComponent(params.get("token") as string);
        
        // Request userdata using token
        let res = await fetch(NA_USER_ENDPOINT, {
            method: "GET",
            headers: {
                "Authorization": access_token as string
            }
        });

        // If request failed, redirect to /
        if (!res.ok) { throw redirect(302, "/"); }

        // Parse response
        let data = await res.json();

        let token = await add_user({
            username: data.username,
            avatar: data.avatar,
            verified: data.verified,
        });

        // Save token to session cookie
        cookies.set("token", token, {
            path: "/",
            secure: process.env.NODE_ENV === "production"
        });

        // If everything is correct, then redirect to /me
        throw redirect(302, "/me");
    }

    return {
        auth_url,
    }
}


/**
 * Actions object containing default action
 * Handles both sign up and login forms submission
 * In case of error, returns { success: false, error: string }
 * In case of success (login or sign up), will redirect to /me
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
            const user = await get_by(username) as UserData;

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