<script lang="ts">
	import type { MessageType } from '$lib/types';
	import { writable } from 'svelte/store';
	import Markdown from '@magidoc/plugin-svelte-marked';
	import Attachment from './Attachment.svelte';
	import MessageTimestamp from './MessageTimestamp.svelte';

	export let username: string;
	export let message: MessageType;

	const owned = username === message.author; // Person who sent the message -> perspective of massage bubble

	let is_hovered = writable<boolean>(false);
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
	class="{owned ? 'flex right' : 'flex-reverse left'}
			justify-center items-center
			transition-all duration-300"

	on:mouseenter={() => is_hovered.set(true)}
	on:mouseleave={() => is_hovered.set(false)}
>
	<MessageTimestamp {is_hovered} timestamp={message.timestamp} />

	{#if message.content}
		<div
			class="bubble flex flex-col items-start break-words rounded-xl p-2 mb-2 w-fit
    		border-gray-700 hover:bg-gray-800
			transition-all duration-300
    		{owned ? 'owned' : ''}"
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
</div>

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
</style>
