<script lang="ts">
	import { writable, type Writable } from 'svelte/store';
	import AvatarImage from '$lib/components/AvatarImage.svelte';
	import type { LayoutServerData } from './$types';
	import SearchModal from '$lib/components/SearchModal.svelte';
	import { ws } from '$lib/websocket';
	import { onMount } from 'svelte';
	import PendingRequests from '$lib/components/PendingRequests.svelte';
	import { faCog } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import BottomBar from '$lib/components/BottomBar.svelte';

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

	function get_chat_id(other: string) {
		return user.chats.find((chat) => chat.members.includes(other))?.id;
	}
</script>

<div class="container">
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

		<a href="/me/settings" class="rotate text-gray-400 hover:text-gray-100" title="Settings">
			<Fa icon={faCog} class="text-2xl" />
		</a>
	</nav>

	<div
		class="rounded-sm w-full mt-4 flex flex-col justify-center items-start p-2 overflow-y-hidden overflow-x-auto"
	>
		{#each $friends as friend}
			<!-- svelte-ignore a11y-missing-attribute -->
			<a class="w-full" href="/chat/{get_chat_id(friend)}">
				<div
					class="flex items-center justify-start rounded-md p-2 my-1
					transition-colors
					hover:bg-gray-700 cursor-pointer w-full
				"
				>
					<AvatarImage username={friend} />
					<h4 class="ml-4 font-normal text-gray-200">{friend}</h4>
				</div>
			</a>
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
