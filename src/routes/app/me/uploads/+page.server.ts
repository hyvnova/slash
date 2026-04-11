import type { PageServerLoad } from './$types';
import { requireUser } from '$lib/server/auth';
import { get_user_files } from '$lib/server/db/files';

export const load: PageServerLoad = async ({ cookies }) => {
	const user = await requireUser(cookies);

	return {
		user: {
			username: user.username,
			role: user.role || 'user'
		},
		uploads: await get_user_files(user.username)
	};
};
