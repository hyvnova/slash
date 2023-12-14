<script lang="ts">
	import type { MessageType } from '$lib/types';
	import Markdown from '@magidoc/plugin-svelte-marked';
	import Attachment from './Attachment.svelte';
	import MessageTimestamp from './MessageTimestamp.svelte';

	export let username: string;
	export let message: MessageType;

	const owned = username === message.author; // Person who sent the message -> perspective of massage bubble
</script>

<div
	class="flex {owned ? 'flex-row-reverse right' : 'flex-row left'} items-center
			transition-all duration-300 min-h-fit
			w-full mb-2
		"
>
	{#if message.content}
		<div
			class="bubble flex flex-col items-start break-words rounded-xl p-2 w-auto
					transition-all duration-300
    				{owned ? 'owned' : 'other'}"
		>
			<div class="flex flex-col items-start">
				<div class="text-gray-200 text-base">
					<Markdown source={message.content} />
				</div>
			</div>
		</div>
	{/if}

	{#each message.attachments as attachment}
		<Attachment {attachment} />
	{/each}
	

	<div class="timestamp flex flex-col items-center justify-center">
		<MessageTimestamp timestamp={message.timestamp} />
	</div>
</div>

<!-- TODO: Message context menu -->
<!-- <svelte:component this={MessageContextMenu} bind:is_open={is_context_open} pos={context_pos} owned={owned}/> -->

<style lang="postcss">
	.bubble {
		border: 2px solid theme(colors.gray.700);
		border-bottom-left-radius: 0;
	}

	.left {
		align-self: flex-start;
	}
	.right {
		align-self: flex-end;
	}

	.owned {
		background-color: theme(colors.gray.700);
		border: 2px solid theme(colors.gray.700);
		border-bottom-left-radius: 0.75em;
		border-bottom-right-radius: 0;
	}
	.owned:hover {
		background-color: theme(colors.gray.800);
	}

	.other {
		border: 2px solid theme(colors.gray.700);
		border-bottom-left-radius: 0;
		border-bottom-right-radius: 0.75em;
	}
	.other:hover {
		background-color: theme(colors.gray.800);
	}


	.timestamp {
		opacity: 0;
		transition: opacity 0.15s ease-in;
	}

	.timestamp:hover {
		opacity: 1;
	}

</style>
