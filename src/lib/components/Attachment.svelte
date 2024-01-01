<script lang="ts">
	import { Routes, type AttachmentType } from '$lib/types';
	import Image from '$lib/components/attachments/Image.svelte';
	import { faFile } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import Txt from './attachments/Txt.svelte';
	import { bytes_to_size } from '$lib';
	import Video from './attachments/Video.svelte';
	import Audio from './attachments/Audio.svelte';

	export let attachment: AttachmentType;

	const type = attachment.type.split('/')[0];

	// Convert bytes to human readable format
	const size = bytes_to_size(attachment.size);
</script>
{#if type == 'image'}
	<Image {attachment} />

{:else if type == 'video'}
	<Video {attachment} />

{:else if type == 'audio'}
	<Audio {attachment} />

{:else if type == 'text'}
	<Txt {attachment} />  

	<!-- Unknown type or just some document -->
{:else}
	<!-- Document Icon with attachment metadata -->
	<a href="{Routes.FILE}/{attachment.id}" target="_blank">
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
