import { get_from, set_user, update_user } from "$lib/server/db";
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
        let rejected = await get_from<string[]>(user, "rejected_requests") || [];

        // Cancel the request
        if (other_requests.includes(user)) {
            update_user(other, { $pull: { pending_requests: user } });
        }
        // Unfriend
        else {
            if (!rejected.includes(other)) { rejected.push(other); }
            update_user(user, { $pull: { friends: other, rejected_requests: other } });
            update_user(other, { $pull: { friends: user } });
        }

        return new Response(null, { status: 200 });

    // When sending a request
    } else if (status === FriendshipStatusType.REQUESTED) {
        let rejected = await get_from<string[]>(user, "rejected_requests") || [];
        let other_requests = await get_from<string[]>(other, "pending_requests") || [];


        // If user previously rejected other remove it
        if (rejected.includes(other)) {
            update_user(user, {
                $pull: { rejected_requests: other }
            })
        }

        if (!other_requests.includes(user)) {
            update_user(other, {
                $push: { pending_request: user}
            })
        }

        return new Response(null, { status: 200 });
    }

    // When accepting a request
    else if (status === FriendshipStatusType.FRIENDS) {
        let friends = await get_from<string[]>(user, "friends") || [];
        let other_friends = await get_from<string[]>(other, "friends") || [];

        // Remove the request from the user's pending requests
        update_user(user, { $pull: { pending_requests: other } });

        // Add the user to the other's friends
        if (!other_friends.includes(user)) {
            update_user(other, { $push: { friends: user } });
        }
        if (!friends.includes(other)) {
            update_user(user, { $push: { friends: other } });
        }

        // Create a chat between the two users
        await create_chat([user, other]);

        return new Response(null, { status: 200 });
    }

    // When rejecting a request
    else if (status === FriendshipStatusType.REJECTED) {
        let rejected = await get_from<string[]>(user, "rejected_requests") || [];

        // Remove the request from the user's pending requests
        update_user(user, { $pull: { pending_requests: other } });

        // Add the user to the other's friends
        if (!rejected.includes(other)) {
            update_user(user, { $push: { rejected_requests: other } });
        }

        return new Response(null, { status: 200 });
    }


    return new Response(null, { status: 400 });

}
