<script lang="ts">
	import type { MessageType } from '$lib/types';
	import { writable } from 'svelte/store';
	import MessageMetadata from './MessageMetadata.svelte';

	export let username: string;
	export let message: MessageType;

	const owned = username === message.author; // Person who sent the message -> perspective of massage bubble

	let is_hovered = writable<boolean>(false);
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
	class="{owned ? 'right' : 'left'} flex justify-center items-center"
	on:mouseenter={() => is_hovered.set(true)}
	on:mouseleave={() => is_hovered.set(false)}
>
	<!-- Metadata on left -->
	{#if $is_hovered && owned}
		<div class="mr-4">
			<MessageMetadata timestamp={message.timestamp} />
		</div>
	{/if}
	<div
		class="bubble flex flex-col items-start break-words rounded-xl p-2 mb-2 w-fit
    		border-gray-700 hover:bg-gray-800
    		{owned ? 'owned' : ''}"
	>
		<div class="flex flex-col items-start">
			<p class="text-gray-200 text-base">{message.content}</p>
		</div>
	</div>

	<!-- Metadata on right -->
	{#if $is_hovered && !owned}
		<div class="ml-4">
			<MessageMetadata timestamp={message.timestamp} />
		</div>
	{/if}
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
