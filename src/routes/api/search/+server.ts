import { find_matching, get_from } from "$lib/server/db/user";
import { FriendshipStatusType, type UserType } from "$lib/types";
import { json, type RequestHandler } from "@sveltejs/kit";

/**
 * Gets items that are similar to the target
 * @param {string} target The target string
 * @param {string[]} items The items to compare
 */
function similars(target: string, items: string[]) {
    return items.filter(item => item.includes(target));
}


type ExpectedParams = {
    query: string, // Search query 
    user: UserType // User's data
}

/**
 * Searches for users that match the query
 * @param {string} query Search query (username, email)
 * @param {UserType} user 
 */
export const POST: RequestHandler = async ({ request }) => {
    let data: ExpectedParams = await request.json();

    let { query, user } = data;

    // No query, no results
    if (!query || !user) { 
        return json([]); 
    }

    // Search for users
    // Filter results, only allow similar usernames if they are user friends
    let results = await Promise.all((
        await find_matching<{ 
            username: string, 
            avatar: string, 
            friends: string[],
            requests: string[]
        }>
        (query, ["username", "avatar", "friends", "requests"])
    )
    .filter(result => {
        // Skip if the result is the user itself
        if (result.username === user.username) return false;

        // If the query matches or if the user is friends
        return result.username == query || similars(query, user.friends).includes(result.username);
    })
    .map(async result => {
        let user_rejected: string[] = await get_from(result.username, "rejected_requests") || [];
        let other_requests: string[] = await get_from(result.username, "pending_requests") || [];
        let other_rejected: string[] = await get_from(result.username, "rejected_requests") || [];
        let friendship: FriendshipStatusType = FriendshipStatusType.NONE;

        // If the user is friends
        if (user.friends.includes(result.username)) {
            friendship = FriendshipStatusType.FRIENDS;
        }

        // If user has sent a friend request
        if (other_requests.includes(user.username)) {
            friendship = FriendshipStatusType.REQUESTED;
        }

        // If user request has been rejected
        if (other_rejected.includes(user.username)) {
            friendship = FriendshipStatusType.WAS_REJECTED;
        }
        // If the user rejected the request
        if (user_rejected.includes(result.username)) {
            friendship = FriendshipStatusType.REJECTED;
        }

        return {
            username: result.username,
            avatar: result.avatar,
            friendship
        };
    }));

    return json(results);
};