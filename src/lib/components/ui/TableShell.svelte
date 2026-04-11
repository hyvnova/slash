<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		label?: string;
		class?: string;
		children?: Snippet;
	}

	let { label, class: className = '', children }: Props = $props();
</script>

<div class={`ui-table-shell ${className}`} aria-label={label}>
	{@render children?.()}
</div>

<style>
	.ui-table-shell {
		width: 100%;
		overflow-x: auto;
		border: 1px solid var(--line);
		border-radius: var(--radius-md);
		background: rgba(8, 9, 11, 0.48);
	}

	.ui-table-shell :global(table) {
		width: 100%;
		min-width: 48rem;
		border-collapse: collapse;
	}

	.ui-table-shell :global(th),
	.ui-table-shell :global(td) {
		padding: 0.75rem 0.85rem;
		border-bottom: 1px solid var(--line);
		text-align: left;
		vertical-align: top;
	}

	.ui-table-shell :global(th) {
		color: var(--muted-strong);
		font-family: var(--font-mono);
		font-size: 0.66rem;
		font-weight: 400;
		letter-spacing: 0.14em;
		text-transform: uppercase;
	}

	.ui-table-shell :global(td) {
		color: var(--text-soft);
	}

	.ui-table-shell :global(tr:hover td) {
		background: rgba(199, 156, 87, 0.035);
	}
</style>
