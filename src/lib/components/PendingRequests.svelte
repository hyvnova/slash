<script lang="ts">
	import { faTimes, faUserPlus } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import { writable, type Writable } from 'svelte/store';
	import RequestItem from './RequestItem.svelte';
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

	const remove_request = (username: string) => {
		requests.update(() => $requests.filter((request) => request != username));
	}

	const add_friend = (username: string) => {
		friends.update((friends) => [username, ...friends]);
	}
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
			class="flex flex-col items-center bg-gray-800 m-auto mt-24 p-2 rounded-md border border-gray-700 w-4/5 max-w-screen-xl"
		>
			<h3 class="text-xl text-gray-100 mb-2">Pending requests</h3>

			<ol class="w-full">
				{#each $requests as requester}
					<RequestItem 
						{username}
						{requester}
						{remove_request}
						{add_friend}
					/>
				{/each}
			</ol>
		</div>
	</div>
{:else}
	<button
		class="bright border-none p-1 mx-1 grow-rotate w-auto"
		title="Pending requests"
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
</style>
