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
	import { Events, Routes, Status } from '$lib/types';
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
	let friend_status: Record<string, Writable<Status>> = {};

	for (const friend of user.friends) {
		friend_status[friend] = writable(Status.OFFLINE);
	}

	function ensure_status(friend: string) {
		if (!friend_status[friend]) friend_status[friend] = writable(Status.OFFLINE);
		return friend_status[friend];
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
			friends.update((items) => [other, ...items.filter((item) => item !== other)]);
		};
		const onUnfriend = (other: string) => {
			friends.update((items) => items.filter((contact) => contact !== other));
		};
		const onStatus = (username: string, status: Status) => {
			ensure_status(username).set(status);
		};

		window.addEventListener('keydown', keyHandler);
		ws.on(Events.NEW_FRIEND_REQUEST, onNewRequest);
		ws.on(Events.CANCEL_FRIEND_REQUEST, onCancelRequest);
		ws.on(Events.ACCEPT_FRIEND_REQUEST, onAccept);
		ws.on(Events.UNFRIEND, onUnfriend);
		ws.on(Events.STATUS, onStatus);
		ws.emit(Events.CONNECT, user.username);
		ws.emit(Events.SET_STATUS, Status.ONLINE, $friends);
		ws.emit(Events.GET_FRIENDS_STATUS, $friends);

		return () => {
			window.removeEventListener('keydown', keyHandler);
			ws.off(Events.NEW_FRIEND_REQUEST, onNewRequest);
			ws.off(Events.CANCEL_FRIEND_REQUEST, onCancelRequest);
			ws.off(Events.ACCEPT_FRIEND_REQUEST, onAccept);
			ws.off(Events.UNFRIEND, onUnfriend);
			ws.off(Events.STATUS, onStatus);
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
					friends.update((items) => items.filter((contact) => contact !== username));
				}}
			/>
			<IconButton icon="settings" label="settings" href={Routes.SETTINGS} />
		{/snippet}
	</Topbar>

	<Panel label="live roster" title="people" description="press p to search from the keyboard.">
		<div class="friend-list">
			{#each $friends as friend (friend)}
				<FriendListItem {friend} status={ensure_status(friend)} />
			{/each}

			{#if $friends.length === 0}
				<EmptyState
					title="no contacts yet"
					description="search for a handle to open the first channel."
				/>
			{/if}
		</div>
	</Panel>
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
</style>
