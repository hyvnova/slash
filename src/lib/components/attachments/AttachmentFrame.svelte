<script lang="ts">
	import { bytes_to_size } from '$lib';
	import type { AttachmentType } from '$lib/types';
	import Icon, { type IconName } from '$lib/components/ui/Icon.svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		attachment: AttachmentType;
		label: string;
		icon?: IconName;
		detail?: string;
		class?: string;
		children?: Snippet;
		actions?: Snippet;
	}

	let {
		attachment,
		label,
		icon = 'file',
		detail,
		class: className = '',
		children,
		actions
	}: Props = $props();

	const meta = $derived(detail ?? `${bytes_to_size(attachment.size)} / ${attachment.type}`);
</script>

<article class={`attachment-frame ${className}`}>
	<header>
		<div class="attachment-mark" aria-hidden="true">
			<Icon name={icon} size={18} />
		</div>
		<div class="attachment-meta">
			<strong title={attachment.name}>{attachment.name}</strong>
			<span>{label} / {meta}</span>
		</div>
		{#if actions}
			<div class="attachment-actions">
				{@render actions()}
			</div>
		{/if}
	</header>
	<div class="attachment-body">
		{@render children?.()}
	</div>
</article>

<style>
	.attachment-frame {
		width: min(100%, 42rem);
		overflow: hidden;
		border: 1px solid var(--line);
		border-radius: var(--radius-md);
		background:
			linear-gradient(180deg, rgba(240, 232, 218, 0.025), transparent 42%), rgba(8, 9, 11, 0.62);
	}

	header {
		display: grid;
		grid-template-columns: auto minmax(0, 1fr) auto;
		align-items: center;
		gap: 0.65rem;
		padding: 0.62rem;
		border-bottom: 1px solid var(--line);
	}

	.attachment-mark {
		display: grid;
		place-items: center;
		width: 2rem;
		height: 2rem;
		border: 1px solid var(--line);
		border-radius: var(--radius-sm);
		color: var(--accent);
		background: rgba(199, 156, 87, 0.08);
	}

	.attachment-meta {
		display: grid;
		gap: 0.18rem;
		min-width: 0;
	}

	strong {
		overflow: hidden;
		color: var(--text);
		font-weight: 400;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	span {
		overflow: hidden;
		color: var(--muted);
		font-family: var(--font-mono);
		font-size: 0.66rem;
		letter-spacing: 0.08em;
		text-overflow: ellipsis;
		text-transform: uppercase;
		white-space: nowrap;
	}

	.attachment-actions {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
	}

	.attachment-body {
		min-width: 0;
	}

	@media (max-width: 30rem) {
		header {
			grid-template-columns: auto minmax(0, 1fr);
		}

		.attachment-actions {
			grid-column: 1 / -1;
			justify-content: flex-end;
		}
	}
</style>
