<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	interface Props {
		id?: string;
		name?: string;
		type?: 'text' | 'password' | 'number' | 'url' | 'search';
		value?: string | number;
		label?: string;
		placeholder?: string;
		hint?: string;
		autocomplete?: HTMLInputAttributes['autocomplete'];
		min?: string | number;
		max?: string | number;
		minlength?: number;
		maxlength?: number;
		pattern?: string;
		required?: boolean;
		autofocus?: boolean;
		class?: string;
		oninput?: (event: Event) => void;
		onchange?: (event: Event) => void;
		onkeydown?: (event: KeyboardEvent) => void;
	}

	let {
		id = `field-${Math.random().toString(36).slice(2)}`,
		name,
		type = 'text',
		value = $bindable(''),
		label,
		placeholder,
		hint,
		autocomplete,
		min,
		max,
		minlength,
		maxlength,
		pattern,
		required = false,
		autofocus = false,
		class: className = '',
		oninput,
		onchange,
		onkeydown
	}: Props = $props();
</script>

<label class={`ui-field ${className}`} for={id}>
	{#if label}<span>{label}</span>{/if}
	<!-- svelte-ignore a11y_autofocus -->
	<input
		{id}
		{name}
		{type}
		bind:value
		{placeholder}
		{autocomplete}
		{min}
		{max}
		{minlength}
		{maxlength}
		{pattern}
		{required}
		{autofocus}
		{oninput}
		{onchange}
		{onkeydown}
	/>
	{#if hint}<small>{hint}</small>{/if}
</label>

<style>
	.ui-field {
		display: grid;
		gap: 0.5rem;
		min-width: 0;
		width: 100%;
	}

	span {
		font-family: var(--font-mono);
		font-size: 0.68rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--muted-strong);
	}

	input {
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
		padding: 0.75rem 0.9rem;
		outline: none;
		transition:
			border-color var(--transition-fast),
			background var(--transition-fast);
	}

	input::placeholder {
		color: var(--muted);
	}

	input:hover,
	input:focus {
		border-color: var(--line-strong);
	}

	small {
		color: var(--muted);
		font-family: var(--font-mono);
		font-size: 0.66rem;
		letter-spacing: 0.08em;
	}
</style>
