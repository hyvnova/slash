<script lang="ts">
	import type { AttachmentType } from '$lib/types';
	import { bytes_to_size } from '$lib';
	import Image from '$lib/components/attachments/Image.svelte';
	import Txt from './attachments/Txt.svelte';
	import Video from './attachments/Video.svelte';
	import Audio from './attachments/Audio.svelte';
	import Document from './attachments/Document.svelte';

	interface Props {
		attachment: AttachmentType;
	}

	let { attachment }: Props = $props();

	const type = $derived(attachment.type.split('/')[0]);
	const size = $derived(bytes_to_size(attachment.size));
</script>

{#if type == 'image'}
	<Image {attachment} />
{:else if type == 'video'}
	<Video {attachment} />
{:else if type == 'audio'}
	<Audio {attachment} />
{:else if type == 'text'}
	<Txt {attachment} />
{:else}
	<Document {attachment} {size} {type} />
{/if}
