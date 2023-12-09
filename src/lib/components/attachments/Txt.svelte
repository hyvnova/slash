<script lang="ts">
	import { bytes_to_size } from '$lib';
	import { scroll_to_bottom } from '$lib/stores/scroll_to_bottom';
	import type { AttachmentType } from '$lib/types';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import CodeBlock from '../CodeBlock.svelte';
	import Fa from 'svelte-fa';
	import { faArrowDown, faCloudDownloadAlt, faCopy, faDownload, faFileDownload } from '@fortawesome/free-solid-svg-icons';

	export let attachment: AttachmentType;

	let tries = 0;
	const size = bytes_to_size(attachment.size);

	let content = writable('Retrieving file...');

	const get_file_content = async () => {
		let res = await fetch(`/file/${attachment.id}`);

		if (res.ok) {
            let text = await res.text();
			content.set(text || 'No content');
		    $scroll_to_bottom();
		} else {
			if (tries < 3) {
				tries++;
				setTimeout(get_file_content, 1000);
                content.set(`Retrying... [${tries}]`);
			} else {
				content.set('Failed to retrieve file');
			}
		}

	};

	// Get the file from the server
	onMount(get_file_content);
</script>

<div
	class="container
            border border-gray-500
            max-h-[40vh] h-auto max-w-[75vw]
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
                navigator.clipboard.writeText($content);
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

	<!-- Content -->
	<div class="flex flex-grow items-center justify-center h-auto w-full">
		<!-- <span class="text-sm text-gray-300">{$content}</span> -->
        <CodeBlock language={attachment.type.split('/')[1]} code={$content} />

	</div>

</div>
