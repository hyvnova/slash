import type { FriendshipStatusType, UserSearchResult, UserType } from "$lib/types";
import { writable } from "svelte/store";


export async function search_users(query: string, user: UserType): Promise<UserSearchResult[]> {
    let res = await fetch("/api/search", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ query, user })
    })

    // map the friendship status to a writable store so it can be updated in ui
    let json: {
        username: string,
        avatar: string,
        friendship: FriendshipStatusType 
    }[]  = await res.json();

    let result = json.map((result) => {
        return {
            ...result,
            friendship: writable(result.friendship)
        };

    });

    return result;
}


/**
 * Updates the friendship status between two users
 * @param {string} user User making the change of friendship status
 * @param {string} other Other user
 * @param {FriendshipStatusType} status New friendship status
 */
export async function update_friendship(user: string, other: string, status: FriendshipStatusType) {
    let res = await fetch(`/api/update_friendship`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ user, other, status })
    })
    console.log("update rel", user, other, status, res.status );
    return res.status === 200;
}
