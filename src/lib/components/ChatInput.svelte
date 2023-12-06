<script lang="ts">
	import { handle_message } from '$lib/api_shortcuts';
	import messsage_drafts from '$lib/stores/message_drafts';
	import { Events, type MessageType } from '$lib/types';
	import { ws } from '$lib/websocket';
	import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import { writable } from 'svelte/store';

	export let username: string;
	export let chat_id: string;

	let message = writable($messsage_drafts[chat_id] || "");

	message.subscribe((val) => {
		messsage_drafts.update((drafts) => {
			drafts[chat_id] = val;
			return  drafts;
		})
	});

	async function send_message() {
		if (!message) {
			return;
		}

		let msg: Partial<MessageType> = {
			content: $message,
			author: username,
			timestamp: new Date().toLocaleString()
		};

		message.set("");

		await handle_message({
			action: 'send',
			chat_id: chat_id,
			message: msg
		});

		ws.emit(Events.NEW_MESSAGE, chat_id, msg);
	}
</script>

<div 
	class="flex justify-center items-center border-t border-gray-600 
			p-0 m-0 mt-2 max-w-2xl pt-2"
>
	<form
		on:submit|preventDefault={send_message}
		class="m-0 p-0 h-auto my-auto w-10/12 outline-none"
	>
		<textarea
			autocomplete="off"
			autocorrect="off"
			autocapitalize="off"
			spellcheck="false"
			class="w-full text-gray-100 h-fit max-h-full p-1 border-none outline-none resize-none bg-transparent"
			placeholder="Type a message..."
			bind:value={$message}
			on:keydown={(e) => {
				// Send message on enter + (ctrl or shift)
				if ($message && e.key === 'Enter' && (e.ctrlKey || e.shiftKey)) {
					send_message();
				}

				// Silly thing - send empty message on ctrl + shift + down
				if (e.key === 'ArrowDown' && (e.ctrlKey && e.shiftKey)) {
					$message = "";
					send_message();
				}

				// Tab to insert tab
				if (e.key === 'Tab') {
					e.preventDefault();
					$message += "\t";
				}
			}}
		/>
	</form>
	<!-- Send button -->
	<button
		class="border flex justify-center items-center w-12 h-12 px-2 rounded-full ml-2"
		on:click={send_message}
	>
		<Fa icon={faPaperPlane} class="text-gray-100" />
	</button>
</div>

