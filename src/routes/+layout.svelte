<script lang="ts">
	import './../app.css';

	import { afterNavigate, beforeNavigate } from '$app/navigation';
	import { is_window_focused } from '$lib/stores/window_focus';

	interface Props {
		data: { pathname: string };
		children?: import('svelte').Snippet;
	}

	let { data, children }: Props = $props();
	let isLoading = $state(false);

	beforeNavigate(({ to }) => {
		isLoading = !!to?.route.id;
	});

	afterNavigate(() => {
		isLoading = false;
	});
</script>

<svelte:window
	onfocus={() => is_window_focused.set(true)}
	onblur={() => is_window_focused.set(false)}
/>

{#if isLoading}
	<div class="route-progress" aria-label="loading"></div>
{/if}

{#key data.pathname}
	<div class="app-frame" data-register="mission-control">
		{@render children?.()}
	</div>
{/key}

<style>
	.route-progress {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 300;
		width: 28vw;
		height: 2px;
		background: linear-gradient(90deg, transparent, var(--accent), var(--signal), transparent);
		animation: route-progress 0.9s linear infinite;
	}
</style>
