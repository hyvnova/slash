<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import Avatar from '$lib/components/ui/Avatar.svelte';
	import { cached } from '$lib/stores/cached';

	interface Props {
		username: string;
		use_cache?: boolean;
		size?: number;
	}

	let { username, use_cache = true, size = 40 }: Props = $props();
	// svelte-ignore state_referenced_locally
	let url = $state(`/avatar/${username}`);
	let objectUrl = '';

	onMount(async () => {
		if (!use_cache) return;

		if ($cached[username]) {
			url = $cached[username];
			return;
		}

		const response = await fetch(`/avatar/${username}`);
		if (!response.ok) return;

		objectUrl = URL.createObjectURL(await response.blob());
		url = objectUrl;
		cached.update((value) => ({ ...value, [username]: objectUrl }));
	});

	onDestroy(() => {
		if (objectUrl && !$cached[username]) URL.revokeObjectURL(objectUrl);
	});
</script>

<Avatar src={url} name={username} {size} />
