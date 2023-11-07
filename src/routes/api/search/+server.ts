import { find_matching, get_by } from "$lib/server/db";
import { json, type RequestHandler } from "@sveltejs/kit";



type ExpectedParams = {
    query: string, // Search query (username, email)
}

export const POST: RequestHandler = async ({ request, cookies }) => {
    let data: ExpectedParams = await request.json();

    let { query } = data;

    // Check if all parameters are present
    if (!query) {
        return json({
            error: "Missing parameters. Required parameters: query: string"
        }, { status: 400 })
    }


    // Get the token from the cookies
    const token = cookies.get("token")

    // If the token is not present, return to / (home)
    if (!token) {
        return json({
            error: "You are not logged in."
        }, { status: 400 })
    }

    // Get the user data from the token
    const user = await get_by(token);

    // Search for users
    // filter results, only allow similar usernames if are user friends
    let results = (await find_matching(query, ["username", "avatar"])).filter(result => {
        if (result.username === user.username) return false;
        // @ts-ignore
        if (user.friends.includes(result.username)) return true;
        // @ts-ignore
        return result.username == query;
    });

    return json({
        success: true,
        results: results ?? []
    }, { status: 200 })

};