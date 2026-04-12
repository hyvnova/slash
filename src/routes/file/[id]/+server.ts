import type { RequestHandler } from '@sveltejs/kit';
import { resolve_file } from '$lib/server/db/files';

function disposition(name: string, inline: boolean) {
	const clean = name.replaceAll('"', '');
	return `${inline ? 'inline' : 'attachment'}; filename="${clean}"`;
}

async function resolveResponse(id: string, method: 'GET' | 'HEAD', inline = false) {
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
				'Content-Disposition': disposition(resolution.file.name, inline)
			}
		});
	}

	return new Response(Uint8Array.from(resolution.file.data), {
		status: 200,
		headers: {
			'Content-Type': resolution.file.type,
			'Content-Disposition': disposition(resolution.file.name, inline)
		}
	});
}

export const GET: RequestHandler = async ({ params, url }) => {
	const id = params.id;
	if (!id) {
		return new Response(null, { status: 404 });
	}

	return resolveResponse(id, 'GET', url.searchParams.get('inline') === '1');
};

export const HEAD: RequestHandler = async ({ params, url }) => {
	const id = params.id;
	if (!id) {
		return new Response(null, { status: 404 });
	}

	return resolveResponse(id, 'HEAD', url.searchParams.get('inline') === '1');
};
