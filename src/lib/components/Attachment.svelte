<script lang="ts">
	import type { AttachmentType } from '$lib/types';
	import Image from '$lib/components/attachments/Image.svelte';
	import Txt from './attachments/Txt.svelte';
	import Video from './attachments/Video.svelte';
	import Audio from './attachments/Audio.svelte';
	import Document from './attachments/Document.svelte';
	import Pdf from './attachments/Pdf.svelte';
	import Csv from './attachments/Csv.svelte';
	import Font from './attachments/Font.svelte';
	import { classifyAttachment } from './attachments/attachment-utils';

	interface Props {
		attachment: AttachmentType;
	}

	let { attachment }: Props = $props();

	const kind = $derived(classifyAttachment(attachment));
</script>

{#if kind === 'image'}
	<Image {attachment} />
{:else if kind === 'video'}
	<Video {attachment} />
{:else if kind === 'audio'}
	<Audio {attachment} />
{:else if kind === 'pdf'}
	<Pdf {attachment} />
{:else if kind === 'csv'}
	<Csv {attachment} />
{:else if kind === 'font'}
	<Font {attachment} />
{:else if kind === 'text' || kind === 'code' || kind === 'json' || kind === 'markdown'}
	<Txt {attachment} />
{:else}
	<Document {attachment} />
{/if}
