<script lang="ts">
	import { faCheck, faTimes, faUserPlus } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import { writable, type Writable } from 'svelte/store';
	import { FriendshipStatusType } from '$lib/types';
	import { update_friendship } from '$lib/api_shortcuts';
	import AvatarImage from './AvatarImage.svelte';
	import { onMount } from 'svelte';

	export let requests: Writable<string[]>;
	export let friends: Writable<string[]>;
	export let username: string;

	let modal_open = writable(false);

	// When "esc" is pressed close the search modal
	onMount(() => {
		window.addEventListener('keydown', (e) => {
			if (e.key === 'Escape') {
				modal_open.set(false);
			}
		});
	});
</script>

{#if $modal_open}
	<div class="fixed inset-0 z-10 overflow-auto bg-black bg-opacity-40">
		<div class="absolute top-3 left-1/2 transform -translate-x-1/2 mt-2">
			<button
				class="border-white text-white rounded-full p-2 hover:bg-slate-600"
				on:click={() => modal_open.set(false)}
			>
				<Fa icon={faTimes} />
			</button>
		</div>

		<div
			class="flex flex-col items-center bg-gray-800 m-auto mt-24 p-2 rounded-md border border-gray-700 w-4/5"
		>
			<ol class="w-full">
				{#each $requests as requester}
				<button
					class="border-none bg-none w-full p-1"
				>
					<li
						class="h-full
								hover-blick
								flex items-center p-2 rounded-md w-full
								 hover:bg-gray-700
								"
					>
						<AvatarImage username={requester} />
						<p class="ml-2 text-lg">{requester}</p>

						<!-- Accept -->
						<button
							class="ml-auto p-1 mx-2 w-auto border-green-500 rounded-md hover:bg-green-600 hover:text-white"
							on:click={() => {
								update_friendship(username, requester, FriendshipStatusType.FRIENDS);
								requests.update(() => $requests.filter((request) => request != requester));
								friends.update((friends) => [requester, ...friends]);
							}}
						>
							<Fa icon={faCheck} class="text-2xl" />
						</button>

						<!-- Reject -->
						<button
							class="p-1 mx-2 w-auto border-red-500 rounded-md hover:bg-red-600 hover:text-white"
							on:click={() => {
								update_friendship(username, requester, FriendshipStatusType.REJECTED);
								requests.update(() => $requests.filter((request) => request != requester));
							}}
						>
							<Fa icon={faTimes} class="text-2xl" />
						</button>
					</li>
					</button>
				{/each}
			</ol>
		</div>
	</div>
{:else}
	<button
		class="bright border-none p-1 mx-1 grow-rotate w-auto"
		on:click={() => modal_open.set(true)}
	>
		<Fa icon={faUserPlus} class="text-2xl" />
	</button>
{/if}

<style>
	.bright {
		animation: bright 3s infinite;
	}

	@keyframes bright {
		0% {
			filter: brightness(0.5);
		}
		50% {
			filter: brightness(1.5);
		}
		100% {
			filter: brightness(0.5);
		}
	}
	.hover-blick:hover {
		animation: soft-blink 3s infinite;
	}
	@keyframes soft-blink {
		0% {
			opacity: 0.7;
		}
		50% {
			opacity: 1;
		}
		100% {
			opacity: 0.75;
		}
	}
</style>
