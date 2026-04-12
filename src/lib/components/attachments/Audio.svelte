<script lang="ts">
	import FileLoadStates from '$lib/components/FileLoadStates.svelte';
	import IconButton from '$lib/components/ui/IconButton.svelte';
	import { load_file } from '$lib/load_file';
	import { FileLoadState, type AttachmentType } from '$lib/types';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import AttachmentFrame from './AttachmentFrame.svelte';
	import { fileUrl } from './attachment-utils';

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

<AttachmentFrame {attachment} label="audio" icon="file" class="audio-frame">
	{#snippet actions()}
		<IconButton icon="download" label="download audio" href={fileUrl(attachment)} />
	{/snippet}

	<FileLoadStates loadState={fileState}>
		<div class="audio-shell">
			<div class="audio-rail" aria-hidden="true">
				<span></span><span></span><span></span><span></span><span></span>
			</div>
			<audio src={url} controls onerror={() => fileState.set(FileLoadState.DELETED)}></audio>
		</div>
	</FileLoadStates>
</AttachmentFrame>

<style>
	:global(.audio-frame) {
		width: min(100%, 34rem);
	}

	.audio-shell {
		display: grid;
		gap: 0.75rem;
		padding: 0.9rem;
		background: rgba(5, 6, 7, 0.42);
	}

	.audio-rail {
		display: flex;
		align-items: end;
		gap: 0.35rem;
		height: 2.4rem;
	}

	.audio-rail span {
		width: 100%;
		border-radius: 3px;
		background: linear-gradient(180deg, var(--accent), rgba(121, 166, 163, 0.5));
		opacity: 0.68;
	}

	.audio-rail span:nth-child(1) {
		height: 35%;
	}

	.audio-rail span:nth-child(2) {
		height: 78%;
	}

	.audio-rail span:nth-child(3) {
		height: 52%;
	}

	.audio-rail span:nth-child(4) {
		height: 92%;
	}

	.audio-rail span:nth-child(5) {
		height: 43%;
	}

	audio {
		width: 100%;
		min-width: 0;
	}
</style>
