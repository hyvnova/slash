<script lang="ts">
	import { bytes_to_size } from '$lib';
	import { scroll_to_bottom } from '$lib/stores/scroll_to_bottom';
	import type { AttachmentType } from '$lib/types';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import CodeBlock from '../CodeBlock.svelte';
	import Fa from 'svelte-fa';
	import { faCopy, faDownload, faExclamationTriangle, faSpinner } from '@fortawesome/free-solid-svg-icons';

	export let attachment: AttachmentType;

	let tries = 0;
	const size = bytes_to_size(attachment.size);
	let content = '';

	enum State {
		LOADING,
		LOADED,
		FAILED
	}

	const state = writable<State>(State.LOADING);

	const get_file_content = async () => {
		let res = await fetch(`/file/${attachment.id}`);
		if (res.ok) {
			let text = await res.text();
			content = text || 'Empty file';
			state.set(State.LOADED);
			$scroll_to_bottom();
		} else {
			if (tries < 3) {
				tries++;
				setTimeout(get_file_content, 1000 * tries);
			} else {
				state.set(State.FAILED);
			}
		}
	};

	// Get the file from the server
	onMount(get_file_content);
</script>

<div
	class="container
            border border-gray-500
        	h-auto max-w-[75vw]
            rounded-md m-1 p-1
        "
>
	<!-- Header - -->
	<div class="flex items-center justify-center border-b border-gray-500 p-1">
		<span class="text-sm text-gray-300">{attachment.name}</span>
		<span class="text-sm text-gray-500 mx-1"> | </span>
		<span class="text-sm text-gray-400">{size}</span>
		<span class="text-sm text-gray-500 mx-1"> | </span>
		<span class="text-sm text-gray-400">{attachment.type}</span>

		<span class="text-sm text-gray-500 mx-1"> | </span>

		<!-- Copy to clipboard button -->
		<button
			class="border border-gray-500 rounded-md p-1 m-1 w-auto"
			title="Copy to clipboard"
			on:click={() => {
				navigator.clipboard.writeText(content);
			}}
		>
			<Fa icon={faCopy} class="text-gray-100" />
		</button>

		<!-- Download button -->
		<a
			href="/file/${attachment.id}"
			target="_blank"
			class="border border-gray-500 rounded-md p-1 m-1 w-auto"
			title="Download"
		>
			<Fa icon={faDownload} class="text-gray-100" />
		</a>
	</div>


	{#if $state == State.LOADING}
		<div class="flex items-center justify-center h-full">
			<Fa icon={faSpinner} class="text-gray-300 animate-spin mr-2" />
			<span class="text-sm text-gray-300">Loading file...</span>
		</div>
	{:else if $state == State.FAILED}
		<div class="flex items-center justify-center h-full">
			<Fa icon={faExclamationTriangle} class="text-yellow-500 mr-2" />
			<span class="text-sm text-gray-300">Failed to load file</span>
		</div>

	{:else}
		<CodeBlock language={attachment.type.split('/')[1]} code={content} />
	{/if}
</div>
