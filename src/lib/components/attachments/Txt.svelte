<script lang="ts">
	import { bytes_to_size } from '$lib';
	import { scroll_to_bottom } from '$lib/stores/scroll_to_bottom';
	import { FileLoadState, type AttachmentType, Routes } from '$lib/types';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import CodeBlock from '../CodeBlock.svelte';
	import Fa from 'svelte-fa';
	import { faCopy, faDownload, faExclamationTriangle, faSpinner } from '@fortawesome/free-solid-svg-icons';
	import FileLoadStates from '../FileLoadStates.svelte';

	export let attachment: AttachmentType;

	const size = bytes_to_size(attachment.size);
	let content = '';


	const state = writable<FileLoadState>(FileLoadState.LOADING);
	let tries = 0;


	const get_file_content = async () => {
		let res = await fetch(`${Routes.FILE}/${attachment.id}`);
		if (res.ok) {
			let text = await res.text();
			content = text || 'Empty file';
			state.set(FileLoadState.LOADED);
		} else {
			if (tries < 3) {
				tries++;
				setTimeout(get_file_content, 1000 * tries);
			} else {
				state.set(FileLoadState.FAILED);
			}
		}
		$scroll_to_bottom();

	};

	// Get the file from the server
	onMount(get_file_content);
</script>

<div
	class="container overflow-x-hidden
            border border-gray-500
        	h-auto max-w-[75vw]
            rounded-md m-1 p-1
        "

	on:load={$scroll_to_bottom}
>
	<!-- Header - -->
	<div class="flex flex-wrap items-center justify-center border-b border-gray-500 p-1">
		<p class="text-sm text-gray-300 text-ellipsis">{attachment.name}</p>
		<span class="text-sm text-gray-500 mx-1"> | </span>
		<p class="text-sm text-gray-400">{size}</p>
		<span class="text-sm text-gray-500 mx-1"> | </span>
		<p class="text-sm text-gray-400">{attachment.type}</p>

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
			href="${Routes.FILE}/${attachment.id}"
			target="_blank"
			class="border border-gray-500 rounded-md p-1 m-1 w-auto"
			title="Download"
		>
			<Fa icon={faDownload} class="text-gray-100" />
		</a>
	</div>


	<FileLoadStates {state}>

		<!-- On load -->
		<CodeBlock language={attachment.type.split('/')[1]} code={content} />

	</FileLoadStates>
</div>
