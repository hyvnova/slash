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

	// Update drafts
	message.subscribe((val) => {
		messsage_drafts.update((drafts) => {
			drafts[chat_id] = val;
			return drafts;
		});
	});

	async function send_message() {
		$message = $message.trim();
		if (!$message && !$files) {
			return;
		}

		let attachments: AttachmentType[] = [];
		if ($files) {
			const formData = new FormData();
			for (const file of $files) {
				formData.append('files', file);
			}
			attachments = await upload_attachments(formData);
		}

		file_input.files = null;
		files.set(null);

		let msg: Partial<MessageType> = {
			content: $message,
			author: username,
			timestamp: new Date().toLocaleString(),
			attachments: attachments
		};

		message.set('');

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
	<form on:submit|preventDefault={send_message} class="m-0 p-0 h-auto my-auto w-10/12 outline-none">
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

		<textarea
			autocomplete="off"
			autocorrect="off"
			autocapitalize="off"
			spellcheck="false"
			class="w-full text-gray-100 h-9 max-h-full px-1 border-none outline-none resize-y bg-transparent"
			placeholder="Type a message..."
			bind:value={$message}
			on:keydown={(e) => {
				// Send message on enter, but not if ctrl or shift is pressed
				if (e.key === 'Enter') {
					if (!e.ctrlKey && !e.shiftKey) {
						e.preventDefault();
						send_message();
					} else {
						$message += '\n';
					}
				}

				// Silly thing - send empty message on ctrl + shift + down
				if (e.key === 'ArrowDown' && e.ctrlKey && e.shiftKey) {
					$message = '';
					send_message();
				}

				// Tab to insert tab
				if (e.key === 'Tab') {
					e.preventDefault();
					$message += '\t';
				}
			}}
		/>
	</form>
	<!-- Send button -->
	{#if $message || $files}
		<button
			class="border flex justify-center items-center w-10 h-10 px-2 rounded-full ml-2"
			on:click={send_message}
		>
			<Fa icon={faPaperPlane} class="text-gray-100" />
		</button>
	{:else}
		<!-- If no content, upload file button -->
		<button
			class="border flex justify-center items-center w-10 h-10 px-2 rounded-full ml-2"
			on:click={() => {
				file_input.click();
			}}
		>
			<Fa icon={faPaperclip} class="text-gray-100" />
		</button>
	{/if}

	<!-- Show number of files-->
	{#if $files}
		<span class="text-gray-100 mx-2" title="{$files.length} files selected">{$files.length}</span>
	{/if}
</div>
