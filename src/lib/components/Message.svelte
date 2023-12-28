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
	class="flex flex-col {owned ? 'right' : 'left'}
		w-full
		mb-2
		"
>
	<!-- Message content & timestamp -->
	<div
		class="flex {owned ? 'flex-row-reverse right' : 'flex-row left'} items-center
			w-full max-w-full
			h-auto
		"
	>
		<!-- Message content -->
		{#if message.content}
			<div
				class="{owned ? 'bubble-owned' : 'bubble-other'} 
					transition-all duration-300
					break-words rounded-xl p-2
					max-w-[75%]
					h-auto
					"
			>

				<Markdown source={message.content} />
			</div>
		{/if}

		<!-- Timestamp -->
		<div class="timestamp flex flex-nowrap items-center justify-center w-auto h-full">
			<MessageTimestamp timestamp={message.timestamp} />
		</div>
	</div>

	<!-- Attachments -->
	<class class="flex flex-col items-center justify-center w-full h-full">
		{#each message.attachments as attachment}
			<Attachment {attachment} />
		{/each}
	</class>
</div>

<!-- TODO: Message context menu -->
<!-- <svelte:component this={MessageContextMenu} bind:is_open={is_context_open} pos={context_pos} owned={owned}/> -->

<style lang="postcss">
	.left {
		align-self: flex-start;
	}
	.right {
		align-self: flex-end;
	}

	.bubble-owned {
		background-color: theme(colors.gray.700);
		border: 2px solid theme(colors.gray.700);
		border-bottom-left-radius: 0.75em;
		border-bottom-right-radius: 0;
	}
	.bubble-owned:hover {
		background-color: theme(colors.gray.800);
	}

	.bubble-other {
		border: 2px solid theme(colors.gray.700);
		border-bottom-left-radius: 0;
		border-bottom-right-radius: 0.75em;
	}
	.bubble-other:hover {
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
