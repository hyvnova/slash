<script lang="ts">
	import type { MessageType } from '$lib/types';
	import type { Writable } from 'svelte/store';
	import { afterUpdate} from 'svelte';
	import Message from './Message.svelte';
	import { scroll_to_bottom } from '$lib/stores/scroll_to_bottom';

	export let messages: Writable<MessageType[]>;
	export let username: string;
	let container: HTMLDivElement;

	let chat_page_scroll_to_bottom = $scroll_to_bottom;

	scroll_to_bottom.set(() => {
		container.scrollTo(0, container.scrollHeight + 200);
		chat_page_scroll_to_bottom();
	});

	afterUpdate(async () => {
		$scroll_to_bottom();
	});

</script>

<div
	class="flex flex-col overflow-y-auto w-full min-h-full max-h-full
    px-2 scroll-smooth transition-all duration-300
    "
	bind:this={container}
	on:load={$scroll_to_bottom}
	on:change={$scroll_to_bottom}
>
	{#each $messages as message}
		<Message {username} {message} />
	{/each}
</div>
