<script lang="ts">
	import type { HTMLTextareaAttributes } from 'svelte/elements';

	interface Props {
		id?: string;
		name?: string;
		value?: string;
		label?: string;
		placeholder?: string;
		rows?: number;
		autocomplete?: HTMLTextareaAttributes['autocomplete'];
		required?: boolean;
		class?: string;
		oninput?: (event: Event) => void;
		onkeydown?: (event: KeyboardEvent) => void;
	}

	let {
		id = `textarea-${Math.random().toString(36).slice(2)}`,
		name,
		value = $bindable(''),
		label,
		placeholder,
		rows = 3,
		autocomplete = 'off',
		required = false,
		class: className = '',
		oninput,
		onkeydown
	}: Props = $props();
</script>

<label class={`ui-textarea-field ${className}`} for={id}>
	{#if label}<span>{label}</span>{/if}
	<textarea
		{id}
		{name}
		bind:value
		{placeholder}
		{rows}
		{autocomplete}
		{required}
		{oninput}
		{onkeydown}
	></textarea>
</label>

<style>
	.ui-textarea-field {
		display: grid;
		gap: 0.5rem;
		width: 100%;
		min-width: 0;
	}

	span {
		font-family: var(--font-mono);
		font-size: 0.68rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--muted-strong);
	}

	textarea {
		width: 100%;
		min-height: var(--control-height);
		border: 1px solid var(--line);
		border-radius: var(--radius-md);
		background:
			linear-gradient(180deg, rgba(240, 232, 218, 0.018), transparent 46%),
			linear-gradient(135deg, rgba(199, 156, 87, 0.045), transparent 44%), var(--bg-elev);
		color: var(--text);
		font-family: var(--font-mono);
		font-size: 0.88rem;
		line-height: 1.45;
		padding: 0.75rem 0.9rem;
		resize: vertical;
		outline: none;
		transition: border-color var(--transition-fast);
	}

	textarea::placeholder {
		color: var(--muted);
	}

	textarea:hover,
	textarea:focus {
		border-color: var(--line-strong);
	}
</style>
