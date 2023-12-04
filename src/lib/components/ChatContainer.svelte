<script lang="ts">
	import type { MessageType } from '$lib/types';
	import type { Writable } from 'svelte/store';
	import { afterUpdate, onMount, tick } from 'svelte';
	import Message from './Message.svelte';

	export let messages: Writable<MessageType[]>;
	export let username: string;
	let container: HTMLDivElement;
	afterUpdate(() => {
		container.scrollTo(0, container.scrollHeight);
	});
</script>

<div
	class="flex flex-col overflow-y-auto
    px-2 scroll-smooth
    "
	bind:this={container}
>
	{#each $messages as message}
		<Message {username} {message} />
	{/each}
</div>
