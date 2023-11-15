<script lang="ts">
	import Fa from 'svelte-fa';
	import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
	import { writable, type Writable } from 'svelte/store';
	import SearchModal from './SearchModal.svelte';
	import type { UserType } from '$lib/types';
	import AvatarImage from './AvatarImage.svelte';
	import { ws } from '$lib/websocket';
	import { onMount } from 'svelte';

	let searching = writable(false);

	export let user: UserType;
	let contacts: Writable<string[]> = writable(user.friends);

	// Open search modal on pressing 'p'

	onMount(() => {
		window.onkeydown = (e) => {
			if (e.key === 'p') {searching.set(true); e.preventDefault();}
		};
		// Handling friendships: accepted friend requests and unfriending
		ws.on('accept friend request', (other) => {
			contacts.update((contacts) => [other, ...contacts]);
		});
		ws.on('unfriend', (other) => {
			contacts.update((contacts) => contacts.filter((contact) => contact !== other));
		});
	});
</script>

<SearchModal modal_open={searching} {user} />

<div class="mt-4 flex justify-normal items-center p-2 w-auto overflow-y-hidden overflow-x-auto">
	<button class="border-none p-1 mx-1 grow-rotate w-auto" on:click={() => searching.set(true)}>
		<Fa icon={faMagnifyingGlass} class="text-2xl text-#888 mr-2 hover:text-white" />
	</button>

	{#each $contacts as contact}
		<div
			class="flex items-center border rounded-md border-lightgray mx-1 p-1 select-none transition:border"
		>
			<AvatarImage username={contact} />
			<h4 class="m-2 font-normal text-gray-200">{contact}</h4>
		</div>
	{/each}
</div>

<style>
	.grow-rotate {
		animation: grow 0.5s ease-in-out, rotate 3s ease-in-out infinite forwards;
		animation-delay: 4s;
	}

	@keyframes grow {
		50% {
			transform: scale(1.2);
		}
	}

	@keyframes rotate {
		50% {
			transform: rotate(65deg);
		}
	}
</style>
