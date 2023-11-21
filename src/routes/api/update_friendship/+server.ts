import { get_from, set_user } from "$lib/server/db";
import { create_chat } from "$lib/server/db/chat";
import { FriendshipStatusType } from "$lib/types";
import type { RequestHandler } from "@sveltejs/kit";


type ExpectedParams = {
    user: string,   // user making the change of friendship status
    other: string, // Other user
    status: FriendshipStatusType
}

export const POST: RequestHandler = async ({ request }) => {
    let data: ExpectedParams = await request.json();

    let { user, other, status } = data;

    // No params, no results
    if (!user || !other || !status) { 
        return new Response(null, { status: 400 });
    }
    
    // When cancelling a request or unfriending
    // @ts-ignore
    if (status === FriendshipStatusType.NONE) {
        let other_requests = await get_from<string[]>(other, "pending_requests") || [];
        let friends = await get_from<string[]>(user, "friends") || [];
        let other_friends = await get_from<string[]>(other, "friends") || [];
        let rejected = await get_from<string[]>(user, "rejected_requests") || [];

        // Cancel the request
        if (other_requests.includes(user)) {
            set_user(other, { pending_requests: other_requests.filter(request => request !== user) });
        }
        // Unfriend
        else {
            if (!rejected.includes(other)) { rejected.push(other); }
            set_user(user, { friends: friends.filter(friend => friend !== other), rejected_requests: rejected});
            set_user(other, { friends: other_friends.filter(friend => friend !== user) });
        }

        return new Response(null, { status: 200 });

    // When sending a request
    } else if (status === FriendshipStatusType.REQUESTED) {
        let requests = await get_from<string[]>(other, "pending_requests") || [];

        if (!requests.includes(user)) {
            set_user(other, { pending_requests: [...requests, user] });
        }

        return new Response(null, { status: 200 });
    }

    // When accepting a request
    else if (status === FriendshipStatusType.FRIENDS) {
        let requests = await get_from<string[]>(user, "pending_requests") || [];
        let friends = await get_from<string[]>(user, "friends") || [];
        let other_friends = await get_from<string[]>(other, "friends") || [];

        // Remove the request from the user's pending requests
        set_user(user, { pending_requests: requests.filter(request => request !== other) });

        // Add the user to the other's friends
        if (!other_friends.includes(user)) {
            set_user(other, { friends: [...other_friends, user] });
        }
        if (!friends.includes(other)) {
            set_user(user, { friends: [...friends, other] });
        }

        // Create a chat between the two users
        await create_chat([user, other]);

        return new Response(null, { status: 200 });
    }
    // When rejecting a request
    else if (status === FriendshipStatusType.REJECTED) {
        let requests = await get_from<string[]>(user, "pending_requests") || [];
        let rejected = await get_from<string[]>(user, "rejected_requests") || [];

        // Remove the request from the user's pending requests
        set_user(user, { pending_requests: requests.filter(request => request !== other) });

        // Add the user to the other's friends
        if (!rejected.includes(other)) {
            set_user(user, { rejected_requests: [...rejected, other] });
        }

        return new Response(null, { status: 200 });
    }


    return new Response(null, { status: 400 });

}
