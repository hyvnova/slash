<script lang="ts">
	import Fa from 'svelte-fa';
	import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
	import { writable, type Writable } from 'svelte/store';
	import SearchModal from '$lib/components/SearchModal.svelte';
	import type { UserType } from '$lib/types';
	import AvatarImage from '$lib/components/AvatarImage.svelte';
	import { ws } from '$lib/websocket';
	import { onMount } from 'svelte';
	import PendingRequests from '$lib/components/PendingRequests.svelte';
	import type { LayoutServerData } from './$types';

	export let data: LayoutServerData;
	let user = data.user;

	let requests = writable(user.pending_requests);
	let searching = writable(false);
	let friends: Writable<string[]> = writable(user.friends);

	onMount(() => {
		// Open search modal on pressing 'p'
		window.onkeydown = (e) => {
			if (e.key === 'p') {
				searching.set(true);
				e.preventDefault();
			}
		};

		// Handling friend requests
		ws.on('new friend request', (requester_username) => {
			requests.update((requests) => [requester_username, ...requests]);
		});
		ws.on('cancel friend request', (requester_username) => {
			requests.update((requests) => requests.filter((username) => username !== requester_username));
		});

		// Handling friendships: accepted friend requests and unfriending
		ws.on('accept friend request', (other) => {
			friends.update((contacts) => [other, ...contacts]);
		});
		ws.on('unfriend', (other) => {
			friends.update((contacts) => contacts.filter((contact) => contact !== other));
		});
	});
</script>

<main class="w-screen">
	<nav class="container flex flex-col justify-center items-center">
		<div class="flex justify-between items-center w-full p-2 border-b border-gray-700">
			{#if $requests.length > 0}
				<PendingRequests username={user.username} {requests} {friends} />
			{/if}

			<SearchModal modal_open={searching} {user} />
		</div>

		<div
			class="border w-full mt-4 flex flex-col justify-center items-start p-2 overflow-y-hidden overflow-x-auto"
		>
			{#each $friends as friend}
				<div class="flex items-center justify-around rounded-md m-1 p-1">
					<AvatarImage username={friend} />
					<h4 class="ml-4 font-normal text-gray-200">{friend}</h4>
				</div>
			{/each}
		</div>
	</nav>
</main>
