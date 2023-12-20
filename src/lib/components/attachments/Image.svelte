<script lang="ts">
	import { cached_images } from '$lib/stores/cached_images';
	import { scroll_to_bottom } from '$lib/stores/scroll_to_bottom';
	import { FileLoadState, type AttachmentType } from '$lib/types';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import FileLoadStates from '../FileLoadStates.svelte';

	export let attachment: AttachmentType;
	export let use_cache: boolean = false;

	let url = `/file/${attachment.id}`;

	const state = writable<FileLoadState>(FileLoadState.LOADING);
	let tries = 0;

	const get_image_content = async () => {
		if (use_cache) {
			// If cache exists, use it
			if ($cached_images[attachment.id]) {
				url = $cached_images[attachment.id];

				// Otherwise, fetch the image and cache it
			} else {
				let res = await fetch(`/file/${attachment.id}`);

				if (res.ok) {
					const blob = await res.blob();
					url = URL.createObjectURL(blob);

					cached_images.update((c) => ({ ...c, [attachment.id]: url }));

					state.set(FileLoadState.LOADED);
				} else {
					if (tries < 3) {
						tries++;
						setTimeout(get_image_content, 1000 * tries);
					} else {
						state.set(FileLoadState.FAILED);
					}
				}
			}
		}
	};

	onMount(get_image_content);
</script>

<div class="container h-auto max-w-[50vw] border border-gray-500 rounded-md m-1 p-1">

	<FileLoadStates {state}>
		<img
			src={url}
			alt="{attachment.name} - {attachment.type} - {attachment.size} bytes"
			class="rounded-md w-autp h-auto"
			loading="lazy"
			on:load={() => {
				$scroll_to_bottom();
			}}
		/>
	</FileLoadStates>
</div>
