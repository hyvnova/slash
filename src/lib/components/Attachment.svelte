<script lang="ts">
	import type { AttachmentType } from "$lib/types";
    import Image from "$lib/components/attachments/Image.svelte"

    export let attachment: AttachmentType;

    const type = attachment.type.split("/")[0];
</script>

{#if type == "image"}
    <Image {attachment} />
{/if}