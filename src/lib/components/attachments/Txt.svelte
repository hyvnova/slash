<script lang="ts">
	import { MAX_FILE_LOAD_TRIES, TEXT_PREVIEW_MAX_BYTES, bytes_to_size } from '$lib';
	import FileLoadStates from '$lib/components/FileLoadStates.svelte';
	import CodeBlock from '$lib/components/CodeBlock.svelte';
	import IconButton from '$lib/components/ui/IconButton.svelte';
	import { scroll_to_bottom } from '$lib/stores/scroll_to_bottom';
	import { FileLoadState, Routes, type AttachmentType } from '$lib/types';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	interface Props {
		attachment: AttachmentType;
	}

	let { attachment }: Props = $props();

	const size = $derived(bytes_to_size(attachment.size));
	const previewBlocked = $derived(attachment.size > TEXT_PREVIEW_MAX_BYTES);
	const fileState = writable<FileLoadState>(FileLoadState.LOADING);
	let content = $state('');
	let tries = 0;

	async function get_file_content() {
		if (previewBlocked) {
			fileState.set(FileLoadState.LOADED);
			return;
		}

		const response = await fetch(`${Routes.FILE}/${attachment.id}`);
		if (response.ok) {
			content = (await response.text()) || 'empty file';
			fileState.set(FileLoadState.LOADED);
		} else if (response.status === 404 || response.status === 410) {
			fileState.set(FileLoadState.DELETED);
		} else if (tries < MAX_FILE_LOAD_TRIES) {
			tries++;
			setTimeout(get_file_content, 1000 * tries);
		} else {
			fileState.set(FileLoadState.FAILED);
		}

		$scroll_to_bottom();
	}

	onMount(get_file_content);
</script>

<article class="text-attachment">
	<header>
		<div class="file-meta">
			<strong>{attachment.name}</strong>
			<span>{size} / {attachment.type}</span>
		</div>
		<div class="file-actions">
			<IconButton
				icon="copy"
				label="copy file text"
				onclick={() => navigator.clipboard.writeText(content)}
			/>
			<IconButton icon="download" label="download file" href={`${Routes.FILE}/${attachment.id}`} />
		</div>
	</header>

	<FileLoadStates loadState={fileState}>
		{#if previewBlocked}
			<div class="blocked">
				<p>too large for inline preview.</p>
				<a href={`${Routes.FILE}/${attachment.id}`} target="_blank" rel="noreferrer"
					>download file</a
				>
			</div>
		{:else}
			<CodeBlock language={attachment.type.split('/')[1]} code={content} />
		{/if}
	</FileLoadStates>
</article>

<style>
	.text-attachment {
		width: min(100%, 42rem);
		overflow: hidden;
		border: 1px solid var(--line);
		border-radius: var(--radius-md);
		background: rgba(8, 9, 11, 0.58);
	}

	header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;
		padding: 0.65rem;
		border-bottom: 1px solid var(--line);
	}

	.file-meta {
		display: grid;
		gap: 0.2rem;
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
		color: var(--muted);
		font-family: var(--font-mono);
		font-size: 0.68rem;
	}

	.file-actions {
		display: flex;
		flex: 0 0 auto;
		gap: 0.4rem;
	}

	.blocked {
		display: grid;
		justify-items: center;
		gap: 0.45rem;
		padding: 1rem;
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

	@media (max-width: 34rem) {
		header {
			align-items: flex-start;
		}
	}
</style>
