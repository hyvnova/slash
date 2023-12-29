<script lang="ts">
	import { handle_message, upload_attachments } from '$lib/api_shortcuts';
	import messsage_drafts from '$lib/stores/message_drafts';
	import { Events, type AttachmentType, type MessageType } from '$lib/types';
	import { ws } from '$lib/websocket';
	import { faPaperPlane, faPaperclip } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import { writable } from 'svelte/store';

	export let username: string;
	export let chat_id: string;

	let message = writable($messsage_drafts[chat_id] || '');
	let files = writable<FileList | null>(null);
	let file_input: HTMLInputElement;
	let message_input: HTMLTextAreaElement;

	// Update drafts
	message.subscribe((val) => {
		messsage_drafts.update((drafts) => {
			drafts[chat_id] = val;
			return drafts;
		});
	});

	async function send_message() {
		let content = $message;
		message.set(''); // Intantly set message empty to avoid being able to send same message twice

		let attachment_files = $files;

		if (!content.trim() && !attachment_files) {
			return;
		}

		let attachments: AttachmentType[] = [];

		if (attachment_files) {
			const formData = new FormData();
			for (const file of attachment_files) {
				formData.append('files', file);
			}
			attachments = await upload_attachments(formData);
			console.log('Files length: ', attachments.length, 'Attachment length: ', attachments.length);

			file_input.files = null;
			files.set(null);
		}

		let message_obj: Partial<MessageType> = {
			content,
			author: username,
			timestamp: new Date().toLocaleString(undefined, { second: undefined }),
			attachments
		};

		await handle_message({
			action: 'send',
			chat_id: chat_id,
			message: message_obj
		});

		ws.emit(Events.NEW_MESSAGE, chat_id, message_obj);
	}
</script>

<div
	class="flex flex-grow justify-center items-center p-0
			container max-h-[2.75rem] mx-auto rounded-lg mb-2 mt-1
			transition-all duration-300
			max-w-2xl
			"
>
	<!-- Attach file button -->
	<button
		class="flex justify-center items-center w-12 h-full rounded-l-lg
					border-gray-600
					bg-gray-900 hover:bg-gray-300
					text-gray-200 hover:text-black
					transition-all duration-300
					{$files ? 'blink-bg' : ''}
				"
		on:click={() => {
			file_input.click();
		}}
	>
		<Fa icon={faPaperclip} class="mb-1" />

		<!-- Show number of files-->
		<span
			class="
				{$files ? 'opacity-100 ml-1 mt-2' : 'opacity-0'}
				"
			title=" files selected"
		>
			{$files ? $files.length : ''}
		</span>
	</button>

	<form
		on:submit|preventDefault
		class="m-0 p-0 h-full w-10/12 max-h-full
				flex justify-between items-center outline-none
				bg-gray-800
				"
	>
		<!-- File upload -->
		<input
			type="file"
			multiple
			class="hidden"
			bind:files={$files}
			accept="image/*, video/*, audio/*, .pdf, .doc, .docx, .ppt, .pptx, .xls, .xlsx, .txt"
			name="file"
			bind:this={file_input}
		/>

		<!-- Message input -->
		<textarea
			autocomplete="off"
			autocorrect="off"
			autocapitalize="off"
			spellcheck="false"
			class="w-full h-full p-1 m-0
					outline-none border-none resize-y overflow-y-auto
					bg-transparent text-gray-100
					"
			placeholder="Type a message..."
			bind:this={message_input}
			bind:value={$message}
			on:keydown={async (e) => {
				// Send message on enter, but not if ctrl or shift is pressed
				if (e.key === 'Enter') {
					if (!e.ctrlKey && !e.shiftKey) {
						e.preventDefault();
						await send_message();
					} else {
						$message += '\n';
					}
				}
				// Tab to insert tab
				if (e.key === 'Tab') {
					e.preventDefault();
					$message += '\t';
				}
			}}
		/>
		<!-- Send button -->
		<button
			class="{$message || $files ? 'opacity-100 w-12' : 'w-0 opacity-0'}
					flex justify-center items-center h-full rounded-r-lg
					border-gray-600
					bg-gray-900 hover:bg-gray-300
					text-gray-200 hover:text-black
					transition-all duration-300
					"
			on:mousedown|preventDefault
			on:click|preventDefault={async () => await send_message()}
		>
			<Fa icon={faPaperPlane} />
		</button>
	</form>
</div>

<style>
	/* Make background color slighty darker then slightly lighter */
	.blink-bg {
		animation: blink-bg 2s infinite ease-in-out;
	}
	@keyframes blink-bg {
		25% {
			filter: brightness(0.75);
		}
		75% {
			filter: brightness(1.25);
		}
	}
</style>
