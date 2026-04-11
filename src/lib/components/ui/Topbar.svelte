<script lang="ts">
	import type { Snippet } from 'svelte';
	import IconButton from './IconButton.svelte';

	interface Props {
		title?: string;
		label?: string;
		subtitle?: string;
		backHref?: string;
		backLabel?: string;
		class?: string;
		left?: Snippet;
		right?: Snippet;
	}

	let {
		title,
		label,
		subtitle,
		backHref,
		backLabel = 'go back',
		class: className = '',
		left,
		right
	}: Props = $props();
</script>

<header class={`ui-topbar ${className}`}>
	<div class="topbar-left">
		{#if left}
			{@render left()}
		{:else if backHref}
			<IconButton icon="arrow-left" label={backLabel} href={backHref} />
		{/if}
	</div>

	<div class="topbar-center">
		{#if label}<p class="ui-label">{label}</p>{/if}
		{#if title}<h1>{title}</h1>{/if}
		{#if subtitle}<p class="subtitle">{subtitle}</p>{/if}
	</div>

	<div class="topbar-right">
		{@render right?.()}
	</div>
</header>

<style>
	.ui-topbar {
		display: grid;
		grid-template-columns: minmax(2.75rem, 1fr) minmax(0, auto) minmax(2.75rem, 1fr);
		align-items: center;
		gap: 0.75rem;
		width: 100%;
		min-height: 4.25rem;
		padding: 0.55rem 0;
		border-bottom: 1px solid var(--line);
	}

	.topbar-left,
	.topbar-right {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		min-width: 0;
	}

	.topbar-right {
		justify-content: flex-end;
	}

	.topbar-center {
		display: grid;
		justify-items: center;
		gap: 0.25rem;
		min-width: 0;
		text-align: center;
	}

	h1 {
		margin: 0;
		max-width: min(52vw, 34rem);
		overflow: hidden;
		color: var(--text);
		font-size: 1.25rem;
		font-weight: 400;
		letter-spacing: 0;
		line-height: 1.05;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.subtitle {
		margin: 0;
		max-width: min(58vw, 34rem);
		overflow: hidden;
		color: var(--muted);
		font-family: var(--font-mono);
		font-size: 0.68rem;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	@media (max-width: 34rem) {
		.ui-topbar {
			grid-template-columns: auto minmax(0, 1fr) auto;
		}

		h1,
		.subtitle {
			max-width: 100%;
		}
	}
</style>
