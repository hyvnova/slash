import type {
	AttachmentType,
	ContactListItem,
	FriendshipStatusType,
	MessageType,
	UserSearchResult,
	UserType
} from '$lib/types';
import { writable } from 'svelte/store';
import { uploadAttachmentFiles } from './file_upload';

export async function search_users(query: string, user: UserType): Promise<UserSearchResult[]> {
	let res = await fetch('/api/search', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ query, user })
	});

	// map the friendship status to a writable store so it can be updated in ui
	let json: {
		username: string;
		avatar: string;
		friendship: FriendshipStatusType;
	}[] = await res.json();

	let result = json.map((result) => {
		return {
			...result,
			friendship: writable(result.friendship)
		};
	});

	return result;
}

/**
 * Updates the friendship status between two users
 * @param {string} user User making the change of friendship status
 * @param {string} other Other user
 * @param {FriendshipStatusType} status New friendship status
 */
export async function update_friendship(user: string, other: string, status: FriendshipStatusType) {
	let res = await fetch(`/api/update_friendship`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ user, other, status })
	});
	return res.status === 200;
}

export async function get_contacts(): Promise<ContactListItem[]> {
	const res = await fetch('/api/contact_state');
	if (!res.ok) return [];

	const payload = (await res.json()) as { contacts?: ContactListItem[] };
	return payload.contacts ?? [];
}

export async function update_contact_state(
	chat_id: string,
	action: 'mute' | 'unmute' | 'pin' | 'unpin' | 'mark_read',
	message_id: string | null = null
) {
	const res = await fetch('/api/contact_state', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ chat_id, action, message_id })
	});

	return res.ok;
}

/**
 * Handles message events/actions
 */
export async function handle_message(params: {
	action: 'send' | 'delete' | 'edit';
	chat_id: string;
	message_id?: string;
	message?: Partial<MessageType>;
}) {
	let res = await fetch('/api/message', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(params)
	});

	if (!res.ok) {
		const payload = (await res.json().catch(() => null)) as { error?: string } | null;
		throw new Error(payload?.error || 'Message action failed');
	}

	const payload = (await res.json().catch(() => null)) as { message?: MessageType } | null;
	return payload?.message ?? null;
}

/**
 * Message attachment upload
 */
export async function upload_attachments(files: FormData): Promise<AttachmentType[]> {
	const fileEntries = files.getAll('files').filter((entry): entry is File => entry instanceof File);
	return uploadAttachmentFiles(fileEntries);
}

export async function upload_attachment_files(
	files: Iterable<File>,
	onUploadProgress?: (file: File, percentage: number) => void
): Promise<AttachmentType[]> {
	return uploadAttachmentFiles(files, onUploadProgress);
}
