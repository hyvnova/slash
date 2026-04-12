import type { PageServerLoad, Actions } from './$types';
import { get_by, update_user } from '$lib/server/db/user';
import { error, redirect } from '@sveltejs/kit';
import { REGEX_IMAGE_URL, REGEX_USERNAME } from '$lib';
import { get_user_file_metadata } from '$lib/server/db/files';
import { Routes } from '$lib/types';

export const load: PageServerLoad = async ({ cookies, params, url }) => {
	// Get the prfile username from the params (It's a valid username)
	const username = decodeURIComponent(params.username);

	// Whether to show the edit buttons or not
	const show_edit = url.searchParams.get('show_edit') === 'true';

	// Get the token from the cookies
	const token = cookies.get('token');

	// Whether the user it's the "owner" of the profile, used for enabling edit buttons
	let owner = false;

	// If the token is present, check ownership
	if (token) {
		// Get the user data from the token
		const user = await get_by(token);

		if (user) {
			// If the user is found, check if the username matches
			owner = user.username === username;
		}
		// If user is not found, then the token is invalid
		else {
			throw redirect(302, '/');
		}
	}

	// Get user profile data
	const profile = await get_by(username);

	// If the profile is not found,go to error page
	if (!profile) {
		throw error(404, 'Profile not found');
	}

	return {
		owner,
		username,
		avatar: profile.avatar,
		show_edit
	};
};

export const actions = {
	update_username: async ({ request, cookies, url }) => {
		let new_username = (await request.formData()).get('username') as string;

		// Validate username
		if (!new_username || !REGEX_USERNAME.test(new_username)) {
			return { success: false, error: 'Invalid username' };
		}

		// Get the token from the cookies
		const token = cookies.get('token');
		if (!token) {
			throw redirect(302, '/');
		}

		await update_user(token, {
			$set: { username: new_username }
		});

		throw redirect(302, url.toString());
	},

	update_avatar: async ({ request, cookies, url }) => {
		const data = await request.formData();
		const new_avatar = (data.get('avatar') as string | null)?.trim() ?? '';
		const avatar_file_id = (data.get('avatar_file_id') as string | null)?.trim() ?? '';
		const token = cookies.get('token');
		if (!token) {
			throw redirect(302, '/');
		}

		const user = await get_by(token);

		if (!user) {
			throw redirect(302, '/');
		}

		if (avatar_file_id) {
			const file = await get_user_file_metadata(user.username, avatar_file_id);
			if (!file || !file.contentType.startsWith('image/')) {
				return { success: false, error: 'Avatar upload must be an active image file' };
			}

			await update_user(token, {
				$set: { avatar: `${Routes.FILE}/${avatar_file_id}` }
			});

			throw redirect(302, url.toString());
		}

		// Validate avatar
		if (!new_avatar || !REGEX_IMAGE_URL.test(new_avatar)) {
			return {
				success: false,
				error: 'Invalid avatar URL, make sure it ends with an image extension'
			};
		}

		// Make sure the avatar is a valid URL
		try {
			new URL(new_avatar);
		} catch (e) {
			return { success: false, error: "Avatar URL, doesn't seem to be valid" };
		}

		await update_user(token, {
			$set: { avatar: new_avatar }
		});

		throw redirect(302, url.toString());
	}
} as Actions;
