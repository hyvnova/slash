<script lang="ts">
	import { onMount } from 'svelte';
	import { writable, type Writable } from 'svelte/store';
	import BottomBar from '$lib/components/BottomBar.svelte';
	import EmptyState from '$lib/components/ui/EmptyState.svelte';
	import FriendListItem from '$lib/components/FriendListItem.svelte';
	import IconButton from '$lib/components/ui/IconButton.svelte';
	import Panel from '$lib/components/ui/Panel.svelte';
	import PendingRequests from '$lib/components/PendingRequests.svelte';
	import SearchModal from '$lib/components/SearchModal.svelte';
	import Toast from '$lib/components/Toast.svelte';
	import Topbar from '$lib/components/ui/Topbar.svelte';
	import {
		Events,
		FriendshipStatusType,
		Routes,
		Status,
		type ContactListItem,
		type ContactMessagePayload
	} from '$lib/types';
	import { get_contacts, update_contact_state, update_friendship } from '$lib/api_shortcuts';
	import { ws } from '$lib/websocket';
	import type { LayoutServerData } from './$types';

	interface Props {
		data: LayoutServerData;
	}

	let { data }: Props = $props();
	// Roster stores are seeded once, then websocket events own the updates.
	// svelte-ignore state_referenced_locally
	const user = data.user;
	let requests = writable(user.pending_requests);
	let searching = writable(false);
	let friends: Writable<string[]> = writable(user.friends);
	let contacts = $state<ContactListItem[]>(
		user.chats
			.map((chat) => ({
				...chat,
				friend: chat.members.find((member) => member !== user.username) ?? ''
			}))
			.filter((contact) => contact.friend && user.friends.includes(contact.friend))
	);
	let blinking: Record<string, boolean> = $state({});
	let friend_status: Record<string, Writable<Status>> = {};
	let menu = $state<{ friend: string; x: number; y: number } | null>(null);

	for (const friend of user.friends) {
		friend_status[friend] = writable(Status.OFFLINE);
	}

	function ensure_status(friend: string) {
		if (!friend_status[friend]) friend_status[friend] = writable(Status.OFFLINE);
		return friend_status[friend];
	}

	function sortContacts(next = contacts) {
		contacts = [...next].sort((a, b) => {
			if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
			if (a.pinned && b.pinned) {
				return Date.parse(b.pinnedAt ?? '') - Date.parse(a.pinnedAt ?? '');
			}

			const activity = Date.parse(b.lastActivityAt ?? '') - Date.parse(a.lastActivityAt ?? '');
			return activity || a.friend.localeCompare(b.friend);
		});
		friends.set(contacts.map((contact) => contact.friend));
	}

	async function refreshContacts() {
		const next = await get_contacts();
		contacts = next.filter(
			(contact) => user.friends.includes(contact.friend) || contact.members.length
		);
		sortContacts();
		for (const contact of contacts) ensure_status(contact.friend);
	}

	function updateContact(friend: string, updater: (contact: ContactListItem) => ContactListItem) {
		contacts = contacts.map((contact) => (contact.friend === friend ? updater(contact) : contact));
		sortContacts();
	}

	function selectedContact() {
		return menu ? contacts.find((contact) => contact.friend === menu?.friend) : null;
	}

	function openMenu(friend: string, x: number, y: number) {
		menu = {
			friend,
			x: Math.max(8, Math.min(x, window.innerWidth - 178)),
			y: Math.max(8, Math.min(y, window.innerHeight - 198))
		};
	}

	function closeMenu() {
		menu = null;
	}

	async function contactAction(action: 'mute' | 'unmute' | 'pin' | 'unpin' | 'mark_read') {
		const contact = selectedContact();
		if (!contact) return;

		if (action === 'mark_read') {
			updateContact(contact.friend, (entry) => ({ ...entry, unreadCount: 0 }));
		}

		if (action === 'mute' || action === 'unmute') {
			updateContact(contact.friend, (entry) => ({ ...entry, muted: action === 'mute' }));
		}

		if (action === 'pin' || action === 'unpin') {
			updateContact(contact.friend, (entry) => ({
				...entry,
				pinned: action === 'pin',
				pinnedAt: action === 'pin' ? new Date().toISOString() : null
			}));
		}

		await update_contact_state(contact.id, action);
		closeMenu();
	}

	async function unfriendContact() {
		const contact = selectedContact();
		if (!contact) return;

		await update_friendship(user.username, contact.friend, FriendshipStatusType.NONE);
		ws.emit(Events.UNFRIEND, contact.friend);
		contacts = contacts.filter((entry) => entry.friend !== contact.friend);
		friends.update((items) => items.filter((item) => item !== contact.friend));
		closeMenu();
	}

	onMount(() => {
		const keyHandler = (event: KeyboardEvent) => {
			if (event.key === 'p') {
				searching.set(true);
				event.preventDefault();
			}
		};

		const onNewRequest = (requester: string) => {
			if (requester) requests.update((items) => [requester, ...items]);
		};
		const onCancelRequest = (requester: string) => {
			if (requester) requests.update((items) => items.filter((item) => item !== requester));
		};
		const onAccept = (other: string) => {
			ensure_status(other);
			refreshContacts();
			friends.update((items) => [other, ...items.filter((item) => item !== other)]);
		};
		const onUnfriend = (other: string) => {
			contacts = contacts.filter((contact) => contact.friend !== other);
			friends.update((items) => items.filter((contact) => contact !== other));
		};
		const onStatus = (username: string, status: Status) => {
			ensure_status(username).set(status);
		};
		const onContactMessage = (payload: ContactMessagePayload) => {
			if (!payload?.from) return;
			const now = new Date().toISOString();
			updateContact(payload.from, (contact) => ({
				...contact,
				unreadCount: payload.unreadCount ?? contact.unreadCount + 1,
				lastActivityAt: payload.lastActivityAt ?? now
			}));

			const contact = contacts.find((entry) => entry.friend === payload.from);
			if (contact && !contact.muted) {
				blinking[payload.from] = true;
				setTimeout(() => {
					blinking[payload.from] = false;
				}, 950);
			}
		};

		window.addEventListener('keydown', keyHandler);
		window.addEventListener('click', closeMenu);
		ws.on(Events.NEW_FRIEND_REQUEST, onNewRequest);
		ws.on(Events.CANCEL_FRIEND_REQUEST, onCancelRequest);
		ws.on(Events.ACCEPT_FRIEND_REQUEST, onAccept);
		ws.on(Events.UNFRIEND, onUnfriend);
		ws.on(Events.STATUS, onStatus);
		ws.on(Events.CONTACT_MESSAGE, onContactMessage);
		ws.emit(Events.CONNECT, user.username);
		ws.emit(Events.SET_STATUS, Status.ONLINE, $friends);
		ws.emit(Events.GET_FRIENDS_STATUS, $friends);
		sortContacts();

		return () => {
			window.removeEventListener('keydown', keyHandler);
			window.removeEventListener('click', closeMenu);
			ws.off(Events.NEW_FRIEND_REQUEST, onNewRequest);
			ws.off(Events.CANCEL_FRIEND_REQUEST, onCancelRequest);
			ws.off(Events.ACCEPT_FRIEND_REQUEST, onAccept);
			ws.off(Events.UNFRIEND, onUnfriend);
			ws.off(Events.STATUS, onStatus);
			ws.off(Events.CONTACT_MESSAGE, onContactMessage);
		};
	});
</script>

<Toast />

<main class="app-page home-page">
	<Topbar title="contacts" label="slash / home">
		{#snippet right()}
			{#if $requests.length > 0}
				<PendingRequests username={user.username} {requests} {friends} />
			{/if}
			<SearchModal
				modal_open={searching}
				{user}
				remove_friend={(username) => {
					contacts = contacts.filter((contact) => contact.friend !== username);
					friends.update((items) => items.filter((contact) => contact !== username));
				}}
			/>
			<IconButton icon="settings" label="settings" href={Routes.SETTINGS} />
		{/snippet}
	</Topbar>

	<Panel label="live roster" title="people" description="press p to search from the keyboard.">
		<div class="friend-list">
			{#each contacts as contact (contact.id)}
				<FriendListItem
					friend={contact.friend}
					status={ensure_status(contact.friend)}
					unreadCount={contact.unreadCount}
					muted={contact.muted}
					pinned={contact.pinned}
					blinking={blinking[contact.friend]}
					onmenu={openMenu}
				/>
			{/each}

			{#if contacts.length === 0}
				<EmptyState
					title="no contacts yet"
					description="search for a handle to open the first channel."
				/>
			{/if}
		</div>
	</Panel>

	{#if menu && selectedContact()}
		<nav
			class="contact-menu"
			style:left={`${menu.x}px`}
			style:top={`${menu.y}px`}
			aria-label="contact actions"
		>
			<button
				type="button"
				onclick={() => contactAction(selectedContact()?.muted ? 'unmute' : 'mute')}
			>
				{selectedContact()?.muted ? 'unmute' : 'mute'}
			</button>
			<button
				type="button"
				onclick={() => contactAction(selectedContact()?.pinned ? 'unpin' : 'pin')}
			>
				{selectedContact()?.pinned ? 'unpin' : 'pin to top'}
			</button>
			{#if (selectedContact()?.unreadCount ?? 0) > 0}
				<button type="button" onclick={() => contactAction('mark_read')}>mark as read</button>
			{/if}
			<button type="button" class="danger" onclick={unfriendContact}>unfriend</button>
		</nav>
	{/if}
</main>

<BottomBar username={data.user.username} verified={data.user.verified} />

<style>
	.home-page {
		display: grid;
		gap: 1rem;
		padding-bottom: calc(var(--safe-bottom) + 6.5rem);
	}

	.friend-list {
		display: grid;
		gap: 0.35rem;
	}

	.contact-menu {
		position: fixed;
		z-index: var(--z-overlay);
		display: grid;
		gap: 0.2rem;
		width: 10rem;
		padding: 0.35rem;
		border: 1px solid var(--line);
		border-radius: var(--radius-md);
		background: var(--bg-elev);
		box-shadow: var(--shadow-card);
	}

	.contact-menu button {
		min-height: 2.35rem;
		border: 0;
		border-radius: var(--radius-sm);
		background: transparent;
		color: var(--text-soft);
		font-family: var(--font-mono);
		font-size: 0.7rem;
		letter-spacing: 0.08em;
		text-align: left;
		text-transform: uppercase;
		cursor: pointer;
	}

	.contact-menu button:hover {
		background: rgba(121, 166, 163, 0.08);
		color: var(--text);
	}

	.contact-menu .danger:hover {
		background: rgba(182, 106, 72, 0.12);
		color: var(--status-fail);
	}
</style>
