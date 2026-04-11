<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
		size?: 'sm' | 'md';
		type?: 'button' | 'submit' | 'reset';
		href?: string;
		target?: string;
		disabled?: boolean;
		loading?: boolean;
		title?: string;
		class?: string;
		onclick?: (event: MouseEvent) => void;
		onmouseenter?: (event: MouseEvent) => void;
		onmouseleave?: (event: MouseEvent) => void;
		children?: Snippet;
	}

	let {
		variant = 'secondary',
		size = 'md',
		type = 'button',
		href,
		target,
		disabled = false,
		loading = false,
		title,
		class: className = '',
		onclick,
		onmouseenter,
		onmouseleave,
		children
	}: Props = $props();

	function handleAnchorClick(event: MouseEvent) {
		if (disabled || loading) {
			event.preventDefault();
			return;
		}
		onclick?.(event);
	}
</script>

{#if href}
	<a
		{href}
		{target}
		{title}
		class={`ui-button ui-button-${variant} ui-button-${size} ${disabled || loading ? 'is-disabled' : ''} ${className}`}
		aria-disabled={disabled || loading}
		tabindex={disabled || loading ? -1 : undefined}
		onclick={handleAnchorClick}
		{onmouseenter}
		{onmouseleave}
	>
		{#if loading}<span class="pending-dot" aria-hidden="true"></span>{/if}
		{@render children?.()}
	</a>
{:else}
	<button
		{type}
		{title}
		class={`ui-button ui-button-${variant} ui-button-${size} ${className}`}
		disabled={disabled || loading}
		{onclick}
		{onmouseenter}
		{onmouseleave}
	>
		{#if loading}<span class="pending-dot" aria-hidden="true"></span>{/if}
		{@render children?.()}
	</button>
{/if}

<style>
	.ui-button {
		position: relative;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		max-width: 100%;
		border: 1px solid var(--line);
		border-radius: var(--radius-md);
		font-family: var(--font-mono);
		font-size: 0.72rem;
		letter-spacing: 0.14em;
		line-height: 1;
		text-transform: uppercase;
		text-decoration: none;
		white-space: nowrap;
		cursor: pointer;
		transition:
			transform var(--transition-smooth),
			border-color var(--transition-fast),
			background var(--transition-fast),
			color var(--transition-fast),
			opacity var(--transition-fast);
	}

	.ui-button-md {
		min-height: var(--control-height);
		padding: 0.78rem 1.05rem;
	}

	.ui-button-sm {
		min-height: 2.25rem;
		padding: 0.55rem 0.75rem;
		font-size: 0.66rem;
	}

	.ui-button-primary {
		background:
			linear-gradient(180deg, rgba(226, 186, 116, 0.18), transparent 68%),
			linear-gradient(135deg, var(--accent), var(--accent-strong));
		color: var(--bg);
		border-color: rgba(226, 186, 116, 0.65);
		box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.14);
	}

	.ui-button-secondary {
		background:
			linear-gradient(180deg, rgba(121, 166, 163, 0.06), transparent 62%), rgba(10, 12, 14, 0.78);
		color: var(--text-soft);
		border-color: var(--line-strong);
	}

	.ui-button-ghost {
		background: transparent;
		color: var(--muted);
		border-color: transparent;
	}

	.ui-button-danger {
		background: rgba(10, 12, 14, 0.78);
		color: var(--text-soft);
		border-color: rgba(182, 106, 72, 0.42);
	}

	.ui-button:hover:not(:disabled):not(.is-disabled) {
		transform: translateY(-1px);
		color: var(--text);
		border-color: var(--accent);
	}

	.ui-button-primary:hover:not(:disabled):not(.is-disabled) {
		color: var(--bg);
	}

	.ui-button-danger:hover:not(:disabled):not(.is-disabled) {
		background: rgba(182, 106, 72, 0.12);
		border-color: var(--status-fail);
	}

	.ui-button:disabled,
	.ui-button.is-disabled {
		opacity: 0.48;
		cursor: not-allowed;
		transform: none;
	}

	.pending-dot {
		width: 0.38rem;
		height: 0.38rem;
		border-radius: 999px;
		background: currentColor;
		animation: pulse-dot 1.4s ease-in-out infinite;
	}
</style>
