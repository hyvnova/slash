import { upload } from '@vercel/blob/client';
import type { AttachmentType, UploadPrepareResponse } from '$lib/types';

async function sha256Hex(file: File) {
	const buffer = await file.arrayBuffer();
	const digest = await crypto.subtle.digest('SHA-256', buffer);
	return Array.from(new Uint8Array(digest))
		.map((byte) => byte.toString(16).padStart(2, '0'))
		.join('');
}

async function prepareUpload(file: File): Promise<UploadPrepareResponse> {
	const sha256 = await sha256Hex(file);
	const response = await fetch('/api/file/prepare', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			name: file.name,
			size: file.size,
			type: file.type || 'application/octet-stream',
			sha256
		})
	});

	if (!response.ok) {
		const payload = (await response.json().catch(() => null)) as { error?: string } | null;
		throw new Error(payload?.error || 'Failed to prepare upload');
	}

	return response.json() as Promise<UploadPrepareResponse>;
}

async function completeUpload(
	pendingId: string,
	blob: { url: string; pathname: string; contentType: string }
) {
	const response = await fetch('/api/file/complete', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			pendingId,
			blob
		})
	});

	if (!response.ok) {
		const payload = (await response.json().catch(() => null)) as { error?: string } | null;
		throw new Error(payload?.error || 'Failed to finalize upload');
	}

	const payload = (await response.json()) as { attachment: AttachmentType };
	return payload.attachment;
}

export async function uploadAttachmentFiles(
	files: Iterable<File>,
	onUploadProgress?: (file: File, percentage: number) => void
) {
	const attachments: AttachmentType[] = [];

	for (const file of files) {
		const prepared = await prepareUpload(file);
		if (prepared.mode === 'existing') {
			attachments.push(prepared.attachment);
			continue;
		}

		const blob = await upload(prepared.pathname, file, {
			access: 'public',
			contentType: file.type || 'application/octet-stream',
			handleUploadUrl: '/api/file/client-upload',
			clientPayload: JSON.stringify({ pendingId: prepared.pendingId }),
			multipart: file.size > 5 * 1024 * 1024,
			onUploadProgress(progress) {
				onUploadProgress?.(file, progress.percentage);
			}
		}).catch((error) => {
			if (error instanceof Error && error.message.includes('client token')) {
				throw new Error(
					'Failed to retrieve the Vercel Blob upload token. Check BLOB_READ_WRITE_TOKEN in your local .env and restart the dev server.'
				);
			}

			throw error;
		});

		const attachment = await completeUpload(prepared.pendingId, {
			url: blob.url,
			pathname: blob.pathname,
			contentType: blob.contentType
		});

		attachments.push(attachment);
	}

	return attachments;
}
