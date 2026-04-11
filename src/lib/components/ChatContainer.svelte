<script lang="ts">
	import { tick } from 'svelte';
	import type { MessageType } from '$lib/types';
	import Message from './Message.svelte';

	interface Props {
		messages: MessageType[];
		username: string;
	}

	let { messages, username }: Props = $props();
	let container = $state<HTMLDivElement | null>(null);

	function scroll_to_bottom() {
		container?.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
	}

	$effect(() => {
		messages.length;
		tick().then(scroll_to_bottom);
	});
</script>

<div class="message-viewport" bind:this={container}>
	{#each messages as message (message.id)}
		<Message {username} {message} />
	{/each}
</div>

<style>
	.message-viewport {
		min-height: 0;
		width: 100%;
		max-width: 100vw;
		overflow-y: auto;
		overflow-x: hidden;
		padding: 0.9rem var(--shell-pad);
		scroll-behavior: smooth;
	}

	@media (max-width: 34rem) {
		.message-viewport {
			padding-inline: 0.65rem;
		}
	}
</style>
