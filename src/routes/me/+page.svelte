<script lang="ts">
	import type { PageServerData } from './$types';

	export let data: PageServerData;

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

<section class="container flex flex-row justify-center items-center">
	<button
		class="mt-4 p-2 bg-red-500 rounded-md text-white"
		on:click={() => {
			handleSession('logout');
		}}>Logout</button
	>
	<button
		class="mt-4 p-2 bg-red-500 rounded-md text-white"
		on:click={() => {
			handleSession('delete');
		}}>Delete</button
	>
</section>
