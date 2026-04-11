import { json, type RequestHandler } from '@sveltejs/kit';
import { requireUser } from '$lib/server/auth';
import { delete_user_file } from '$lib/server/db/files';

export const DELETE: RequestHandler = async ({ params, cookies }) => {
	const user = await requireUser(cookies);
	const fileId = params.id;

	if (!fileId) {
		return json({ error: 'Missing file id' }, { status: 400 });
	}

	try {
		const quota = await delete_user_file(user.username, fileId);
		return json({ success: true, quota });
	} catch (error) {
		return json(
			{ error: error instanceof Error ? error.message : 'Failed to delete file' },
			{ status: 400 }
		);
	}
};
