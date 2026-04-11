<script lang="ts">
	import type { Snippet } from 'svelte';
	import IconButton from './IconButton.svelte';
	import Surface from './Surface.svelte';

	interface Props {
		open?: boolean;
		title?: string;
		class?: string;
		onclose?: () => void;
		children?: Snippet;
		footer?: Snippet;
	}

	let { open = false, title, class: className = '', onclose, children, footer }: Props = $props();
	let dialog = $state<HTMLDialogElement | null>(null);

	$effect(() => {
		if (!dialog) return;
		if (open && !dialog.open) dialog.showModal();
		if (!open && dialog.open) dialog.close();
	});

	function handleBackdropClick(event: MouseEvent) {
		if (event.target === dialog) onclose?.();
	}
</script>

{#if open}
	<dialog
		bind:this={dialog}
		class={`ui-modal ${className}`}
		onclick={handleBackdropClick}
		oncancel={(event) => {
			event.preventDefault();
			onclose?.();
		}}
	>
		<Surface variant="panel" class="modal-surface">
			<header class="modal-header">
				{#if title}<h2>{title}</h2>{/if}
				<IconButton icon="close" label="close" onclick={onclose} />
			</header>
			<div class="modal-body">
				{@render children?.()}
			</div>
			{#if footer}
				<footer class="modal-footer">
					{@render footer()}
				</footer>
			{/if}
		</Surface>
	</dialog>
{/if}

<style>
	.ui-modal {
		position: fixed;
		inset: 0;
		width: 100%;
		height: 100%;
		max-width: 100%;
		max-height: 100%;
		padding: calc(1rem + var(--safe-top)) calc(1rem + var(--safe-right))
			calc(1rem + var(--safe-bottom)) calc(1rem + var(--safe-left));
		border: 0;
		background: rgba(0, 0, 0, 0.72);
		color: var(--text);
	}

	.ui-modal::backdrop {
		background: transparent;
	}

	:global(.modal-surface) {
		width: min(42rem, 100%);
		max-height: calc(100dvh - 2rem - var(--safe-top) - var(--safe-bottom));
		margin: auto;
		padding: clamp(1rem, 2vw, 1.35rem);
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.modal-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		padding-bottom: 0.8rem;
		border-bottom: 1px solid var(--line);
	}

	h2 {
		margin: 0;
		color: var(--text);
		font-size: 1.35rem;
		font-weight: 400;
		letter-spacing: 0;
	}

	.modal-body {
		min-height: 0;
		overflow: auto;
		color: var(--text-soft);
	}

	.modal-footer {
		display: flex;
		justify-content: flex-end;
		gap: 0.6rem;
		padding-top: 0.8rem;
		border-top: 1px solid var(--line);
	}
</style>
