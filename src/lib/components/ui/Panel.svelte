<script lang="ts">
	import type { Snippet } from 'svelte';
	import Surface from './Surface.svelte';

	interface Props {
		title?: string;
		label?: string;
		description?: string;
		inset?: boolean;
		class?: string;
		header?: Snippet;
		actions?: Snippet;
		children?: Snippet;
	}

	let {
		title,
		label,
		description,
		inset = false,
		class: className = '',
		header,
		actions,
		children
	}: Props = $props();
</script>

<Surface variant="panel" {inset} class={`ui-panel ${className}`}>
	{#if header || title || label || description || actions}
		<header class="panel-header">
			<div class="panel-heading">
				{#if header}
					{@render header()}
				{:else}
					{#if label}<p class="ui-label">{label}</p>{/if}
					{#if title}<h2>{title}</h2>{/if}
					{#if description}<p>{description}</p>{/if}
				{/if}
			</div>
			{#if actions}
				<div class="panel-actions">
					{@render actions()}
				</div>
			{/if}
		</header>
	{/if}
	<div class="panel-body">
		{@render children?.()}
	</div>
</Surface>

<style>
	:global(.ui-panel) {
		padding: clamp(1rem, 2vw, 1.4rem);
	}

	.panel-header {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
		gap: 1rem;
		padding-bottom: 1rem;
		margin-bottom: 1rem;
		border-bottom: 1px solid var(--line);
	}

	.panel-heading {
		display: grid;
		gap: 0.45rem;
		min-width: 0;
	}

	h2 {
		margin: 0;
		color: var(--text);
		font-size: 1.55rem;
		font-weight: 400;
		letter-spacing: 0;
		line-height: 1;
		text-wrap: balance;
	}

	p {
		margin: 0;
		color: var(--muted);
		line-height: 1.45;
		text-wrap: pretty;
	}

	.panel-actions {
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-end;
		gap: 0.5rem;
	}

	.panel-body {
		min-width: 0;
	}

	@media (max-width: 42rem) {
		.panel-header {
			display: grid;
		}

		.panel-actions {
			justify-content: flex-start;
		}
	}
</style>
