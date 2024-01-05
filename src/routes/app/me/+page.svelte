<script lang="ts">
	import { get, writable, type Writable } from 'svelte/store';
	import AvatarImage from '$lib/components/AvatarImage.svelte';
	import type { LayoutServerData } from './$types';
	import SearchModal from '$lib/components/SearchModal.svelte';
	import { ws } from '$lib/websocket';
	import { onMount, tick } from 'svelte';
	import PendingRequests from '$lib/components/PendingRequests.svelte';
	import { faCog } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import BottomBar from '$lib/components/BottomBar.svelte';
	import { Events, Routes, Status } from '$lib/types';
	import FriendListItem from '$lib/components/FriendListItem.svelte';
	import Toast from '$lib/components/Toast.svelte';

	export let data: LayoutServerData;

	let user = data.user;
	let requests = writable(user.pending_requests);
	let searching = writable(false);
	let friends: Writable<string[]> = writable(user.friends);

	let friend_status: Record<string, Writable<Status>> = {};
	for (let friend of user.friends) {
		friend_status[friend] = writable(Status.OFFLINE);
	}

	onMount(async () => {
		await tick();

		// Open search modal on pressing 'p'
		window.onkeydown = (e) => {
			if (e.key === 'p') {
				searching.set(true);
				e.preventDefault();
			}
		};

		// Handling friend requests
		ws.on(Events.NEW_FRIEND_REQUEST, (requester_username) => {
			if (!requester_username) return;
			requests.update((requests) => [requester_username, ...requests]);
		});
		ws.on(Events.CANCEL_FRIEND_REQUEST, (requester_username) => {
			if (!requester_username) return;
			requests.update((requests) => requests.filter((username) => username !== requester_username));
		});

		// Handling friendships: accepted friend requests and unfriending
		ws.on(Events.ACCEPT_FRIEND_REQUEST, (other) => {
			friends.update((contacts) => [other, ...contacts]);
		});
		ws.on(Events.UNFRIEND, (other) => {
			friends.update((contacts) => contacts.filter((contact) => contact !== other));
		});

		// Handling friend status
		ws.on(Events.STATUS, (username: string, status: Status) => {
			friend_status[username].set(status);
		});

		// Connect to websocket
		ws.emit(Events.CONNECT, user.username);

		// Emit online status
		ws.emit(Events.SET_STATUS, Status.ONLINE, $friends);

		// Request friend status
		ws.emit(Events.GET_FRIENDS_STATUS, $friends);
	});
</script>

<div class="container">
	<!-- Navbar -->
	<nav class="mt-2 flex justify-between items-center w-full p-2 border-b border-gray-700">
		{#if $requests.length > 0}
			<PendingRequests username={user.username} {requests} {friends} />
		{/if}

		<SearchModal
			modal_open={searching}
			{user}
			remove_friend={(username) => {
				friends.update((contacts) => contacts.filter((contact) => contact !== username));
			}}
		/>

		<a href={Routes.SETTINGS} class="rotate text-gray-400 hover:text-gray-100" title="Settings">
			<Fa icon={faCog} class="text-2xl" />
		</a>
	</nav>

	<Toast />

	<!-- Friend list -->
	<div
		class="rounded-sm w-full mt-4
		flex flex-col justify-center
		items-start p-2 overflow-y-hidden overflow-x-auto
		"
	>
		{#each Object.entries(friend_status) as [friend, status]}
			<FriendListItem {friend} {status} />
		{/each}

		{#if $friends.length === 0}
			<div class="text-gray-400 text-center w-full">
				<h4 class="text-xl">No friends yet</h4>
				<p class="text-md">Search for people to add them as friends</p>
			</div>
		{/if}
	</div>
</div>

<BottomBar username={data.user.username} verified={data.user.verified} />

<style>
	.rotate {
		animation: rotate 15s linear infinite;
	}
	@keyframes rotate {
		0% {
			transform: rotate(0deg);
		}
		30% {
			transform: rotate(180deg);
		}
		60% {
			transform: rotate(0deg);
		}
	}
</style>
