<script lang="ts">
	import { faMagnifyingGlass, faTimes } from '@fortawesome/free-solid-svg-icons';
	import { onMount } from 'svelte';
	import Fa from 'svelte-fa';
	import { writable, type Writable } from 'svelte/store';
	import { search_users } from '$lib/api_shortcuts';
	import RelationshipButton from './RelationshipButton.svelte';
	import type { UserSearchResult, UserType } from '$lib/types';
	import AvatarImage from './AvatarImage.svelte';

	enum StateType {
		idle,
		searching
	}

	export let modal_open: Writable<boolean>;
	export let user: UserType; // For whom the search is being made

	let query = '';
	let results: Writable<UserSearchResult[]> = writable([]);
	let state: Writable<StateType> = writable(StateType.idle);

	// This function should be replaced with actual search logic
	async function make_search() {
		state.set(StateType.searching);
		results.set(await search_users(query, user));
		state.set(StateType.idle);
	}

	// When "esc" is pressed close the search modal
	onMount(() => {
		window.addEventListener('keydown', (e) => {
			if (e.key === 'Escape') {
				modal_open.set(false);
			}
		});
	});
</script>


<button class="border-none p-1 mx-1 grow-rotate w-auto" on:click={() => modal_open.set(true)}
	title="Search for users"
>
	<Fa icon={faMagnifyingGlass} class="text-2xl text-#888 mr-2 hover:text-white" />
</button>

{#if $modal_open}
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div class="fixed inset-0 z-10 overflow-auto bg-black bg-opacity-40">
		<div class="absolute top-3 left-1/2 transform -translate-x-1/2 mt-2">
			<button
				class="border-white text-white rounded-full p-2 hover:bg-slate-600"
				on:click={() => modal_open.set(false)}
			>
				<Fa icon={faTimes} />
			</button>
		</div>

		<div class="bg-gray-800 m-auto mt-24 p-5 rounded-md border border-gray-700 w-4/5">
			<div class="mb-5">
				<!-- svelte-ignore a11y-autofocus -->
				<input
					autofocus
					type="text"
					bind:value={query}
					placeholder="Search for some user"
					on:input={make_search}
					on:change={make_search}
					class="
				w-full p-2 border-white outline-none rounded-md max-h-max
				{$state === StateType.searching ? 'cursor-wait' : ''}
				"
				/>
			</div>
			<div class="container flex flex-col">
				<ol>
					<!-- If there are no resuls -->
					{#if !$results}
						<p class="text-gray-400">Nothing here...</p>
					{:else}
						{#each $results as result (result)}
						<button
							title="Search result: {result.username}"
							class="w-full border-none bg-none p-1"
						>
							<li
								class="
								flex items-center mb-2 p-2 rounded-md w-full
								"
							>
								<AvatarImage username={result.username}/>
								<p class="ml-2">{result.username}</p>

               					<RelationshipButton username={user.username} friendship={result.friendship} other_user={result.username} />
							</li>
						</button>
						{/each}
					{/if}
				</ol>
			</div>
		</div>
	</div>
{/if}



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
