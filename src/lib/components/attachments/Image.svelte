<script lang="ts">
	import FileLoadStates from '$lib/components/FileLoadStates.svelte';
	import { load_file } from '$lib/load_file';
	import { scroll_to_bottom } from '$lib/stores/scroll_to_bottom';
	import { FileLoadState, type AttachmentType } from '$lib/types';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	interface Props {
		attachment: AttachmentType;
		use_cache?: boolean;
	}

	let { attachment, use_cache = false }: Props = $props();
	let url = $state('');
	const fileState = writable<FileLoadState>(FileLoadState.LOADING);

	onMount(async () => {
		url = await load_file(fileState, attachment.id, use_cache);
	});
</script>

<figure class="attachment image-attachment">
	<FileLoadStates loadState={fileState}>
		<img
			src={url}
			alt={`${attachment.name} - ${attachment.type} - ${attachment.size} bytes`}
			loading="lazy"
			onerror={() => fileState.set(FileLoadState.DELETED)}
			onload={() => $scroll_to_bottom()}
		/>
	</FileLoadStates>
</figure>

<style>
	.attachment {
		width: fit-content;
		max-width: min(100%, 42rem);
		margin: 0;
		overflow: hidden;
		border: 1px solid var(--line);
		border-radius: var(--radius-md);
		background: rgba(8, 9, 11, 0.5);
	}

	img {
		width: auto;
		max-width: 100%;
		max-height: min(70dvh, 34rem);
		object-fit: contain;
	}
</style>
