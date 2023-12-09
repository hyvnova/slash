<script lang="ts">
	import { cached_images } from '$lib/stores/cached_images';
	import { scroll_to_bottom } from '$lib/stores/scroll_to_bottom';
	import type { AttachmentType } from '$lib/types';
	import { onMount } from 'svelte';

	export let attachment: AttachmentType;
	export let use_cache: boolean = false;

	let url = `/file/${attachment.id}`;

	onMount(async () => {
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
				}
			}
		}
	});
</script>

<div class="container max-h-min max-w-[75vw] border border-gray-500 rounded-md m-1 p-1"
>
	<img
		src={url}
		alt="{attachment.name} - {attachment.type} - {attachment.size} bytes"
		class="rounded-md w-full h-auto"
		loading="lazy"

		on:load={() => {
			$scroll_to_bottom()
		}}
	/>
</div>