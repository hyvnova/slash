import { json, type RequestHandler } from '@sveltejs/kit';
import { requireUser } from '$lib/server/auth';
import { get_contacts, mark_chat_read, update_contact_state } from '$lib/server/db/chat';

type ContactAction = 'mute' | 'unmute' | 'pin' | 'unpin' | 'mark_read';

type ExpectedBody = {
	chat_id?: string;
	action?: ContactAction;
	message_id?: string | null;
};

const contactActions = new Set<ContactAction>(['mute', 'unmute', 'pin', 'unpin', 'mark_read']);

export const GET: RequestHandler = async ({ cookies }) => {
	const user = await requireUser(cookies);
	return json({ contacts: await get_contacts(user.username) });
};

export const POST: RequestHandler = async ({ request, cookies }) => {
	const user = await requireUser(cookies);
	const body = (await request.json()) as ExpectedBody;

	if (!body.chat_id || !body.action || !contactActions.has(body.action)) {
		return json({ error: 'Missing contact action' }, { status: 400 });
	}

	if (body.action === 'mark_read') {
		await mark_chat_read(user.username, body.chat_id, body.message_id ?? null);
		return json({ success: true });
	}

	const success = await update_contact_state(user.username, body.chat_id, body.action);
	return json({ success }, { status: success ? 200 : 404 });
};
