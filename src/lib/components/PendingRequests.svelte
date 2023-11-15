<script lang="ts">
	import { faCheck, faTimes, faUserPlus } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import { writable, type Writable } from 'svelte/store';
	import { FriendshipStatusType } from '$lib/types';
	import { update_friendship } from '$lib/api_shortcuts';
	import AvatarImage from './AvatarImage.svelte';


	export let requests: Writable<string[]>;
	export let username: string;

	let modal_open = writable(false);
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
					<li
						class="
								flex items-center mb-2 p-2 rounded-md w-full
								"
					>
						<AvatarImage username={requester} />
						<p class="ml-2 text-lg">{requester}</p>

                        <!-- Accept -->
						<button
                            class="ml-auto p-1 mx-2 w-auto border-green-500 rounded-md hover:bg-green-600"
                            on:click={() => {
                                update_friendship(username, requester, FriendshipStatusType.FRIENDS);
                                requests.update(() => $requests.filter((request) => request != requester));
                            }}
                        >
                            <Fa icon={faCheck} class="text-2xl text-white" />
                        </button>
                        
                        <!-- Reject -->
                        <button
                            class="p-1 mx-2 w-auto border-red-500 rounded-md hover:bg-red-600"
                            on:click={() => {
                                update_friendship(username, requester, FriendshipStatusType.REJECTED);
                                requests.update(() => $requests.filter((request) => request != requester));
                            }}
                        >
                            <Fa icon={faTimes} class="text-2xl text-white" />
                        </button>

					</li>
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
</style>
