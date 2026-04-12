<script lang="ts">
	import type { Writable } from 'svelte/store';
	import AvatarImage from './AvatarImage.svelte';
	import StatusDot from '$lib/components/ui/StatusDot.svelte';
	import TypingWord from '$lib/components/ui/TypingWord.svelte';
	import { Routes, Status } from '$lib/types';

	interface Props {
		friend: string;
		status: Writable<Status>;
		unreadCount?: number;
		muted?: boolean;
		pinned?: boolean;
		blinking?: boolean;
		onmenu?: (friend: string, x: number, y: number) => void;
	}

	let {
		friend,
		status,
		unreadCount = 0,
		muted = false,
		pinned = false,
		blinking = false,
		onmenu
	}: Props = $props();
	let longPressTimer: ReturnType<typeof setTimeout> | undefined;

	function openMenu(event: MouseEvent | PointerEvent) {
		event.preventDefault();
		onmenu?.(friend, event.clientX, event.clientY);
	}

	function startLongPress(event: PointerEvent) {
		if (event.pointerType === 'mouse') return;
		clearTimeout(longPressTimer);
		longPressTimer = setTimeout(() => openMenu(event), 520);
	}

	function cancelLongPress() {
		clearTimeout(longPressTimer);
	}
</script>

<a
	class={`friend-row ${blinking ? 'blink' : ''}`}
	href="{Routes.CHAT_REDIRECT}/{friend}"
	oncontextmenu={openMenu}
	onpointerdown={startLongPress}
	onpointerup={cancelLongPress}
	onpointercancel={cancelLongPress}
	onpointerleave={cancelLongPress}
>
	<AvatarImage username={friend} size={42} />
	<span class="friend-name">{friend}</span>
	<span class="friend-status">
		<StatusDot status={$status} />
		{#if $status === Status.TYPING}<TypingWord />{:else}{$status}{/if}
	</span>
	{#if muted || pinned}
		<span class="friend-flags">{pinned ? 'pinned' : ''}{pinned && muted ? ' / ' : ''}{muted ? 'muted' : ''}</span>
	{/if}
	{#if unreadCount > 0}
		<span class="unread-badge" aria-label={`${unreadCount} unread messages`}>
			{unreadCount > 9 ? '9+' : unreadCount}
		</span>
	{/if}
</a>

<style>
	.friend-row {
		position: relative;
		display: grid;
		grid-template-columns: auto minmax(0, 1fr) auto;
		align-items: center;
		gap: 0.85rem;
		width: 100%;
		min-height: 4rem;
		padding: 0.7rem 0.8rem;
		border: 1px solid transparent;
		border-left-color: var(--line);
		border-radius: var(--radius-md);
		color: var(--text-soft);
		transition:
			border-color var(--transition-fast),
			background var(--transition-fast),
			transform var(--transition-smooth);
	}

	.friend-row.blink {
		animation: contact-blink 0.9s ease-out 1;
	}

	.friend-row:hover {
		border-color: var(--line-strong);
		background: linear-gradient(90deg, rgba(199, 156, 87, 0.1), transparent 72%);
		transform: translateX(3px);
	}

	.friend-name {
		min-width: 0;
		overflow: hidden;
		color: var(--text);
		font-size: 1.05rem;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.friend-status {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		color: var(--muted);
		font-family: var(--font-mono);
		font-size: 0.68rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.friend-flags {
		grid-column: 2 / 3;
		color: var(--muted-strong);
		font-family: var(--font-mono);
		font-size: 0.62rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.unread-badge {
		position: absolute;
		top: 0.45rem;
		right: 0.45rem;
		display: grid;
		place-items: center;
		min-width: 1.1rem;
		height: 1.1rem;
		padding: 0 0.28rem;
		border-radius: 999px;
		background: var(--accent);
		color: var(--bg);
		font-family: var(--font-mono);
		font-size: 0.62rem;
		line-height: 1;
	}

	@keyframes contact-blink {
		0% {
			border-color: var(--accent);
			background: rgba(199, 156, 87, 0.22);
			transform: translateX(5px);
		}
		100% {
			border-color: transparent;
			background: transparent;
			transform: translateX(0);
		}
	}

	@media (max-width: 28rem) {
		.friend-row {
			grid-template-columns: auto minmax(0, 1fr);
		}

		.friend-status {
			grid-column: 2;
			justify-self: start;
		}
	}
</style>
