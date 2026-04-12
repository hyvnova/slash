<script lang="ts">
	import IconButton from '$lib/components/ui/IconButton.svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		open?: boolean;
		title: string;
		onclose: () => void;
		children?: Snippet;
		controls?: Snippet;
	}

	let { open = false, title, onclose, children, controls }: Props = $props();
	let dialog = $state<HTMLDialogElement | null>(null);

	$effect(() => {
		if (!dialog) return;
		if (open && !dialog.open) dialog.showModal();
		if (!open && dialog.open) dialog.close();
	});

	function backdrop(event: MouseEvent) {
		if (event.target === dialog) onclose();
	}
</script>

{#if open}
	<dialog
		bind:this={dialog}
		class="viewer-modal"
		onclick={backdrop}
		oncancel={(event) => {
			event.preventDefault();
			onclose();
		}}
	>
		<section class="viewer-shell">
			<header>
				<strong {title}>{title}</strong>
				<div class="viewer-controls">
					{@render controls?.()}
					<IconButton icon="close" label="close preview" onclick={onclose} />
				</div>
			</header>
			<div class="viewer-stage">
				{@render children?.()}
			</div>
		</section>
	</dialog>
{/if}

<style>
	.viewer-modal {
		position: fixed;
		inset: 0;
		width: 100%;
		height: 100%;
		max-width: 100%;
		max-height: 100%;
		padding: var(--safe-top) var(--safe-right) var(--safe-bottom) var(--safe-left);
		border: 0;
		background: rgba(0, 0, 0, 0.86);
		color: var(--text);
	}

	.viewer-modal::backdrop {
		background: transparent;
	}

	.viewer-shell {
		display: grid;
		grid-template-rows: auto minmax(0, 1fr);
		width: 100%;
		height: 100%;
		min-width: 0;
	}

	header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.7rem;
		min-width: 0;
		padding: 0.75rem;
		border-bottom: 1px solid rgba(240, 232, 218, 0.12);
		background: rgba(5, 6, 7, 0.82);
	}

	strong {
		min-width: 0;
		overflow: hidden;
		font-weight: 400;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.viewer-controls {
		display: inline-flex;
		flex: 0 0 auto;
		align-items: center;
		gap: 0.4rem;
	}

	.viewer-stage {
		position: relative;
		min-width: 0;
		min-height: 0;
		overflow: hidden;
	}

	@media (max-width: 34rem) {
		header {
			padding: 0.55rem;
		}

		.viewer-controls {
			gap: 0.28rem;
		}
	}
</style>
