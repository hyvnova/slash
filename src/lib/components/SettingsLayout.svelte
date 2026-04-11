<script lang="ts">
	import Topbar from '$lib/components/ui/Topbar.svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		title?: string;
		description?: string;
		backHref?: string;
		backLabel?: string;
		children?: Snippet;
	}

	let {
		title = 'settings',
		description = 'small switches. no theater.',
		backHref,
		backLabel = 'go back',
		children
	}: Props = $props();
</script>

<main class="app-page settings-page">
	{#if backHref}
		<Topbar {backHref} {backLabel} {title} label="operator" />
	{/if}

	<header class="settings-head">
		<p class="ui-label">config</p>
		<h1>{title}</h1>
		<p>{description}</p>
	</header>

	<div class="settings-stack">
		{@render children?.()}
	</div>
</main>

<style>
	.settings-page {
		display: grid;
		gap: clamp(1rem, 3vw, 1.6rem);
		max-width: 54rem;
	}

	.settings-head {
		display: grid;
		gap: 0.45rem;
		padding-top: 0.5rem;
	}

	h1 {
		margin: 0;
		color: var(--text);
		font-size: 2.6rem;
		font-weight: 400;
		letter-spacing: 0;
		line-height: 0.96;
	}

	p {
		max-width: 34rem;
		margin: 0;
		color: var(--muted);
		line-height: 1.55;
	}

	.settings-stack {
		display: grid;
		gap: 0.9rem;
		min-width: 0;
	}

	@media (max-width: 34rem) {
		h1 {
			font-size: 1.9rem;
		}
	}
</style>
