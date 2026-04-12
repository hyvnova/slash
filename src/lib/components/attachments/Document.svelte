<script lang="ts">
	import { bytes_to_size } from '$lib';
	import IconButton from '$lib/components/ui/IconButton.svelte';
	import type { AttachmentType } from '$lib/types';
	import AttachmentFrame from './AttachmentFrame.svelte';
	import { attachmentLabel, classifyAttachment, fileUrl } from './attachment-utils';

	interface Props {
		attachment: AttachmentType;
	}

	let { attachment }: Props = $props();
	const kind = $derived(classifyAttachment(attachment));
	const label = $derived(attachmentLabel(kind));
	const icon = $derived(kind === 'archive' ? 'archive' : 'file');
</script>

<AttachmentFrame
	{attachment}
	{label}
	{icon}
	detail={`${bytes_to_size(attachment.size)} / ${attachment.type}`}
>
	{#snippet actions()}
		<IconButton icon="download" label="download file" href={fileUrl(attachment)} />
	{/snippet}

	<a class={`document-card ${kind}`} href={fileUrl(attachment)} target="_blank" rel="noreferrer">
		<span>{label}</span>
		<strong>{kind === 'archive' ? 'sealed archive' : 'download file'}</strong>
		<small>{attachment.type || 'application/octet-stream'}</small>
	</a>
</AttachmentFrame>

<style>
	.document-card {
		display: grid;
		gap: 0.28rem;
		padding: 1rem;
		background:
			linear-gradient(135deg, rgba(121, 166, 163, 0.11), transparent 52%), rgba(5, 6, 7, 0.42);
		color: var(--text-soft);
		text-decoration: none;
	}

	.document-card.archive {
		background:
			linear-gradient(135deg, rgba(199, 156, 87, 0.14), transparent 52%), rgba(5, 6, 7, 0.42);
	}

	.document-card:hover {
		color: var(--text);
	}

	span,
	small {
		color: var(--muted);
		font-family: var(--font-mono);
		font-size: 0.68rem;
		letter-spacing: 0.1em;
		text-transform: uppercase;
	}

	strong {
		color: var(--text);
		font-size: 1.12rem;
		font-weight: 400;
	}
</style>
