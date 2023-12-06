<script lang="ts">
	import { handle_message } from '$lib/api_shortcuts';
	import { Events, type MessageType } from '$lib/types';
	import { ws } from '$lib/websocket';

	export let username: string;
	export let chat_id: string;

	let message: string;

	async function send_message() {
		if (!message) {
			return;
		}

		let msg: Partial<MessageType> = {
			content: message,
			author: username,
			timestamp: new Date().toLocaleString()
		};

		message = '';

		await handle_message({
			action: 'send',
			chat_id: chat_id,
			message: msg
		});

		ws.emit(Events.NEW_MESSAGE, chat_id, msg);
	}'/'
</script>

<form on:submit|preventDefault={send_message} class="m-0 my-auto p-0 pb-2 w-10/12">
	<input
		type="text"
		alt="Message input"
		autocomplete="off"
		autocorrect="off"
		autocapitalize="off"
		spellcheck="false"
		class="w-full text-gray-100"
		placeholder="Type a message..."
		bind:value={message}
	/>
</form>

<style>
	input {
		margin: 0 !important;
	}
</style>
