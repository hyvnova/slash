<script lang="ts">
	import { browser } from '$app/environment';
	import { onDestroy } from 'svelte';
	import { bytes_to_size } from '$lib';
	import Icon from '$lib/components/ui/Icon.svelte';
	import { handle_message, upload_attachment_files } from '$lib/api_shortcuts';
	import messsage_drafts from '$lib/stores/message_drafts';
	import toast from '$lib/stores/toast';
	import { Events, Status, type AttachmentType, type MessageType } from '$lib/types';
	import { ws } from '$lib/websocket';

	interface Props {
		username: string;
		chat_id: string;
		chat_members: string[];
		onmessage?: (message: MessageType) => void;
	}

	type FilePreview = {
		id: string;
		file: File;
		url: string | null;
		progress: number;
	};

	let { username, chat_id, chat_members, onmessage }: Props = $props();
	// Draft state is intentionally seeded once per mounted chat composer.
	// svelte-ignore state_referenced_locally
	let message = $state($messsage_drafts[chat_id] || '');
	let files = $state<FilePreview[]>([]);
	let sending = $state(false);
	let fileInput = $state<HTMLInputElement | null>(null);
	let typingTimer: ReturnType<typeof setTimeout> | undefined;
	let lastTypingAt = 0;

	const statusTargets = $derived(chat_members.filter((member) => member !== username));
	const canSend = $derived(message.trim().length > 0 || files.length > 0);

	$effect(() => {
		messsage_drafts.update((drafts) => {
			drafts[chat_id] = message;
			return drafts;
		});
	});

	function createPreview(file: File): FilePreview {
		return {
			id: `${file.name}-${file.size}-${file.lastModified}-${crypto.randomUUID()}`,
			file,
			url: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
			progress: 0
		};
	}

	function addFiles(nextFiles: FileList | null) {
		if (!nextFiles?.length) return;
		files = [...files, ...Array.from(nextFiles).map(createPreview)];
		if (fileInput) fileInput.value = '';
	}

	function revokePreview(preview: FilePreview) {
		if (preview.url) URL.revokeObjectURL(preview.url);
	}

	function removeFile(id: string) {
		const removed = files.find((file) => file.id === id);
		if (removed) revokePreview(removed);
		files = files.filter((file) => file.id !== id);
	}

	function setOnline() {
		clearTimeout(typingTimer);
		if (statusTargets.length) ws.emit(Events.SET_STATUS, Status.ONLINE, statusTargets);
	}

	function signalTyping() {
		if (!statusTargets.length || sending) return;

		const now = Date.now();
		if (now - lastTypingAt > 1000) {
			ws.emit(Events.SET_STATUS, Status.TYPING, statusTargets);
			lastTypingAt = now;
		}

		clearTimeout(typingTimer);
		typingTimer = setTimeout(setOnline, 1600);
	}

	async function send_message() {
		if (!canSend || sending) return;

		const content = message;
		const attachmentFiles = [...files];
		message = '';
		sending = true;
		setOnline();

		try {
			const attachments: AttachmentType[] = [];

			if (attachmentFiles.length) {
				attachments.push(
					...(await upload_attachment_files(
						attachmentFiles.map((preview) => preview.file),
						(file, percentage) => {
							files = files.map((preview) =>
								preview.file === file ? { ...preview, progress: percentage } : preview
							);
						}
					))
				);
			}

			const message_obj: Partial<MessageType> = {
				content,
				author: username,
				timestamp: new Date().toLocaleString(undefined, { second: undefined }),
				attachments
			};

			const saved = await handle_message({
				action: 'send',
				chat_id,
				message: message_obj
			});

			if (saved) {
				onmessage?.(saved);
				ws.emit(Events.NEW_MESSAGE, chat_id, saved, chat_members);
			}

			for (const preview of attachmentFiles) revokePreview(preview);
			files = files.filter((preview) => !attachmentFiles.some((sent) => sent.id === preview.id));
			if (fileInput) fileInput.value = '';
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

	onDestroy(() => {
		clearTimeout(typingTimer);
		for (const file of files) revokePreview(file);
		if (browser) setOnline();
	});
</script>

<form
	class="composer"
	onsubmit={(event) => {
		event.preventDefault();
		send_message();
	}}
>
	{#if files.length}
		<div class="file-rail" aria-label="selected files">
			{#each files as preview (preview.id)}
				<article class="file-tile">
					{#if preview.url}
						<img src={preview.url} alt="" />
					{:else}
						<div class="file-icon"><Icon name="file" /></div>
					{/if}
					<div class="file-meta">
						<strong>{preview.file.name}</strong>
						<small>{bytes_to_size(preview.file.size)}</small>
					</div>
					{#if sending}
						<progress value={preview.progress} max="100"></progress>
					{/if}
					<button
						type="button"
						class="file-remove"
						aria-label={`remove ${preview.file.name}`}
						disabled={sending}
						onclick={() => removeFile(preview.id)}
					>
						<Icon name="close" size={14} />
					</button>
				</article>
			{/each}
		</div>
	{/if}

	<input
		type="file"
		multiple
		accept="*"
		name="file"
		bind:this={fileInput}
		onchange={() => addFiles(fileInput?.files ?? null)}
	/>

	<button
		type="button"
		class={`composer-attach ${files?.length ? 'has-files' : ''}`}
		aria-label="attach files"
		title="attach files"
		onclick={() => fileInput?.click()}
	>
		<Icon name="paperclip" />
		{#if files.length}<span>{files.length}</span>{/if}
	</button>

	<textarea
		autocomplete="off"
		spellcheck={false}
		placeholder="write the signal"
		bind:value={message}
		oninput={signalTyping}
		onkeydown={handleKeydown}
		onblur={setOnline}
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

	.file-rail {
		grid-column: 1 / -1;
		display: flex;
		gap: 0.5rem;
		min-width: 0;
		overflow-x: auto;
		padding-bottom: 0.1rem;
		scroll-snap-type: x proximity;
	}

	.file-tile {
		position: relative;
		flex: 0 0 min(15rem, 78vw);
		display: grid;
		grid-template-columns: 3rem minmax(0, 1fr) auto;
		align-items: center;
		gap: 0.65rem;
		min-width: 0;
		padding: 0.45rem;
		border: 1px solid var(--line);
		border-radius: var(--radius-md);
		background: rgba(10, 12, 14, 0.88);
		scroll-snap-align: start;
	}

	.file-tile img,
	.file-icon {
		width: 3rem;
		aspect-ratio: 1;
		border-radius: var(--radius-sm);
		background: var(--bg-elev-soft);
		object-fit: cover;
	}

	.file-icon {
		display: grid;
		place-items: center;
		color: var(--muted);
	}

	.file-meta {
		display: grid;
		gap: 0.2rem;
		min-width: 0;
	}

	.file-meta strong {
		overflow: hidden;
		color: var(--text-soft);
		font-family: var(--font-mono);
		font-size: 0.72rem;
		font-weight: 400;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.file-meta small {
		color: var(--muted);
		font-family: var(--font-mono);
		font-size: 0.64rem;
	}

	progress {
		grid-column: 1 / -1;
		width: 100%;
		height: 2px;
		accent-color: var(--accent);
	}

	.file-remove {
		display: inline-grid;
		place-items: center;
		width: 1.8rem;
		height: 1.8rem;
		border: 1px solid var(--line);
		border-radius: var(--radius-sm);
		background: transparent;
		color: var(--muted);
		cursor: pointer;
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
