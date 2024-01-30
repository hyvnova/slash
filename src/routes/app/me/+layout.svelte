<script lang="ts">
	import { onMount } from 'svelte';
	import { ws } from '$lib/websocket';
	import { Events } from '$lib/types';
	import toast from '$lib/stores/toast';
	onMount(() => {	// handshake
		ws.emit(Events.HANDSHAKE, (success: boolean) => {
			if (!success) {
				toast.set({
					type: 'error',
					title: 'Offline - Connection lost',
					message: 'Try reloading the page. Some features may not work.'
				});
			}
		});
	});
</script>

<svelte:head>
	<title>Me</title>
	<meta name="description" content="Slash user home page" />
	<meta name="keywords" content="Slash user page, slash me" />
</svelte:head>

<main class="bg-inherit">
	<slot />
</main>
