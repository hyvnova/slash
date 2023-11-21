<script lang="ts">
	import BottomBar from "$lib/components/BottomBar.svelte";
	import { onMount } from "svelte";
	import type { LayoutServerData } from "./$types";
	import { ws } from "$lib/websocket";

	export let data: LayoutServerData;

	onMount(() => {
		if (!ws.connected) {
   			ws.emit("user connect", data.user.username);
		}
	});
</script>
<svelte:head>
	<title>Me</title>
	<meta name="description" content="Slash user home page">
	<meta name="keywords" content="Slash user page, slash me">
</svelte:head>

<main class="w-screen">
	<slot />
</main>

<BottomBar username={data.user.username} verified={data.user.verified}/>
	