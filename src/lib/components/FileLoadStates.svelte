<script lang="ts">
	import Icon from '$lib/components/ui/Icon.svelte';
	import { FileLoadState } from '$lib/types';
	import type { Snippet } from 'svelte';
	import type { Writable } from 'svelte/store';

	interface Props {
		loadState: Writable<FileLoadState>;
		children?: Snippet;
	}

	let { loadState, children }: Props = $props();
</script>

{#if $loadState === FileLoadState.LOADING}
	<div class="file-state">
		<Icon name="spinner" class="spin" />
		<span>resolving file</span>
	</div>
{:else if $loadState === FileLoadState.FAILED}
	<div class="file-state warn">
		<Icon name="warn" />
		<span>file signal interrupted</span>
	</div>
{:else if $loadState === FileLoadState.DELETED}
	<div class="file-state fail">
		<Icon name="warn" />
		<span>file no longer exists</span>
	</div>
{:else}
	{@render children?.()}
{/if}

<style>
	.file-state {
		min-height: 3rem;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.55rem;
		padding: 1rem;
		color: var(--muted);
		font-family: var(--font-mono);
		font-size: 0.72rem;
		letter-spacing: 0.08em;
	}

	.warn {
		color: var(--status-warn);
	}

	.fail {
		color: var(--status-fail);
	}

	:global(.spin) {
		animation: spin 0.9s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
</style>
