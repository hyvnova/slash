import { json, type RequestHandler } from '@sveltejs/kit';
import { requireAdmin } from '$lib/server/auth';
import { delete_file_as_admin } from '$lib/server/db/files';

export const DELETE: RequestHandler = async ({ params, cookies }) => {
	await requireAdmin(cookies);
	const fileId = params.id;

	if (!fileId) {
		return json({ error: 'Missing file id' }, { status: 400 });
	}

	try {
		await delete_file_as_admin(fileId);
		return json({ success: true });
	} catch (error) {
		return json(
			{ error: error instanceof Error ? error.message : 'Failed to delete file' },
			{ status: 400 }
		);
	}
};
