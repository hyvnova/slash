<script lang="ts">
	import FileLoadStates from '$lib/components/FileLoadStates.svelte';
	import IconButton from '$lib/components/ui/IconButton.svelte';
	import { load_file } from '$lib/load_file';
	import { scroll_to_bottom } from '$lib/stores/scroll_to_bottom';
	import { FileLoadState, type AttachmentType } from '$lib/types';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import AttachmentFrame from './AttachmentFrame.svelte';
	import AttachmentViewerModal from './AttachmentViewerModal.svelte';
	import { fileUrl } from './attachment-utils';

	interface Props {
		attachment: AttachmentType;
		use_cache?: boolean;
	}

	let { attachment, use_cache = false }: Props = $props();
	let url = $state('');
	let open = $state(false);
	const fileState = writable<FileLoadState>(FileLoadState.LOADING);

	onMount(async () => {
		url = await load_file(fileState, attachment.id, use_cache);
	});
</script>

<AttachmentFrame {attachment} label="video" icon="file">
	{#snippet actions()}
		<IconButton icon="expand" label="expand video" onclick={() => (open = true)} />
		<IconButton icon="download" label="download video" href={fileUrl(attachment)} />
	{/snippet}

	<FileLoadStates loadState={fileState}>
		<video
			src={url}
			controls
			muted
			onerror={() => fileState.set(FileLoadState.DELETED)}
			onloadedmetadata={() => $scroll_to_bottom()}
		></video>
	</FileLoadStates>
</AttachmentFrame>

<AttachmentViewerModal {open} title={attachment.name} onclose={() => (open = false)}>
	{#snippet controls()}
		<IconButton icon="download" label="download video" href={fileUrl(attachment)} />
	{/snippet}

	<div class="video-stage">
		<!-- svelte-ignore a11y_media_has_caption uploaded clips rarely include captions metadata -->
		<video src={url} controls autoplay></video>
	</div>
</AttachmentViewerModal>

<style>
	video {
		display: block;
		width: 100%;
		max-height: min(68dvh, 34rem);
		background: black;
		object-fit: contain;
	}

	.video-stage {
		display: grid;
		place-items: center;
		width: 100%;
		height: 100%;
		background: black;
	}

	.video-stage video {
		max-width: 100%;
		max-height: 100%;
	}
</style>
