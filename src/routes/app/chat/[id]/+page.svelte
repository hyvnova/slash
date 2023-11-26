<script lang="ts">
	import Message from '$lib/components/Message.svelte';
	import { Routes, type MessageType, Events } from '$lib/types';
	import Fa from 'svelte-fa';
	import type { PageServerData } from './$types';
	import { faArrowLeft, faCertificate } from '@fortawesome/free-solid-svg-icons';
	import AvatarImage from '$lib/components/AvatarImage.svelte';
	import { writable } from 'svelte/store';
	import { handle_message } from '$lib/api_shortcuts';
	import { ws } from '$lib/websocket';
	import { onMount } from 'svelte';

	export let data: PageServerData;

	let messages = writable(data.chat.messages);
	let message: string = '';

	onMount(() => {
		ws.emit(Events.join_chat, data.chat.id);

		ws.on(Events.new_message, (msg: MessageType) => {
			messages.update((old) => [...old, msg]);
		});

		ws.on(Events.edit_message, (msg: MessageType) => {
			messages.update((old) => {
				let index = old.findIndex((m) => m.id === msg.id);
				if (index === -1) {
					return old;
				}
				old[index] = msg;
				return old;
			});
		});

		ws.on(Events.delete_message, (msg: MessageType) => {
			messages.update((old) => {
				let index = old.findIndex((m) => m.id === msg.id);
				if (index === -1) {
					return old;
				}
				old.splice(index, 1);
				return old;
			});
		});
	});

	async function send_message() {
		if (!message) {
			return;
		}

		let msg: Partial<MessageType> = {
			content: message,
			author: data.user.username,
			timestamp: Date.now().toLocaleString()
		};

		await handle_message({
			action: 'send',
			chat_id: data.chat.id,
			message: msg
		});

		ws.emit('new message', msg);
	}
</script>

<svelte:head>
	<title>Chat</title>
	<meta name="description" content="Slash chat" />
	<meta name="keywords" content="slash, chat, slashchat, slash chat" />
</svelte:head>

<main class="w-screen max-w-2xl mx-auto">
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
	<div class="flex flex-col max-h-full overflow-y-auto p-2 m-1">
		{#each $messages as message}
			<Message username={data.user.username} {message} />
		{/each}
	</div>

	<!-- Input-->
	<div class="bottom-bar flex items-center justify-center">
		<div class="contanier rounded-lg w-full flex justify-center items-center max-w-2xl mx-auto">
			<div class="w-10/12">
				<input
					type="text"
					class="w-full text-gray-100 m-0"
					placeholder="Type a message..."
					bind:value={message}
					on:keydown={async (e) => {
						if (e.key === 'Enter') {
							await send_message();
						}
					}}
				/>
			</div>
		</div>
	</div>
</main>

<style>
	.bottom-bar {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		transition: transform 0.3s ease; /* Optional: Add a smooth transition effect */
	}
</style>
