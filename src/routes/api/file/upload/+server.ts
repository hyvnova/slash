import { json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async () => {
	return json(
		{
			error: 'Legacy multipart uploads are no longer supported. Use the direct client upload flow.'
		},
		{ status: 410 }
	);
};
