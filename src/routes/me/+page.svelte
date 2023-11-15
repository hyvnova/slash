<script lang="ts">

	import Contacts from '$lib/components/Contacts.svelte';
	import PendingRequests from '$lib/components/PendingRequests.svelte';
	import { writable } from 'svelte/store';
	import type { LayoutServerData } from './$types';
	import { ws } from '$lib/websocket';

	export let data: LayoutServerData;

	let requests = writable(data.user.pending_requests);

	// Handling friend requests
	ws.on('new friend request', requester_username => {
		requests.update(requests => [requester_username, ...requests]);
	})
	ws.on('cancel friend request', requester_username => {
		requests.update(requests => requests.filter(username => username !== requester_username));
	})
</script>

<main class="w-screen">
	<nav class="container flex justify-center items-center">
		{#if $requests.length > 0}
			<PendingRequests username={data.user.username} {requests}/>
		{/if}
        <Contacts user={data.user}/>
	</nav>
</main>
