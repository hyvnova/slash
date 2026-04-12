<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		as?: 'div' | 'section' | 'article' | 'aside' | 'form';
		variant?: 'base' | 'card' | 'panel';
		inset?: boolean;
		class?: string;
		children?: Snippet;
	}

	let {
		as = 'div',
		variant = 'base',
		inset = false,
		class: className = '',
		children
	}: Props = $props();
</script>

<svelte:element
	this={as}
	class={`ui-surface ui-surface-${variant} ${inset ? 'has-inset' : ''} ${className}`}
>
	{@render children?.()}
</svelte:element>

<style>
	.ui-surface {
		position: relative;
		overflow: clip;
		max-width: 100%;
		min-width: 0;
		border-radius: var(--radius-md);
		border: 1px solid var(--line);
		isolation: isolate;
	}

	.ui-surface::before {
		content: '';
		position: absolute;
		inset: 0;
		z-index: -1;
		pointer-events: none;
		background:
			linear-gradient(
				180deg,
				rgba(240, 232, 218, calc(0.035 * var(--reg-ornament-opacity) / 0.14)),
				transparent 22%
			),
			linear-gradient(
				90deg,
				rgba(121, 166, 163, calc(0.025 * var(--reg-ornament-opacity) / 0.14)),
				transparent 32%
			);
	}

	.ui-surface-base {
		background:
			linear-gradient(180deg, rgba(240, 232, 218, 0.015), transparent 38%),
			linear-gradient(135deg, rgba(199, 156, 87, 0.05), transparent 48%),
			rgba(11, 13, 16, calc(0.9 * var(--reg-surface-opacity)));
	}

	.ui-surface-card {
		background:
			linear-gradient(135deg, rgba(199, 156, 87, 0.08), transparent 44%),
			rgba(10, 12, 14, calc(0.86 * var(--reg-surface-opacity)));
		box-shadow: var(--shadow-card);
	}

	.ui-surface-panel {
		background:
			linear-gradient(180deg, rgba(121, 166, 163, 0.08), transparent 18%),
			linear-gradient(
				135deg,
				rgba(199, 156, 87, 0.08),
				rgba(10, 12, 14, calc(0.82 * var(--reg-surface-opacity))) 42%
			),
			rgba(9, 11, 13, calc(0.82 * var(--reg-surface-opacity)));
		box-shadow: var(--shadow-veil);
	}

	.has-inset::after {
		content: '';
		position: absolute;
		inset: 0.75rem;
		border: 1px solid rgba(121, 166, 163, 0.14);
		pointer-events: none;
	}
</style>
