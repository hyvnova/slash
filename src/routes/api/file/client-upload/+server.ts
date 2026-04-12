import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { json, type RequestHandler } from '@sveltejs/kit';
import { getBlobToken } from '$lib/server/blob-token';
import { MAX_SINGLE_UPLOAD_BYTES } from '$lib/server/file-config';
import { get_pending_upload } from '$lib/server/db/files';
import { requireUser } from '$lib/server/auth';

function parsePayload(raw: string | null): { pendingId: string } {
	if (!raw) {
		throw new Error('Missing upload payload');
	}

	const parsed = JSON.parse(raw) as { pendingId?: string };
	if (!parsed.pendingId) {
		throw new Error('Missing upload reservation id');
	}

	return { pendingId: parsed.pendingId };
}

export const POST: RequestHandler = async ({ request, cookies }) => {
	const body = (await request.json()) as HandleUploadBody;

	try {
		const token = getBlobToken();
		if (!token) {
			return json({ error: 'BLOB_READ_WRITE_TOKEN is not configured' }, { status: 500 });
		}

		const result = await handleUpload({
			token,
			request,
			body,
			onBeforeGenerateToken: async (pathname, clientPayload) => {
				const user = await requireUser(cookies);
				const { pendingId } = parsePayload(clientPayload);
				const pending = await get_pending_upload(pendingId);
				if (!pending || pending.username !== user.username || pending.pathname !== pathname) {
					throw new Error('Upload reservation not found');
				}

				return {
					allowedContentTypes: [pending.contentType],
					maximumSizeInBytes: MAX_SINGLE_UPLOAD_BYTES,
					addRandomSuffix: false,
					allowOverwrite: false,
					tokenPayload: JSON.stringify({ pendingId })
				};
			}
		});

		return json(result);
	} catch (error) {
		return json(
			{ error: error instanceof Error ? error.message : 'Upload token generation failed' },
			{ status: 400 }
		);
	}
};
