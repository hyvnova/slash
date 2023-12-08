<script lang="ts">
	import { cached_images } from '$lib/stores/cached_images';
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

<img
	src={url}
	alt="{attachment.name} - Slash Attachment"
	class="max-w-sm max-h-sm rounded-sm"
	loading="lazy"
/>
