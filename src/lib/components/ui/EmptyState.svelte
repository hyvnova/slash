<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		description?: string;
		class?: string;
		children?: Snippet;
	}

	let { title, description, class: className = '', children }: Props = $props();
</script>

<div class={`ui-empty ${className}`}>
	<p class="empty-title">{title}</p>
	{#if description}<p class="empty-desc">{description}</p>{/if}
	{#if children}<div class="empty-actions">{@render children()}</div>{/if}
</div>

<style>
	.ui-empty {
		display: grid;
		justify-items: center;
		gap: 0.65rem;
		padding: clamp(1.5rem, 6vw, 3rem);
		text-align: center;
		color: var(--muted);
	}

	.empty-title {
		margin: 0;
		color: var(--text);
		font-size: 1.4rem;
		letter-spacing: 0;
		line-height: 1;
	}

	.empty-desc {
		max-width: 28rem;
		margin: 0;
		line-height: 1.55;
		text-wrap: pretty;
	}

	.empty-actions {
		margin-top: 0.4rem;
	}
</style>
