<script lang="ts">
	import { Routes, type MessageType, Events, Status } from '$lib/types';
	import Fa from 'svelte-fa';
	import type { PageServerData } from './$types';
	import { faArrowLeft, faCertificate, faCog } from '@fortawesome/free-solid-svg-icons';
	import AvatarImage from '$lib/components/AvatarImage.svelte';
	import { writable } from 'svelte/store';
	import { ws } from '$lib/websocket';
	import {  onMount, tick } from 'svelte';
	import ChatContainer from '$lib/components/ChatContainer.svelte';
	import ChatInput from '$lib/components/ChatInput.svelte';
	import Toast from '$lib/components/Toast.svelte';
	import toast from '$lib/stores/toast';
	import { scroll_to_bottom } from '$lib/stores/scroll_to_bottom';
	import user_config from '$lib/stores/user_config';

	export let data: PageServerData;
	export let container: HTMLElement;

	let messages = writable(data.chat.messages);
	let friend_status = writable<Status>(Status.OFFLINE);

	scroll_to_bottom.set(() => {
		container.scrollTop = container.scrollHeight;
	});

	let other_typing_timeout: string | number | NodeJS.Timeout | undefined;
	let notification_config = $user_config.notifications.custom[data.chat.id] || $user_config.notifications.general;

	onMount(async () => {
		await tick();

		ws.emit(Events.HANDSHAKE, (success: boolean) => {
			if (!success) {
				toast.set({
					type: 'error',
					title: 'Offline - Connection lost',
					message: 'Try reloading the page. Some features may not work.'
				});
			}
		});

		ws.on(Events.NEW_MESSAGE, (msg: MessageType) => {
			// Notify
			if (notification_config.enabled && msg.author !== data.user.username) {
				new Notification(msg.author, {
					body: msg.content || "New message",
					icon: '/avatar/' + msg.author,
					timestamp: Date.now(),
					silent: !notification_config.sound,
					vibrate: notification_config.vibrate ? [200, 100, 200] : undefined
				});
			}

			messages.update((old) => [...old, msg]);
			$scroll_to_bottom();
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

		ws.on(Events.STATUS, (username: string, status: Status) => {
			if (username === data.other) {
				friend_status.set(status || Status.OFFLINE);

				// If the user is typing, set the status to online after 2 seconds
				if (status == Status.TYPING) {
					clearTimeout(other_typing_timeout);
					other_typing_timeout = setTimeout(() => {
						friend_status.set(Status.ONLINE);
					}, 2000);
				}
			}
		});

		// Connect to the chat
		ws.emit(Events.CONNECT, data.user.username);
		ws.emit(Events.JOIN_CHAT, data.chat.id, data.user.username);
		ws.emit(Events.SET_STATUS, Status.ONLINE, data.chat.members);
		ws.emit(Events.GET_FRIENDS_STATUS, data.chat.members);

		$scroll_to_bottom();

	});
</script>

<svelte:head>
	<title>Chat</title>
	<meta name="description" content="Slash chat" />
	<meta name="keywords" content="slash, chat, slashchat, slash chat" />
</svelte:head>

<Toast />

<main class="max-w-3xl mx-auto layout bg-inherit" bind:this={container}>
	<!-- Top-->
	<nav class="my-1 flex justify-between items-center w-full p-1 border-b border-gray-700">
		<a href={Routes.HOME} class="ml-1 rotate text-gray-400 hover:text-gray-100">
			<Fa icon={faArrowLeft} class="text-2xl" />
		</a>

		<a href="{Routes.PROFILE}/{data.other}" class="flex justify-center items-center">
			<div class="flex justify-center items-center" title="Click to view profile">
				<AvatarImage username={data.other} />

				<div class="flex flex-col justify-center items-center">
					<h1 class="ml-2 text-gray-100 text-xl">{data.other}</h1>
					{#if data.user.verified}
						<Fa icon={faCertificate} class="ml-1 text-purple-500" />
					{/if}

					<!-- Status -->
					<p class="text-gray-400 text-sm {$friend_status}">
						{$friend_status}
					</p>
				</div>
			</div>
		</a>

		<a href="{Routes.CHAT}/{data.chat.id}/settings" class="rotate text-gray-400 hover:text-gray-100 m-1" title="Chat settings">
			<Fa icon={faCog} class="text-2xl" />
		</a>
	</nav>

	<!-- Chat container -->
	<ChatContainer username={data.user.username} {messages} />

	<!-- Input-->
	<ChatInput username={data.user.username} chat_id={data.chat.id} />
</main>

<style lang="postcss">
	.layout {
		display: grid;
		grid-template-columns: 1;
		grid-template-rows: auto 1fr auto;
		min-height: 100vh;
		max-height: 100vh;
	}
</style>
