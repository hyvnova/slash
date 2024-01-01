<script lang="ts">
	import type { MessageType } from '$lib/types';
	import Markdown from '@magidoc/plugin-svelte-marked';
	import Attachment from './Attachment.svelte';
	import MessageTimestamp from './MessageTimestamp.svelte';
	import message_context_menu from '$lib/stores/message_context_menu';

	export let username: string;
	export let message: MessageType;

	const owned = username === message.author; // Person who sent the message -> perspective of massage bubble
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
	class="flex flex-col {owned ? 'right' : 'left'}
		w-full
		max-w-full
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
	<class class="flex flex-col items-center justify-center w-auto h-full {owned ? 'right' : 'left'}">
		{#each message.attachments as attachment}
			<Attachment {attachment} />
		{/each}
	</class>
</div>

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
