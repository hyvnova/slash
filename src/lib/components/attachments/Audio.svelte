<script lang="ts">
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

<div class="container h-auto border border-gray-500 rounded-md m-1 p-0 outline-none">
	<FileLoadStates {state}>
			<audio 
				controls
				volume="0.5"
				class="h-11" 
				src={url}> 
			</audio>
	</FileLoadStates>
</div>


<style>
	audio::-webkit-media-controls-panel {
		background-color: #001;
		border-radius: 0px !important;
	}
</style>