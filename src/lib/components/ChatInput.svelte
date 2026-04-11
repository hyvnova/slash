<script lang="ts">
	import Icon from '$lib/components/ui/Icon.svelte';
	import { handle_message, upload_attachments } from '$lib/api_shortcuts';
	import messsage_drafts from '$lib/stores/message_drafts';
	import toast from '$lib/stores/toast';
	import { Events, type AttachmentType, type MessageType } from '$lib/types';
	import { ws } from '$lib/websocket';

	interface Props {
		username: string;
		chat_id: string;
	}

	let { username, chat_id }: Props = $props();
	// Draft state is intentionally seeded once per mounted chat composer.
	// svelte-ignore state_referenced_locally
	let message = $state($messsage_drafts[chat_id] || '');
	let files = $state<FileList | null>(null);
	let sending = $state(false);
	let fileInput = $state<HTMLInputElement | null>(null);

	const canSend = $derived(message.trim().length > 0 || !!files?.length);

	$effect(() => {
		messsage_drafts.update((drafts) => {
			drafts[chat_id] = message;
			return drafts;
		});
	});

	async function send_message() {
		if (!canSend || sending) return;

		const content = message;
		const attachmentFiles = files;
		message = '';
		sending = true;

		try {
			const attachments: AttachmentType[] = [];

			if (attachmentFiles?.length) {
				const formData = new FormData();
				for (const file of attachmentFiles) formData.append('files', file);
				attachments.push(...(await upload_attachments(formData)));
				files = null;
				if (fileInput) fileInput.value = '';
			}

			const message_obj: Partial<MessageType> = {
				content,
				author: username,
				timestamp: new Date().toLocaleString(undefined, { second: undefined }),
				attachments
			};

			await handle_message({
				action: 'send',
				chat_id,
				message: message_obj
			});

			ws.emit(Events.NEW_MESSAGE, chat_id, message_obj);
		} catch (error) {
			message = content;
			toast.set({
				type: 'error',
				title: 'upload interrupted',
				message: error instanceof Error ? error.message : 'the file did not transmit'
			});
		} finally {
			sending = false;
		}
	}

	async function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter' && !event.ctrlKey && !event.shiftKey) {
			event.preventDefault();
			await send_message();
		}

		if (event.key === 'Tab') {
			event.preventDefault();
			message += '\t';
		}
	}
</script>

<form
	class="composer"
	onsubmit={(event) => {
		event.preventDefault();
		send_message();
	}}
>
	<input type="file" multiple accept="*" name="file" bind:files bind:this={fileInput} />

	<button
		type="button"
		class={`composer-attach ${files?.length ? 'has-files' : ''}`}
		aria-label="attach files"
		title="attach files"
		onclick={() => fileInput?.click()}
	>
		<Icon name="paperclip" />
		{#if files?.length}<span>{files.length}</span>{/if}
	</button>

	<textarea
		autocomplete="off"
		spellcheck={false}
		placeholder="write the signal"
		bind:value={message}
		onkeydown={handleKeydown}
	></textarea>

	<button
		type="submit"
		class="composer-send"
		aria-label="send message"
		title="send message"
		disabled={!canSend || sending}
	>
		<Icon name={sending ? 'spinner' : 'send'} class={sending ? 'spin' : ''} />
	</button>
</form>

<style>
	.composer {
		display: grid;
		grid-template-columns: 2.75rem minmax(0, 1fr) 2.75rem;
		align-items: stretch;
		gap: 0.45rem;
		width: min(100%, 48rem);
		margin: 0 auto;
		padding: 0.55rem var(--shell-pad) calc(0.55rem + var(--safe-bottom));
	}

	input[type='file'] {
		display: none;
	}

	textarea {
		width: 100%;
		min-height: 2.75rem;
		max-height: 9rem;
		padding: 0.72rem 0.85rem;
		border: 1px solid var(--line);
		border-radius: var(--radius-md);
		background:
			linear-gradient(180deg, rgba(240, 232, 218, 0.018), transparent 46%), var(--bg-elev);
		color: var(--text);
		font-family: var(--font-mono);
		font-size: 0.88rem;
		line-height: 1.35;
		resize: vertical;
		outline: none;
	}

	textarea::placeholder {
		color: var(--muted);
	}

	textarea:focus {
		border-color: var(--line-strong);
	}

	.composer-attach,
	.composer-send {
		min-width: 0;
		min-height: 2.75rem;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.25rem;
		border: 1px solid var(--line);
		border-radius: var(--radius-md);
		background: rgba(10, 12, 14, 0.78);
		color: var(--muted);
		cursor: pointer;
		transition:
			color var(--transition-fast),
			border-color var(--transition-fast),
			background var(--transition-fast);
	}

	.composer-attach:hover,
	.composer-send:hover:not(:disabled),
	.composer-attach.has-files {
		color: var(--text);
		border-color: var(--accent);
	}

	.composer-attach span {
		color: var(--accent);
		font-family: var(--font-mono);
		font-size: 0.68rem;
	}

	.composer-send:disabled {
		opacity: 0.42;
		cursor: default;
	}

	:global(.spin) {
		animation: spin 0.9s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	@media (max-width: 34rem) {
		.composer {
			width: 100%;
			padding-inline: 0.65rem;
		}
	}
</style>
