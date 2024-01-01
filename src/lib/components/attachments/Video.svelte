<script lang="ts">
	import { scroll_to_bottom } from '$lib/stores/scroll_to_bottom';
	import { FileLoadState, type AttachmentType } from '$lib/types';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import FileLoadStates from '$lib/components/FileLoadStates.svelte';
	import { load_file } from '$lib/load_file';
	export let attachment: AttachmentType;
	export let use_cache: boolean = false;

	let url: string;
	const state = writable<FileLoadState>(FileLoadState.LOADING);

	onMount(async () => {
		url = await load_file(state, attachment.id, use_cache);
	});
</script>

<div class="container h-auto max-w-[50vw] border border-gray-500 rounded-md m-1 p-1">

	<FileLoadStates {state}>
		<video
            class="w-full h-auto"
            src={url}
            controls
            muted
            on:loadedmetadata={() => {
                $scroll_to_bottom();
            }}
        />
	</FileLoadStates>
</div>
