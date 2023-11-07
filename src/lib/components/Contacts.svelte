<script lang="ts">
	import Fa from 'svelte-fa';
	import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
	import { writable } from 'svelte/store';
	import SearchModal from './SearchModal.svelte';

	let searching = writable(false);

	export let contacts: {
		username: string;
		avatar: string;
		status: string;
	}[];
</script>


	<SearchModal modal_open={searching} />


<div class="mt-4 flex justify-normal items-center p-2 w-auto overflow-auto">
	<button class="border-none p-1 mx-1 grow-rotate w-auto" on:click={() => searching.set(true)}>
		<Fa icon={faMagnifyingGlass} class="text-2xl text-#888 mr-2 hover:text-white" />
	</button>

	{#each contacts as contact}
		<div
			class="flex items-center px-1 border rounded-md border-lightgray mx-1 select-none transition:border"
		>
			<div class="w-8 rounded-full bg-#F50057 flex justify-center items-center mr-2">
				<img src={contact.avatar} alt="Avatar" class="w-auto rounded-full" />
			</div>
			<div>
				<h4 class="m-0 font-normal text-gray-200">{contact.username}</h4>
				<p class="m-0 text-#888">{contact.status}</p>
			</div>
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
