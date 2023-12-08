/**
 *  ROUTE: /avatar/[username]
 * METHOD: GET
 * Returns the avatar of the user
 * 
 * If the user doesn't exist, returns a 404
 */

import { exists, get_from } from "$lib/server/db/user";
import type { RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ url, params }) => {

    const username = params.username;

    if (!username || !await exists(username)) {
        return new Response(null, { status: 404 });
    }

    let avatar_url = await get_from<string>(username, "avatar");

    if (!avatar_url) {
        return new Response(null, { status: 404 });
    }

    const avatar_type = avatar_url?.split(".").pop();

    // if avatar is relative, prepend the base url
    if (avatar_url.startsWith("/")) {
        avatar_url = `${url.origin}${avatar_url}`
    }

    const response = await fetch(avatar_url);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return new Response(buffer, {
        status: 200,
        headers: {
            'Content-Type': response.headers.get('Content-Type') || `image/${avatar_type}`
        }
    });

};