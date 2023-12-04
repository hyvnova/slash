<script lang="ts">
	import { Routes } from "$lib/types";
	import { faHome } from "@fortawesome/free-solid-svg-icons";
	import Fa from "svelte-fa";

	function handleSession(action: string) {
		fetch('/api/session', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				action: action
			})
		}).then(() => {
			window.location.href = '/';
		});
	}
</script>

<div class="container">
	<nav class="mt-2 flex justify-between items-center w-full p-2 border-b border-gray-700">
		<a href={Routes.HOME} class="rotate text-gray-400 hover:text-gray-100">
			<Fa icon={faHome} class="text-2xl" />
		</a>
	</nav>

	<section class="mt-4 container flex flex-row justify-around items-center w-full">
		<button
			class="p-2 bg-red-500 rounded-md text-white border-none w-32"
			on:click={() => {
				handleSession('logout');
			}}>Logout</button
		>
		<button
			class="p-2 bg-red-500 rounded-md text-white border-none w-32"
			on:click={() => {
				handleSession('delete');
			}}>Delete</button
		>
	</section>
</div>
