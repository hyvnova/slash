import { json, type RequestHandler } from '@sveltejs/kit';
import { requireUser } from '$lib/server/auth';
import { get_user_files } from '$lib/server/db/files';

export const GET: RequestHandler = async ({ cookies }) => {
	const user = await requireUser(cookies);
	return json(await get_user_files(user.username));
};
