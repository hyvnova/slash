<script lang="ts">
	import { onMount } from 'svelte';
	import { ws } from '$lib/websocket';
	import { Events } from '$lib/types';
	import toast from '$lib/stores/toast';
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
	onMount(() => {
		ws.emit(Events.HANDSHAKE, (success: boolean) => {
			if (!success) {
				toast.set({
					type: 'error',
					title: 'signal slipped',
					message: 'try reloading. a few controls may stay quiet.'
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

<main class="me-shell">
	{@render children?.()}
</main>

<style>
	.me-shell {
		min-width: 0;
		min-height: 100dvh;
		background: transparent;
	}
</style>
