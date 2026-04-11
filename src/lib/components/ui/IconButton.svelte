<script lang="ts">
	import Icon from './Icon.svelte';
	import type { IconName } from './Icon.svelte';

	interface Props {
		icon: IconName;
		label: string;
		href?: string;
		type?: 'button' | 'submit' | 'reset';
		variant?: 'default' | 'danger';
		disabled?: boolean;
		class?: string;
		onclick?: (event: MouseEvent) => void;
	}

	let {
		icon,
		label,
		href,
		type = 'button',
		variant = 'default',
		disabled = false,
		class: className = '',
		onclick
	}: Props = $props();
</script>

{#if href}
	<a
		{href}
		class={`ui-icon-button ${variant === 'danger' ? 'is-danger' : ''} ${className}`}
		aria-label={label}
		title={label}
		{onclick}
	>
		<Icon name={icon} />
	</a>
{:else}
	<button
		{type}
		class={`ui-icon-button ${variant === 'danger' ? 'is-danger' : ''} ${className}`}
		aria-label={label}
		title={label}
		{disabled}
		{onclick}
	>
		<Icon name={icon} />
	</button>
{/if}

<style>
	.ui-icon-button {
		width: 2.75rem;
		height: 2.75rem;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		border: 1px solid var(--line);
		border-radius: var(--radius-md);
		background:
			linear-gradient(180deg, rgba(121, 166, 163, 0.05), transparent 70%), rgba(10, 12, 14, 0.72);
		color: var(--muted);
		cursor: pointer;
		transition:
			transform var(--transition-smooth),
			border-color var(--transition-fast),
			color var(--transition-fast),
			background var(--transition-fast);
	}

	.ui-icon-button:hover:not(:disabled) {
		transform: translateY(-1px);
		color: var(--text);
		border-color: var(--accent);
	}

	.ui-icon-button.is-danger:hover:not(:disabled) {
		color: var(--status-fail);
		border-color: rgba(182, 106, 72, 0.52);
	}

	.ui-icon-button:disabled {
		opacity: 0.45;
		cursor: not-allowed;
		transform: none;
	}
</style>
