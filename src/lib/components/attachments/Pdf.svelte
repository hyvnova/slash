<script lang="ts">
	import IconButton from '$lib/components/ui/IconButton.svelte';
	import type { AttachmentType } from '$lib/types';
	import AttachmentFrame from './AttachmentFrame.svelte';
	import AttachmentViewerModal from './AttachmentViewerModal.svelte';
	import { fileUrl } from './attachment-utils';

	interface Props {
		attachment: AttachmentType;
	}

	let { attachment }: Props = $props();
	let open = $state(false);
</script>

<AttachmentFrame {attachment} label="pdf" icon="pdf" detail="open preview on demand">
	{#snippet actions()}
		<IconButton icon="expand" label="open pdf preview" onclick={() => (open = true)} />
		<IconButton icon="download" label="download pdf" href={fileUrl(attachment)} />
	{/snippet}

	<button class="pdf-card" type="button" onclick={() => (open = true)}>
		<span>pdf preview</span>
		<strong>{attachment.name}</strong>
	</button>
</AttachmentFrame>

<AttachmentViewerModal {open} title={attachment.name} onclose={() => (open = false)}>
	{#snippet controls()}
		<IconButton icon="download" label="download pdf" href={fileUrl(attachment)} />
	{/snippet}

	<iframe title={attachment.name} src={fileUrl(attachment, true)}></iframe>
</AttachmentViewerModal>

<style>
	.pdf-card {
		display: grid;
		justify-items: start;
		gap: 0.35rem;
		width: 100%;
		padding: 1.2rem;
		border: 0;
		background:
			linear-gradient(135deg, rgba(182, 106, 72, 0.13), transparent 48%), rgba(5, 6, 7, 0.42);
		color: var(--text);
		text-align: left;
		cursor: pointer;
	}

	.pdf-card span {
		color: var(--accent);
		font-family: var(--font-mono);
		font-size: 0.68rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
	}

	.pdf-card strong {
		max-width: 100%;
		overflow: hidden;
		font-size: 1.2rem;
		font-weight: 400;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	iframe {
		width: 100%;
		height: 100%;
		border: 0;
		background: var(--bg);
	}
</style>
