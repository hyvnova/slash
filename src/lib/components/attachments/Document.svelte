<script lang="ts">
	import FileLoadStates from '$lib/components/FileLoadStates.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import { load_file } from '$lib/load_file';
	import { FileLoadState, Routes, type AttachmentType } from '$lib/types';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	interface Props {
		attachment: AttachmentType;
		size: string;
		type: string;
	}

	let { attachment, size, type }: Props = $props();
	// svelte-ignore state_referenced_locally
	let url = $state(`${Routes.FILE}/${attachment.id}`);
	const fileState = writable<FileLoadState>(FileLoadState.LOADING);

	onMount(async () => {
		url = await load_file(fileState, attachment.id, false);
	});
</script>

<div class="document-attachment">
	<FileLoadStates loadState={fileState}>
		<a href={url} target="_blank" rel="noreferrer">
			<Icon name="file" size={28} />
			<span class="document-text">
				<strong>{attachment.name}</strong>
				<small>{size} / {type}</small>
			</span>
		</a>
	</FileLoadStates>
</div>

<style>
	.document-attachment {
		width: min(100%, 30rem);
		border: 1px solid var(--line);
		border-radius: var(--radius-md);
		background: rgba(8, 9, 11, 0.5);
	}

	a {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		min-width: 0;
		padding: 0.75rem;
		color: var(--text-soft);
	}

	a:hover {
		color: var(--text);
	}

	.document-text {
		display: grid;
		gap: 0.2rem;
		min-width: 0;
	}

	strong {
		overflow: hidden;
		font-weight: 400;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	small {
		color: var(--muted);
		font-family: var(--font-mono);
		font-size: 0.68rem;
	}
</style>
