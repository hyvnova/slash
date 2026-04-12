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
	import { attachmentLabel, classifyAttachment, fileUrl } from './attachment-utils';

	interface Props {
		attachment: AttachmentType;
		use_cache?: boolean;
	}

	let { attachment, use_cache = false }: Props = $props();
	let url = $state('');
	let open = $state(false);
	let zoom = $state(1);
	let pan = $state({ x: 0, y: 0 });
	let dragging = $state(false);
	let dragStart = { x: 0, y: 0, panX: 0, panY: 0 };
	const fileState = writable<FileLoadState>(FileLoadState.LOADING);

	onMount(async () => {
		url = await load_file(fileState, attachment.id, use_cache);
	});

	function zoomBy(delta: number) {
		zoom = Math.min(5, Math.max(0.5, Math.round((zoom + delta) * 10) / 10));
		if (zoom === 1) pan = { x: 0, y: 0 };
	}

	function reset() {
		zoom = 1;
		pan = { x: 0, y: 0 };
	}

	function wheel(event: WheelEvent) {
		event.preventDefault();
		zoomBy(event.deltaY > 0 ? -0.2 : 0.2);
	}

	function pointerDown(event: PointerEvent) {
		if (zoom <= 1) return;
		dragging = true;
		dragStart = { x: event.clientX, y: event.clientY, panX: pan.x, panY: pan.y };
		(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
	}

	function pointerMove(event: PointerEvent) {
		if (!dragging) return;
		pan = {
			x: dragStart.panX + event.clientX - dragStart.x,
			y: dragStart.panY + event.clientY - dragStart.y
		};
	}

	function pointerEnd() {
		dragging = false;
	}

	function copyLink() {
		const href = new URL(fileUrl(attachment, true), window.location.origin).href;
		navigator.clipboard.writeText(href);
	}
</script>

<AttachmentFrame
	{attachment}
	label={attachmentLabel(classifyAttachment(attachment))}
	icon="file"
	class="image-frame"
>
	{#snippet actions()}
		<IconButton icon="copy" label="copy file link" onclick={copyLink} />
		<IconButton icon="expand" label="open image preview" onclick={() => (open = true)} />
		<IconButton icon="download" label="download image" href={fileUrl(attachment)} />
	{/snippet}

	<FileLoadStates loadState={fileState}>
		<button class="image-button" type="button" onclick={() => (open = true)}>
			<img
				src={url}
				alt={`${attachment.name} - ${attachment.type} - ${attachment.size} bytes`}
				loading="lazy"
				onerror={() => fileState.set(FileLoadState.DELETED)}
				onload={() => $scroll_to_bottom()}
			/>
		</button>
	</FileLoadStates>
</AttachmentFrame>

<AttachmentViewerModal {open} title={attachment.name} onclose={() => (open = false)}>
	{#snippet controls()}
		<IconButton icon="zoom-out" label="zoom out" onclick={() => zoomBy(-0.25)} />
		<IconButton icon="reset" label="reset image" onclick={reset} />
		<IconButton icon="zoom-in" label="zoom in" onclick={() => zoomBy(0.25)} />
		<IconButton icon="download" label="download image" href={fileUrl(attachment)} />
	{/snippet}

	<div
		role="application"
		aria-label="zoomable image preview"
		class={`image-stage ${zoom > 1 ? 'is-zoomed' : ''}`}
		onwheel={wheel}
		onpointerdown={pointerDown}
		onpointermove={pointerMove}
		onpointerup={pointerEnd}
		onpointercancel={pointerEnd}
	>
		<img
			src={url}
			alt={attachment.name}
			style:transform={`translate(${pan.x}px, ${pan.y}px) scale(${zoom})`}
			draggable="false"
		/>
	</div>
</AttachmentViewerModal>

<style>
	:global(.image-frame) {
		width: fit-content;
		max-width: min(100%, 42rem);
	}

	.image-button {
		display: block;
		max-width: 100%;
		padding: 0;
		border: 0;
		background: transparent;
		cursor: zoom-in;
	}

	.image-button img {
		display: block;
		width: auto;
		max-width: 100%;
		max-height: min(68dvh, 34rem);
		object-fit: contain;
	}

	.image-stage {
		display: grid;
		place-items: center;
		width: 100%;
		height: 100%;
		overflow: hidden;
		touch-action: none;
		cursor: zoom-in;
	}

	.image-stage.is-zoomed {
		cursor: grab;
	}

	.image-stage img {
		max-width: 96vw;
		max-height: calc(100dvh - 5.5rem - var(--safe-top) - var(--safe-bottom));
		object-fit: contain;
		transition: transform 120ms ease;
		user-select: none;
	}
</style>
