import { json, type RequestHandler } from '@sveltejs/kit';
import { requireUser } from '$lib/server/auth';
import { prepare_file_upload } from '$lib/server/db/files';

type ExpectedBody = {
	name?: string;
	size?: number;
	type?: string;
	sha256?: string;
};

export const POST: RequestHandler = async ({ request, cookies }) => {
	const user = await requireUser(cookies);
	const body = (await request.json()) as ExpectedBody;

	if (!body.name || typeof body.size !== 'number' || !body.type || !body.sha256) {
		return json({ error: 'Missing upload metadata' }, { status: 400 });
	}

	try {
		const result = await prepare_file_upload({
			username: user.username,
			name: body.name,
			size: body.size,
			type: body.type,
			sha256: body.sha256
		});

		return json(result);
	} catch (error) {
		return json(
			{ error: error instanceof Error ? error.message : 'Failed to prepare upload' },
			{ status: 400 }
		);
	}
};
