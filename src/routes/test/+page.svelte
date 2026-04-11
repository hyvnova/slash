<script lang="ts">
	import { onMount } from 'svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Panel from '$lib/components/ui/Panel.svelte';

	let notification_supported = $state(false);

	onMount(() => {
		if (!('Notification' in window)) return;

		if (Notification.permission === 'granted') {
			notification_supported = true;
		} else if (Notification.permission !== 'denied') {
			Notification.requestPermission().then((permission) => {
				notification_supported = permission === 'granted';
			});
		}
	});

	function notify() {
		if (!notification_supported) return;
		new Notification('hi there.');
	}
</script>

<main class="app-page test-page">
	<Panel title="notification test" description="small permission probe. nothing fancy.">
		<Button onclick={notify} disabled={!notification_supported}>notify</Button>
	</Panel>
</main>

<style>
	.test-page {
		min-height: 100dvh;
		display: grid;
		place-items: center;
	}
</style>
