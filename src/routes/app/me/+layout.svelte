<script lang="ts">
	import { onMount } from 'svelte';
	import type { LayoutServerData } from './$types';
	import { ws } from '$lib/websocket';
	import { Events, Status } from '$lib/types';
	import notification from '$lib/stores/notification';
	import Notification from '$lib/components/Notification.svelte';

	export let data: LayoutServerData;

	onMount(() => {	// handshake
		ws.emit(Events.HANDSHAKE, (success: boolean) => {
			if (!success) {
				notification.set({
					type: 'error',
					title: 'Offline - Connection lost',
					message: 'Try reloading the page. Some features may not work.'
				});
			}
		});

		// Online status
		ws.emit(Events.CONNECT, data.user.username);
		ws.emit(Events.SET_STATUS, Status.ONLINE, data.user.friends);
	});
</script>

<svelte:head>
	<title>Me</title>
	<meta name="description" content="Slash user home page" />
	<meta name="keywords" content="Slash user page, slash me" />
</svelte:head>

<main class="w-screen">
	<Notification />
	<slot />
</main>
