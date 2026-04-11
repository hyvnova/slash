<script lang="ts">
	import { onMount } from 'svelte';
	import AvatarImage from '$lib/components/AvatarImage.svelte';
	import ChatContainer from '$lib/components/ChatContainer.svelte';
	import ChatInput from '$lib/components/ChatInput.svelte';
	import Toast from '$lib/components/Toast.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import IconButton from '$lib/components/ui/IconButton.svelte';
	import StatusDot from '$lib/components/ui/StatusDot.svelte';
	import Topbar from '$lib/components/ui/Topbar.svelte';
	import { handle_notication } from '$lib/notification';
	import { scroll_to_bottom } from '$lib/stores/scroll_to_bottom';
	import toast from '$lib/stores/toast';
	import user_config from '$lib/stores/user_config';
	import { Events, Routes, Status, type MessageType } from '$lib/types';
	import { ws } from '$lib/websocket';
	import type { PageServerData } from './$types';

	interface Props {
		data: PageServerData;
	}

	let { data }: Props = $props();
	// Message state is a live socket buffer seeded from the server snapshot.
	// svelte-ignore state_referenced_locally
	let messages = $state<MessageType[]>(data.chat.messages);
	let friend_status = $state<Status>(Status.OFFLINE);
	let notification_config = $derived(
		$user_config.notifications.custom[data.chat.id] || $user_config.notifications.general
	);

	let other_typing_timeout: ReturnType<typeof setTimeout> | undefined;

	scroll_to_bottom.set(() => {});

	onMount(() => {
		ws.emit(Events.HANDSHAKE, (success: boolean) => {
			if (!success) {
				toast.set({
					type: 'error',
					title: 'signal interrupted',
					message: 'reload when the channel clears'
				});
			}
		});

		const onNewMessage = (msg: MessageType) => {
			if (notification_config.enabled && msg.author !== data.user.username) {
				handle_notication(() => {
					if (notification_config.vibrate && 'vibrate' in navigator) {
						navigator.vibrate([200, 100, 200]);
					}

					new Notification(msg.author, {
						body: msg.content || 'new message',
						icon: '/avatar/' + msg.author,
						silent: !notification_config.sound
					});
				});
			}

			messages = [...messages, msg];
		};

		const onEditMessage = (msg: MessageType) => {
			messages = messages.map((entry) => (entry.id === msg.id ? msg : entry));
		};

		const onDeleteMessage = (msg: MessageType) => {
			messages = messages.filter((entry) => entry.id !== msg.id);
		};

		const onStatus = (username: string, status: Status) => {
			if (username !== data.other) return;
			friend_status = status || Status.OFFLINE;

			if (status === Status.TYPING) {
				clearTimeout(other_typing_timeout);
				other_typing_timeout = setTimeout(() => {
					friend_status = Status.ONLINE;
				}, 2000);
			}
		};

		ws.on(Events.NEW_MESSAGE, onNewMessage);
		ws.on(Events.EDIT_MESSAGE, onEditMessage);
		ws.on(Events.DELETE_MESSAGE, onDeleteMessage);
		ws.on(Events.STATUS, onStatus);
		ws.emit(Events.CONNECT, data.user.username);
		ws.emit(Events.JOIN_CHAT, data.user.username, data.chat.id, data.chat.members);
		ws.emit(Events.SET_STATUS, Status.ONLINE, data.chat.members);
		ws.emit(Events.GET_FRIENDS_STATUS, data.chat.members);

		return () => {
			clearTimeout(other_typing_timeout);
			ws.off(Events.NEW_MESSAGE, onNewMessage);
			ws.off(Events.EDIT_MESSAGE, onEditMessage);
			ws.off(Events.DELETE_MESSAGE, onDeleteMessage);
			ws.off(Events.STATUS, onStatus);
		};
	});
</script>

<svelte:head>
	<title>{data.other} / slash</title>
	<meta name="description" content="Slash chat" />
</svelte:head>

<Toast />

<main class="chat-shell">
	<Topbar title={data.other} subtitle={friend_status} backHref={Routes.HOME}>
		{#snippet left()}
			<IconButton icon="arrow-left" label="back to contacts" href={Routes.HOME} />
		{/snippet}
		{#snippet right()}
			<a class="chat-peer" href="{Routes.PROFILE}/{data.other}" title="view profile">
				<AvatarImage username={data.other} size={36} />
				<StatusDot status={friend_status} />
			</a>
			<a class="verified" href="{Routes.PROFILE}/{data.user.username}" title="profile">
				{#if data.user.verified}<Icon name="shield" size={16} />{/if}
			</a>
			<IconButton
				icon="settings"
				label="chat settings"
				href="{Routes.CHAT}/{data.chat.id}/settings"
			/>
		{/snippet}
	</Topbar>

	<ChatContainer username={data.user.username} {messages} />
	<ChatInput username={data.user.username} chat_id={data.chat.id} />
</main>

<style>
	.chat-shell {
		display: grid;
		grid-template-rows: auto minmax(0, 1fr) auto;
		width: min(100%, 56rem);
		height: 100dvh;
		margin: 0 auto;
	}

	.chat-peer {
		position: relative;
		display: inline-flex;
		align-items: center;
		justify-content: center;
	}

	.chat-peer :global(.ui-status-dot) {
		position: absolute;
		right: -1px;
		bottom: -1px;
		border: 2px solid var(--bg);
	}

	.verified {
		display: inline-flex;
		color: var(--signal);
	}

	@media (max-width: 34rem) {
		.chat-shell {
			width: 100%;
		}
	}
</style>
