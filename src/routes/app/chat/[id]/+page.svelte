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
	import { afterUpdate, onMount } from 'svelte';
	import ChatContainer from '$lib/components/ChatContainer.svelte';

	export let data: PageServerData;

	let messages = writable(data.chat.messages);
	let message: string = '';

	export let container: HTMLElement;


	onMount(() => {
		container.scrollTop = container.scrollHeight;

		// Connect to the chat
		ws.emit(Events.CONNECT, data.user.username);
		ws.emit(Events.JOIN_CHAT, data.chat.id);

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
	});

	async function send_message() {
		if (!message) {
			return;
		}
	
		let msg: Partial<MessageType> = {
			content: message,
			author: data.user.username,
			timestamp: (new Date()).toLocaleString()
		};

		message = '';

		await handle_message({
			action: 'send',
			chat_id: data.chat.id,
			message: msg
		});

		ws.emit(Events.NEW_MESSAGE, msg);
	}
</script>

<svelte:head>
	<title>Chat</title>
	<meta name="description" content="Slash chat" />
	<meta name="keywords" content="slash, chat, slashchat, slash chat" />
</svelte:head>

<main class="max-w-2xl mx-auto layout"
	bind:this={container}
>
	
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
	<ChatContainer
		username={data.user.username}
		{messages}
	/>


	<!-- Input-->
	<div class="p-0 m-0 mt-2 max-w-2xl 
		flex justify-center items-center
		border-t
		border-gray-600
		pt-2
		"
	>
			<form on:submit|preventDefault={send_message}
				class="m-0 my-auto p-0 w-10/12"
			>
				<input
					type="text"
					alt="Message input"
					autocomplete="off"
					autocorrect="off"
					autocapitalize="off"
					spellcheck="false"
					class="w-full text-gray-100 m-0"
					placeholder="Type a message..."
					bind:value={message}
				/>
			</form>
	</div>
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
