<script lang="ts">
	import type { Writable } from 'svelte/store';
	import AvatarImage from './AvatarImage.svelte';
	import StatusDot from '$lib/components/ui/StatusDot.svelte';
	import { Routes, Status } from '$lib/types';

	interface Props {
		friend: string;
		status: Writable<Status>;
	}

	let { friend, status }: Props = $props();
</script>

<a class="friend-row" href="{Routes.CHAT_REDIRECT}/{friend}">
	<AvatarImage username={friend} size={42} />
	<span class="friend-name">{friend}</span>
	<span class="friend-status">
		<StatusDot status={$status} />
		{$status}
	</span>
</a>

<style>
	.friend-row {
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
