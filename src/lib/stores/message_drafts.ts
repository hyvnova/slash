/**
 * Stores message draft for different chats
 * Object { chat_id: message draft }
 */

import { writable } from 'svelte/store';
import { browser } from '$app/environment';

type MessageDraftsType = Record<string, string | null>;

const default_value: MessageDraftsType = {};
const initial_value: MessageDraftsType = browser ? JSON.parse(localStorage.getItem('messsage_drafts') || JSON.stringify(default_value)) : default_value;
const messsage_drafts = writable<MessageDraftsType>(initial_value);

messsage_drafts.subscribe((value) => {
    if (browser) {
        localStorage.setItem('messsage_drafts', JSON.stringify(value));
    }
});

export default messsage_drafts;