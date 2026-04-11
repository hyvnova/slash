import type { RequestHandler } from '@sveltejs/kit';
import { resolve_file } from '$lib/server/db/files';

async function resolveResponse(id: string, method: 'GET' | 'HEAD') {
	const resolution = await resolve_file(id);

	if (resolution.kind === 'redirect') {
		return Response.redirect(resolution.url, 302);
	}

	if (resolution.kind === 'deleted') {
		return new Response(null, { status: 410, statusText: 'File deleted' });
	}

	if (resolution.kind === 'missing') {
		return new Response(null, { status: 404, statusText: 'File not found' });
	}

	if (method === 'HEAD') {
		return new Response(null, {
			status: 200,
			headers: {
				'Content-Type': resolution.file.type,
				'Content-Length': String(resolution.file.size),
				'Content-Disposition': `attachment; filename=${resolution.file.name}`
			}
		});
	}

	return new Response(Uint8Array.from(resolution.file.data), {
		status: 200,
		headers: {
			'Content-Type': resolution.file.type,
			'Content-Disposition': `attachment; filename=${resolution.file.name}`
		}
	});
}

export const GET: RequestHandler = async ({ params }) => {
	const id = params.id;
	if (!id) {
		return new Response(null, { status: 404 });
	}

	return resolveResponse(id, 'GET');
};

export const HEAD: RequestHandler = async ({ params }) => {
	const id = params.id;
	if (!id) {
		return new Response(null, { status: 404 });
	}

	return resolveResponse(id, 'HEAD');
};
