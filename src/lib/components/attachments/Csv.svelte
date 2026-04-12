<script lang="ts">
	import { MAX_FILE_LOAD_TRIES, TEXT_PREVIEW_MAX_BYTES } from '$lib';
	import FileLoadStates from '$lib/components/FileLoadStates.svelte';
	import IconButton from '$lib/components/ui/IconButton.svelte';
	import { scroll_to_bottom } from '$lib/stores/scroll_to_bottom';
	import { FileLoadState, Routes, type AttachmentType } from '$lib/types';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import AttachmentFrame from './AttachmentFrame.svelte';
	import AttachmentViewerModal from './AttachmentViewerModal.svelte';
	import { fileUrl, parseDelimited } from './attachment-utils';

	interface Props {
		attachment: AttachmentType;
	}

	const ROW_LIMIT = 40;
	const COLUMN_LIMIT = 12;

	let { attachment }: Props = $props();
	let rows = $state<string[][]>([]);
	let open = $state(false);
	let blocked = $derived(attachment.size > TEXT_PREVIEW_MAX_BYTES);
	let tries = 0;
	const fileState = writable<FileLoadState>(FileLoadState.LOADING);
	const delimiter = $derived(attachment.name.toLowerCase().endsWith('.tsv') ? '\t' : ',');
	const previewRows = $derived(rows.slice(0, ROW_LIMIT).map((row) => row.slice(0, COLUMN_LIMIT)));
	const clipped = $derived(
		rows.length > ROW_LIMIT || rows.some((row) => row.length > COLUMN_LIMIT)
	);

	async function loadCsv() {
		if (blocked) {
			fileState.set(FileLoadState.LOADED);
			return;
		}

		const response = await fetch(`${Routes.FILE}/${attachment.id}?inline=1`);
		if (response.ok) {
			rows = parseDelimited(await response.text(), delimiter);
			fileState.set(FileLoadState.LOADED);
		} else if (response.status === 404 || response.status === 410) {
			fileState.set(FileLoadState.DELETED);
		} else if (tries < MAX_FILE_LOAD_TRIES) {
			tries++;
			setTimeout(loadCsv, 1000 * tries);
		} else {
			fileState.set(FileLoadState.FAILED);
		}

		$scroll_to_bottom();
	}

	onMount(loadCsv);
</script>

<AttachmentFrame
	{attachment}
	label="table"
	icon="table"
	detail={blocked ? 'too large for inline preview' : `${rows.length} rows`}
>
	{#snippet actions()}
		<IconButton
			icon="expand"
			label="expand table preview"
			disabled={blocked}
			onclick={() => (open = true)}
		/>
		<IconButton icon="download" label="download table" href={fileUrl(attachment)} />
	{/snippet}

	<FileLoadStates loadState={fileState}>
		{#if blocked}
			<div class="table-note">download to inspect this table.</div>
		{:else}
			<div class="table-wrap">
				<table>
					<tbody>
						{#each previewRows as row}
							<tr>
								{#each row as cell}
									<td>{cell}</td>
								{/each}
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
			{#if clipped}
				<p class="table-note">preview clipped for speed.</p>
			{/if}
		{/if}
	</FileLoadStates>
</AttachmentFrame>

<AttachmentViewerModal {open} title={attachment.name} onclose={() => (open = false)}>
	{#snippet controls()}
		<IconButton icon="download" label="download table" href={fileUrl(attachment)} />
	{/snippet}

	<div class="table-wrap expanded">
		<table>
			<tbody>
				{#each rows as row}
					<tr>
						{#each row as cell}
							<td>{cell}</td>
						{/each}
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</AttachmentViewerModal>

<style>
	.table-wrap {
		max-width: 100%;
		max-height: min(45dvh, 24rem);
		overflow: auto;
	}

	.table-wrap.expanded {
		width: 100%;
		height: 100%;
		max-height: none;
		background: rgba(5, 6, 7, 0.72);
	}

	table {
		width: max-content;
		min-width: 100%;
		border-collapse: collapse;
		font-family: var(--font-mono);
		font-size: 0.74rem;
	}

	td {
		max-width: 18rem;
		padding: 0.52rem 0.65rem;
		border-right: 1px solid var(--line);
		border-bottom: 1px solid var(--line);
		color: var(--text-soft);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	tr:first-child td {
		color: var(--text);
		background: rgba(199, 156, 87, 0.08);
	}

	.table-note {
		margin: 0;
		padding: 0.75rem;
		color: var(--muted);
		font-family: var(--font-mono);
		font-size: 0.68rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}
</style>
