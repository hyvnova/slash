<script lang="ts">
	import type { AttachmentType } from '$lib/types';
	import Image from '$lib/components/attachments/Image.svelte';
	import { faCircle, faFile } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';

	export let attachment: AttachmentType;

	const type = attachment.type.split('/')[0];

	// Convert bytes to human readable format
	const calc_size = (bytes: number) => {
		const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
		if (bytes == 0) return '0 Byte';
		const i = Math.floor(Math.log(bytes) / Math.log(1024));
		return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i];
	};

	const size = calc_size(attachment.size);
</script>

{#if type == 'image'}
	<Image {attachment} />
	<!-- Unknown type or just some document -->
{:else}
	<!-- Document Icon with attachment metadata -->
	<a href="/file/{attachment.id}" target="_blank">
		<div class="flex items-center space-x-2 border border-gray-500 rounded-md p-1 m-1">
			<Fa icon={faFile} class="text-gray-400 text-3xl mx-1" />

			<div class="flex flex-col">
				<span class="text-sm text-gray-300">{attachment.name}</span>
				<div class="flex flex-grow">
					<span class="text-sm text-gray-400">{size}</span>
					<span class="text-sm text-gray-500 mx-1"> | </span>
					<span class="text-sm text-gray-400">{type}</span>
				</div>
			</div>
		</div>
	</a>
{/if}
