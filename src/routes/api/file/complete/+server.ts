import { json, type RequestHandler } from '@sveltejs/kit';
import { requireUser } from '$lib/server/auth';
import {
	finalize_file_upload,
	get_pending_upload,
	mark_pending_upload_uploaded
} from '$lib/server/db/files';

type ExpectedBody = {
	pendingId?: string;
	blob?: {
		url?: string;
		pathname?: string;
		contentType?: string;
	};
};

export const POST: RequestHandler = async ({ request, cookies }) => {
	const user = await requireUser(cookies);
	const body = (await request.json()) as ExpectedBody;

	if (!body.pendingId) {
		return json({ error: 'Missing upload reservation id' }, { status: 400 });
	}

	try {
		const pending = await get_pending_upload(body.pendingId);
		if (!pending || pending.username !== user.username) {
			return json({ error: 'Invalid upload reservation' }, { status: 403 });
		}

		if (body.blob?.url && body.blob.pathname && body.blob.contentType) {
			if (body.blob.pathname !== pending.pathname) {
				return json({ error: 'Uploaded blob does not match reservation' }, { status: 400 });
			}

			await mark_pending_upload_uploaded(body.pendingId, {
				url: body.blob.url,
				pathname: body.blob.pathname,
				contentType: body.blob.contentType
			});
		}

		const attachment = await finalize_file_upload({
			pendingId: body.pendingId,
			blob:
				body.blob?.url && body.blob.pathname && body.blob.contentType
					? {
							url: body.blob.url,
							pathname: body.blob.pathname,
							contentType: body.blob.contentType
						}
					: undefined
		});

		return json({ attachment });
	} catch (error) {
		return json(
			{ error: error instanceof Error ? error.message : 'Failed to finalize upload' },
			{ status: 400 }
		);
	}
};
