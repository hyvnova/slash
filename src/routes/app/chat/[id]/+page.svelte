<script lang="ts">
	import { Routes, type MessageType, Events } from '$lib/types';
	import Fa from 'svelte-fa';
	import type { PageServerData } from './$types';
	import { faArrowLeft, faCertificate } from '@fortawesome/free-solid-svg-icons';
	import AvatarImage from '$lib/components/AvatarImage.svelte';
	import { writable } from 'svelte/store';
	import { ws } from '$lib/websocket';
	import { afterUpdate, onMount, tick } from 'svelte';
	import ChatContainer from '$lib/components/ChatContainer.svelte';
	import ChatInput from '$lib/components/ChatInput.svelte';
	import Notification from '$lib/components/Notification.svelte';
	import notification from '$lib/stores/notification';

	export let data: PageServerData;

	let messages = writable(data.chat.messages);

	export let container: HTMLElement;

	function scroll_to_bottom() {
		let margin = container.scrollHeight - container.clientHeight;
		container.scrollTo(0, container.scrollHeight + margin);
	}

	onMount(async () => {
		// Connect to the chat
		ws.emit(Events.CONNECT, data.user.username);
		ws.emit(Events.JOIN_CHAT, data.chat.id, data.user.username);

		ws.on(Events.NEW_MESSAGE, (msg: MessageType) => {
			messages.update((old) => [...old, msg]);
		});

		ws.on(Events.EDIT_MESSAGE, (msg: MessageType) => {
			messages.update((old) => {
				let index = old.findIndex((m) => m.id === msg.id);
				if (index === -1) {
					return old;
				}
				old[index] = msg;
				return old;
			});
		});

		ws.on(Events.DELETE_MESSAGE, (msg: MessageType) => {
			messages.update((old) => {
				let index = old.findIndex((m) => m.id === msg.id);
				if (index === -1) {
					return old;
				}
				old.splice(index, 1);
				return old;
			});
		});

		await tick();
		scroll_to_bottom();
	});

	afterUpdate(() => {
		scroll_to_bottom();
	});

	ws.emit(Events.HANDSHAKE, (success: boolean) => {
		if (!success) {
			notification.set({
				type: 'error',
				title: 'Offline - Connection lost',
				message: 'Try reloading the page. Some features may not work.'
			});
		}
	});
</script>

<svelte:head>
	<title>Chat</title>
	<meta name="description" content="Slash chat" />
	<meta name="keywords" content="slash, chat, slashchat, slash chat" />
</svelte:head>

<Notification />

<main class="max-w-2xl mx-auto layout scroll-smooth" bind:this={container}>
	<!-- Top-->
	<nav class="my-2 flex justify-between items-center w-full p-2 border-b border-gray-700">
		<a href={Routes.HOME} class="ml-1 rotate text-gray-400 hover:text-gray-100">
			<Fa icon={faArrowLeft} class="text-2xl" />
		</a>

		<a href="{Routes.PROFILE}/{data.other}" class="flex justify-center items-center">
			<div class="flex justify-center items-center" title="Click to view profile">
				<AvatarImage username={data.other} />
				<h1 class="ml-2 text-gray-100 text-xl">{data.other}</h1>
				{#if data.user.verified}
					<Fa icon={faCertificate} class="ml-1 text-purple-500" />
				{/if}
			</div>
		</a>
		<!-- Element to fill up and get proper aligment-->
		<div />
	</nav>

	<!-- Chat container -->
	<ChatContainer username={data.user.username} {messages} />

	<!-- Input-->
	<ChatInput username={data.user.username} chat_id={data.chat.id} />
</main>

<style>
	.layout {
		display: grid;
		grid-template-columns: 1;
		grid-template-rows: auto 1fr auto;
		max-height: 100vh;
		height: 100vh;
	}
</style>
