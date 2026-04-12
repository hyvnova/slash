import { randomUUID } from 'crypto';
import { db } from './db';
import type { ChatType, ContactListItem, MessageType, UserChatState, UserType } from '$lib/types';

type ContactAction = 'mute' | 'unmute' | 'pin' | 'unpin' | 'mark_read';

function nowIso() {
	return new Date().toISOString();
}

function normalize_chat_state(chat: Partial<UserChatState>): UserChatState {
	return {
		id: chat.id as string,
		members: Array.isArray(chat.members) ? chat.members : [],
		unreadCount: Math.max(0, Number(chat.unreadCount ?? 0)),
		muted: Boolean(chat.muted),
		pinned: Boolean(chat.pinned),
		pinnedAt: chat.pinnedAt ?? null,
		lastReadMessageId: chat.lastReadMessageId ?? null,
		lastActivityAt: chat.lastActivityAt ?? null
	};
}

function summary_for(chat: Pick<ChatType, 'id' | 'members' | 'last_message'>): UserChatState {
	return {
		id: chat.id,
		members: chat.members,
		unreadCount: 0,
		muted: false,
		pinned: false,
		pinnedAt: null,
		lastReadMessageId: null,
		lastActivityAt: chat.last_message?.timestamp ? new Date().toISOString() : null
	};
}

function friend_from_chat(summary: Pick<UserChatState, 'members'>, username: string) {
	return summary.members.find((member) => member !== username) ?? '';
}

function sort_contacts(username: string, contacts: UserChatState[]): ContactListItem[] {
	return contacts
		.map((chat) => ({ ...chat, friend: friend_from_chat(chat, username) }))
		.filter((contact) => contact.friend)
		.sort((a, b) => {
			if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
			if (a.pinned && b.pinned) {
				return Date.parse(b.pinnedAt ?? '') - Date.parse(a.pinnedAt ?? '');
			}

			const activity = Date.parse(b.lastActivityAt ?? '') - Date.parse(a.lastActivityAt ?? '');
			return activity || a.friend.localeCompare(b.friend);
		});
}

/**
 *  Create a chat with the given members
 * @param members
 * @returns The chat object
 */
export async function create_chat(members: string[]) {
	const existing = await exists_chat(members);
	if (existing) {
		const chat = await db.collection<ChatType>('chats').findOne({ id: existing.id });
		if (chat) {
			for (const user of members) {
				const result = await db
					.collection<UserType>('users')
					.updateOne({ username: user, 'chats.id': chat.id }, { $set: { 'chats.$.members': members } });

				if (result.matchedCount === 0) {
					await db.collection<UserType>('users').updateOne(
						{ username: user },
						{
							$push: { chats: summary_for(chat) }
						}
					);
				}
			}
		}
		return chat ?? existing;
	}

	let chat: ChatType = {
		attachments: [],
		last_message: null,
		id: randomUUID(),
		messages: [],
		members
	};

	await db.collection('chats').insertOne(chat);

	// Add the chat to the members
	for (const user of members) {
		await db.collection<UserType>('users').updateOne(
			{ username: user },
			{
				$push: { chats: summary_for(chat) }
			}
		);
	}

	return chat;
}

/**
 * Find an existing chat between the given members
 * @param members
 * @returns The chat id or null if no chat exists
 */
export async function exists_chat(members: string[]) {
	return await db
		.collection<ChatType>('chats')
		.findOne({ members: { $all: members } }, { projection: { id: 1 } });
}

/**
 * Get a chat by id
 * Returns the last 30 messages
 * @param id
 * @returns The chat object
 */
export async function get_chat(id: string) {
	const chats = db.collection<ChatType>('chats');
	return await chats.findOne({ id: id }, { projection: { _id: 0, messages: { $slice: -30 } } });
}

export async function normalize_user_chat_states(username: string): Promise<UserChatState[]> {
	const user = await db.collection<UserType>('users').findOne({ username });
	if (!user) return [];

	const normalized = (user.chats ?? [])
		.filter((chat) => chat?.id && Array.isArray(chat.members))
		.map((chat) => normalize_chat_state(chat));

	if (JSON.stringify(normalized) !== JSON.stringify(user.chats ?? [])) {
		await db.collection<UserType>('users').updateOne({ username }, { $set: { chats: normalized } });
	}

	return normalized;
}

export async function get_contacts(username: string): Promise<ContactListItem[]> {
	return sort_contacts(username, await normalize_user_chat_states(username));
}

export async function mark_chat_read(username: string, chatId: string, messageId: string | null = null) {
	await normalize_user_chat_states(username);
	await db.collection<UserType>('users').updateOne(
		{ username, 'chats.id': chatId },
		{
			$set: {
				'chats.$.unreadCount': 0,
				'chats.$.lastReadMessageId': messageId
			}
		}
	);
}

export async function update_contact_state(username: string, chatId: string, action: ContactAction) {
	await normalize_user_chat_states(username);

	const set: Record<string, unknown> = {};
	if (action === 'mute') set['chats.$.muted'] = true;
	if (action === 'unmute') set['chats.$.muted'] = false;
	if (action === 'pin') {
		set['chats.$.pinned'] = true;
		set['chats.$.pinnedAt'] = nowIso();
	}
	if (action === 'unpin') {
		set['chats.$.pinned'] = false;
		set['chats.$.pinnedAt'] = null;
	}
	if (action === 'mark_read') {
		set['chats.$.unreadCount'] = 0;
		set['chats.$.lastReadMessageId'] = null;
	}

	if (Object.keys(set).length === 0) return false;

	const result = await db
		.collection<UserType>('users')
		.updateOne({ username, 'chats.id': chatId }, { $set: set });

	return result.matchedCount > 0;
}

/**
 * Delete a chat
 * @param chat_id
 */
export async function delete_chat(chat_id: string) {
	await db.collection<ChatType>('chats').deleteOne({ id: chat_id });
}

/**
 * MESSAGES --------------------------------------------------------------------
 */

/**
 * Add a message to a chat
 * @param chat_id
 * @param message
 */
export async function add_message(chat_id: string, message: Partial<MessageType>) {
	const chat = await db.collection<ChatType>('chats').findOne({ id: chat_id });
	if (!chat) {
		throw new Error('Chat room not found');
	}

	const saved: MessageType = {
		id: randomUUID(),
		author: message.author ?? '',
		content: message.content ?? '',
		timestamp: message.timestamp ?? new Date().toLocaleString(undefined, { second: undefined }),
		attachments: message.attachments ?? []
	};

	await db
		.collection<ChatType>('chats')
		.updateOne(
			{ id: chat_id },
			{
				$set: { last_message: saved },
				$push: { messages: { $each: [saved], $slice: -100 } }
			}
		);

	for (const member of chat.members) {
		const isAuthor = member === saved.author;
		const lastActivityAt = nowIso();
		const update = await db.collection<UserType>('users').updateOne(
			{ username: member, 'chats.id': chat_id },
			{
				$set: {
					'chats.$.members': chat.members,
					'chats.$.lastActivityAt': lastActivityAt,
					...(isAuthor
						? {
								'chats.$.unreadCount': 0,
								'chats.$.lastReadMessageId': saved.id
							}
						: {})
				},
				...(isAuthor ? {} : { $inc: { 'chats.$.unreadCount': 1 } })
			}
		);

		if (update.matchedCount === 0) {
			await db.collection<UserType>('users').updateOne(
				{ username: member },
				{
					$push: {
						chats: {
							...summary_for(chat),
							unreadCount: isAuthor ? 0 : 1,
							lastReadMessageId: isAuthor ? saved.id : null,
							lastActivityAt
						}
					}
				}
			);
		}
	}

	return saved;
}

/**
 * Delete a message from a chat
 * @param chat_id
 * @param message_id
 */
export async function delete_message(chat_id: string, message_id: string) {
	await db
		.collection<ChatType>('chats')
		.updateOne({ id: chat_id }, { $pull: { messages: { id: message_id } } });
}

/**
 * Edit a message from a chat
 * @param chat_id
 * @param message_id
 * @param new_message
 */
export async function edit_message(
	chat_id: string,
	message_id: string,
	new_message: Partial<MessageType>
) {
	new_message.id = randomUUID();
	new_message.attachments ||= [];

	await db
		.collection<ChatType>('chats')
		.updateOne(
			{ id: chat_id, 'messages.id': message_id },
			{ $set: { 'messages.$': new_message as MessageType } }
		);
}
