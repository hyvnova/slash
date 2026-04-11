<script lang="ts">
	import Markdown from '@magidoc/plugin-svelte-marked';
	import Attachment from './Attachment.svelte';
	import MessageTimestamp from './MessageTimestamp.svelte';
	import type { MessageType } from '$lib/types';

	interface Props {
		username: string;
		message: MessageType;
	}

	let { username, message }: Props = $props();
	const owned = $derived(username === message.author);
</script>

<article class={`message ${owned ? 'owned' : 'other'}`}>
	<div class="message-line">
		{#if message.content}
			<div class="bubble">
				<Markdown source={message.content} />
			</div>
		{/if}

		<MessageTimestamp timestamp={message.timestamp} />
	</div>

	{#if message.attachments?.length}
		<div class="attachments">
			{#each message.attachments as attachment}
				<Attachment {attachment} />
			{/each}
		</div>
	{/if}
</article>

<style>
	.message {
		display: grid;
		gap: 0.35rem;
		width: 100%;
		margin: 0.35rem 0 0.8rem;
	}

	.message-line {
		display: flex;
		align-items: flex-end;
		gap: 0.45rem;
		min-width: 0;
	}

	.owned .message-line {
		flex-direction: row-reverse;
	}

	.bubble {
		position: relative;
		max-width: min(78%, 42rem);
		min-width: 0;
		padding: 0.72rem 0.86rem;
		border: 1px solid var(--line);
		border-radius: var(--radius-md);
		background:
			linear-gradient(180deg, rgba(240, 232, 218, 0.018), transparent 40%), rgba(11, 13, 16, 0.84);
		color: var(--text-soft);
		overflow-wrap: anywhere;
	}

	.bubble::before {
		content: '';
		position: absolute;
		top: 0.6rem;
		bottom: 0.6rem;
		width: 1px;
		background: var(--signal);
		opacity: 0.55;
	}

	.other .bubble::before {
		left: -1px;
	}

	.owned .bubble {
		background:
			linear-gradient(90deg, rgba(199, 156, 87, 0.12), transparent 76%), rgba(18, 21, 26, 0.9);
		border-color: var(--line-strong);
	}

	.owned .bubble::before {
		right: -1px;
		background: var(--accent);
	}

	.bubble :global(p) {
		margin: 0;
		line-height: 1.5;
	}

	.bubble :global(p + p) {
		margin-top: 0.65rem;
	}

	.bubble :global(a) {
		color: var(--signal);
		text-decoration: underline;
		text-underline-offset: 0.18em;
	}

	.bubble :global(code) {
		font-family: var(--font-mono);
		font-size: 0.88em;
		color: var(--accent-strong);
	}

	.attachments {
		display: grid;
		justify-items: start;
		gap: 0.35rem;
		max-width: min(100%, 42rem);
	}

	.owned .attachments {
		justify-items: end;
		margin-left: auto;
	}

	@media (max-width: 34rem) {
		.bubble {
			max-width: 86%;
		}
	}
</style>
