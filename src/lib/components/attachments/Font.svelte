<script lang="ts">
	import { bytes_to_size } from '$lib';
	import FileLoadStates from '$lib/components/FileLoadStates.svelte';
	import IconButton from '$lib/components/ui/IconButton.svelte';
	import { FileLoadState, Routes, type AttachmentType } from '$lib/types';
	import { onDestroy, onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import AttachmentFrame from './AttachmentFrame.svelte';
	import { fileUrl } from './attachment-utils';

	interface Props {
		attachment: AttachmentType;
	}

	let { attachment }: Props = $props();
	// svelte-ignore state_referenced_locally stable object URL namespace for this attachment instance
	let family = $state(`slash-preview-${attachment.id}`);
	let objectUrl = '';
	const fileState = writable<FileLoadState>(FileLoadState.LOADING);

	onMount(async () => {
		try {
			const response = await fetch(`${Routes.FILE}/${attachment.id}?inline=1`);
			if (!response.ok) {
				fileState.set(
					response.status === 404 || response.status === 410
						? FileLoadState.DELETED
						: FileLoadState.FAILED
				);
				return;
			}

			objectUrl = URL.createObjectURL(await response.blob());
			const face = new FontFace(family, `url(${objectUrl})`);
			await face.load();
			document.fonts.add(face);
			fileState.set(FileLoadState.LOADED);
		} catch {
			fileState.set(FileLoadState.FAILED);
		}
	});

	onDestroy(() => {
		if (objectUrl) URL.revokeObjectURL(objectUrl);
	});
</script>

<AttachmentFrame {attachment} label="font" icon="font" detail={bytes_to_size(attachment.size)}>
	{#snippet actions()}
		<IconButton icon="download" label="download font" href={fileUrl(attachment)} />
	{/snippet}

	<FileLoadStates loadState={fileState}>
		<div class="font-card">
			<p style:font-family={`"${family}", var(--font-body)`}>Signal first. Name second.</p>
			<span>abcdefghijklmnopqrstuvwxyz / 0123456789</span>
		</div>
	</FileLoadStates>
</AttachmentFrame>

<style>
	.font-card {
		display: grid;
		gap: 0.55rem;
		padding: 1rem;
		background: rgba(5, 6, 7, 0.42);
	}

	p {
		margin: 0;
		color: var(--text);
		font-size: clamp(1.35rem, 4vw, 2.4rem);
		line-height: 1.1;
		overflow-wrap: anywhere;
	}

	span {
		color: var(--muted);
		font-family: var(--font-mono);
		font-size: 0.7rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}
</style>
