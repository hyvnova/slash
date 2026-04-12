import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { normalize_user_chat_states } from '$lib/server/db/chat';
import { get_by } from '$lib/server/db/user';
import type { UserType } from '$lib/types';

export const load: LayoutServerLoad = async ({ cookies }) => {
	// Get the token from the cookies
	const token = cookies.get('token');

	// If the token is not present, return to / (home)
	if (!token) {
		throw redirect(302, '/');
	}

	// Get the user data from the token
	const user = await get_by(token);

	// If the user is not found, return to / (home)
	if (!user) {
		cookies.delete('token', { path: '/', secure: process.env.NODE_ENV === 'production' });
		throw redirect(302, '/');
	}

	// Otherwise, return the user data
	return {
		user: {
			username: user.username,
			avatar: user.avatar,
			friends: user.friends,
			pending_requests: user.pending_requests,
			chats: await normalize_user_chat_states(user.username),
			verified: user.verified,
			role: user.role || 'user'
		} as UserType
	};
};
