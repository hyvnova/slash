import { get_from, update_user } from '$lib/server/db/user';
import { create_chat } from '$lib/server/db/chat';
import { requireUser } from '$lib/server/auth';
import { FriendshipStatusType } from '$lib/types';
import type { RequestHandler } from '@sveltejs/kit';

type ExpectedParams = {
	other: string; // Other user
	status: FriendshipStatusType;
};

export const POST: RequestHandler = async ({ request, cookies }) => {
	const currentUser = await requireUser(cookies);
	const data: ExpectedParams = await request.json();

	let { other, status } = data;
	const user = currentUser.username;

	// No params, no results
	if (!other || !status || other === user) {
		return new Response(null, { status: 400 });
	}

	// When cancelling a request or unfriending
	// @ts-ignore
	if (status === FriendshipStatusType.NONE) {
		let other_requests = (await get_from<string[]>(other, 'pending_requests')) || [];
		let rejected = (await get_from<string[]>(user, 'rejected_requests')) || [];

		// Cancel the request
		if (other_requests.includes(user)) {
			await update_user(other, { $pull: { pending_requests: user } });
		}
		// Unfriend
		else {
			if (!rejected.includes(other)) {
				rejected.push(other);
			}
			await update_user(user, { $pull: { friends: other, rejected_requests: other } });
			await update_user(other, { $pull: { friends: user } });
		}

		return new Response(null, { status: 200 });

		// When sending a request
	} else if (status === FriendshipStatusType.REQUESTED) {
		let rejected = (await get_from<string[]>(user, 'rejected_requests')) || [];
		let other_requests = (await get_from<string[]>(other, 'pending_requests')) || [];

		// If user previously rejected other remove it
		if (rejected.includes(other)) {
			await update_user(user, {
				$pull: { rejected_requests: other }
			});
		}

		if (!other_requests.includes(user)) {
			await update_user(other, {
				$addToSet: { pending_requests: user }
			});
		}

		return new Response(null, { status: 200 });
	}

	// When accepting a request
	else if (status === FriendshipStatusType.FRIENDS) {
		let friends = (await get_from<string[]>(user, 'friends')) || [];
		let other_friends = (await get_from<string[]>(other, 'friends')) || [];

		// Remove the request from the user's pending requests
		await update_user(user, { $pull: { pending_requests: other } });

		// Add the user to the other's friends
		if (!other_friends.includes(user)) {
			await update_user(other, { $addToSet: { friends: user } });
		}
		if (!friends.includes(other)) {
			await update_user(user, { $addToSet: { friends: other } });
		}

		// Create a chat between the two users
		await create_chat([user, other]);

		return new Response(null, { status: 200 });
	}

	// When rejecting a request
	else if (status === FriendshipStatusType.REJECTED) {
		let rejected = (await get_from<string[]>(user, 'rejected_requests')) || [];

		// Remove the request from the user's pending requests
		await update_user(user, { $pull: { pending_requests: other } });

		// Add the user to the other's friends
		if (!rejected.includes(other)) {
			await update_user(user, { $addToSet: { rejected_requests: other } });
		}

		return new Response(null, { status: 200 });
	}

	return new Response(null, { status: 400 });
};
