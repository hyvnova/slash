<script lang="ts">
	import FileLoadStates from '$lib/components/FileLoadStates.svelte';
	import { load_file } from '$lib/load_file';
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

<div class="attachment audio-attachment">
	<FileLoadStates loadState={fileState}>
		<audio src={url} controls onerror={() => fileState.set(FileLoadState.DELETED)}></audio>
	</FileLoadStates>
</div>

<style>
	.attachment {
		width: min(100%, 30rem);
		overflow: hidden;
		border: 1px solid var(--line);
		border-radius: var(--radius-md);
		background: rgba(8, 9, 11, 0.5);
	}

	audio {
		width: 100%;
		min-width: 16rem;
	}

	@media (max-width: 24rem) {
		audio {
			min-width: 0;
		}
	}
</style>
