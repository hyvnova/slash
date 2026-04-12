<script lang="ts">
	import { MAX_FILE_LOAD_TRIES, TEXT_PREVIEW_MAX_BYTES, bytes_to_size } from '$lib';
	import FileLoadStates from '$lib/components/FileLoadStates.svelte';
	import IconButton from '$lib/components/ui/IconButton.svelte';
	import { scroll_to_bottom } from '$lib/stores/scroll_to_bottom';
	import { FileLoadState, Routes, type AttachmentType } from '$lib/types';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import AttachmentFrame from './AttachmentFrame.svelte';
	import AttachmentViewerModal from './AttachmentViewerModal.svelte';
	import HighlightedCode from './HighlightedCode.svelte';
	import { attachmentLabel, classifyAttachment, fileUrl, languageFor } from './attachment-utils';

	interface Props {
		attachment: AttachmentType;
	}

	let { attachment }: Props = $props();

	const size = $derived(bytes_to_size(attachment.size));
	const kind = $derived(classifyAttachment(attachment));
	const language = $derived(languageFor(attachment));
	const previewBlocked = $derived(attachment.size > TEXT_PREVIEW_MAX_BYTES);
	const fileState = writable<FileLoadState>(FileLoadState.LOADING);
	let content = $state('');
	let open = $state(false);
	let tries = 0;

	async function getFileContent() {
		if (previewBlocked) {
			fileState.set(FileLoadState.LOADED);
			return;
		}

		const response = await fetch(`${Routes.FILE}/${attachment.id}?inline=1`);
		if (response.ok) {
			const raw = (await response.text()) || 'empty file';
			content = kind === 'json' ? formatJson(raw) : raw;
			fileState.set(FileLoadState.LOADED);
		} else if (response.status === 404 || response.status === 410) {
			fileState.set(FileLoadState.DELETED);
		} else if (tries < MAX_FILE_LOAD_TRIES) {
			tries++;
			setTimeout(getFileContent, 1000 * tries);
		} else {
			fileState.set(FileLoadState.FAILED);
		}

		$scroll_to_bottom();
	}

	function formatJson(raw: string) {
		try {
			return JSON.stringify(JSON.parse(raw), null, 2);
		} catch {
			return raw;
		}
	}

	function copyText() {
		navigator.clipboard.writeText(content);
	}

	function summary() {
		if (kind !== 'json' || !content) return `${size} / ${attachment.type}`;
		try {
			const parsed = JSON.parse(content);
			if (Array.isArray(parsed)) return `${parsed.length} items / ${size}`;
			if (parsed && typeof parsed === 'object')
				return `${Object.keys(parsed).length} keys / ${size}`;
		} catch {
			return `unvalidated json / ${size}`;
		}
		return `${size} / ${attachment.type}`;
	}

	onMount(getFileContent);
</script>

<AttachmentFrame
	{attachment}
	label={attachmentLabel(kind)}
	icon={kind === 'text' || kind === 'markdown' ? 'file' : 'code'}
	detail={summary()}
>
	{#snippet actions()}
		<IconButton icon="copy" label="copy file text" disabled={previewBlocked} onclick={copyText} />
		<IconButton
			icon="expand"
			label="expand file preview"
			disabled={previewBlocked}
			onclick={() => (open = true)}
		/>
		<IconButton icon="download" label="download file" href={fileUrl(attachment)} />
	{/snippet}

	<FileLoadStates loadState={fileState}>
		{#if previewBlocked}
			<div class="blocked">
				<p>too large for inline preview.</p>
				<a href={fileUrl(attachment)} target="_blank" rel="noreferrer">download file</a>
			</div>
		{:else}
			<HighlightedCode {language} code={content} />
		{/if}
	</FileLoadStates>
</AttachmentFrame>

<AttachmentViewerModal {open} title={attachment.name} onclose={() => (open = false)}>
	{#snippet controls()}
		<IconButton icon="copy" label="copy file text" onclick={copyText} />
		<IconButton icon="download" label="download file" href={fileUrl(attachment)} />
	{/snippet}

	<div class="expanded-code">
		<HighlightedCode {language} code={content} maxHeight="calc(100dvh - 5.5rem)" />
	</div>
</AttachmentViewerModal>

<style>
	.blocked {
		display: grid;
		justify-items: center;
		gap: 0.45rem;
		padding: 1.2rem;
		color: var(--muted);
	}

	.blocked p {
		margin: 0;
	}

	.blocked a {
		color: var(--accent);
		font-family: var(--font-mono);
		font-size: 0.72rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.expanded-code {
		width: 100%;
		height: 100%;
		overflow: auto;
		background: rgba(5, 6, 7, 0.72);
	}
</style>
