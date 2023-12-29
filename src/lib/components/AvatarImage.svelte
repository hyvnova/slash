<script lang="ts">
	/**
	 * TODO: Implement an actual cache
	*/

	import { cached } from '$lib/stores/cached';
	import { onMount } from 'svelte';

	export let username: string;
	export let use_cache: boolean = true;

	let url = `/avatar/${username}`;

	onMount(async () => {
		if (use_cache) {
			// If cache exists, use it
			if ($cached[username]) {
				url = $cached[username];

				// Otherwise, fetch the image and cache it
			} else {
				let res = await fetch(`/avatar/${username}`);

				if (res.ok) {
					const blob = await res.blob();
					url = URL.createObjectURL(blob);
					cached.update((c) => ({ ...c, [username]: url }));
				}
			}
		}
	});
</script>

<img
	src={url}
	alt="{username}'s Slash Avatar"
	class="max-w-[2.5em] max-h-[2.5em] rounded-full"
	loading="lazy"
/>
