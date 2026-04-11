<script lang="ts">
	import type { Writable } from 'svelte/store';
	import Button from '$lib/components/ui/Button.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import { update_friendship } from '$lib/api_shortcuts';
	import { Events, FriendshipStatusType } from '$lib/types';
	import { ws } from '$lib/websocket';

	interface Props {
		username: string;
		friendship: Writable<FriendshipStatusType>;
		other_user: string;
		remove_friend: (username: string) => void;
	}

	let { username, friendship, other_user, remove_friend }: Props = $props();
	let hoveringFriends = $state(false);

	async function set_friendship(status: FriendshipStatusType) {
		friendship.set(status);
		await update_friendship(username, other_user, status);
	}
</script>

{#if $friendship === FriendshipStatusType.NONE || $friendship === FriendshipStatusType.REJECTED}
	<Button
		size="sm"
		variant="secondary"
		onclick={async () => {
			await set_friendship(FriendshipStatusType.REQUESTED);
			ws.emit(Events.NEW_FRIEND_REQUEST, other_user);
		}}
	>
		add
		{#if $friendship === FriendshipStatusType.REJECTED}<Icon name="warn" size={14} />{/if}
	</Button>
{:else if $friendship === FriendshipStatusType.REQUESTED}
	<Button
		size="sm"
		variant="danger"
		onclick={async () => {
			await set_friendship(FriendshipStatusType.NONE);
			ws.emit(Events.CANCEL_FRIEND_REQUEST, other_user);
		}}
	>
		cancel
	</Button>
{:else if $friendship === FriendshipStatusType.FRIENDS}
	<Button
		size="sm"
		variant={hoveringFriends ? 'danger' : 'secondary'}
		onmouseenter={() => (hoveringFriends = true)}
		onmouseleave={() => (hoveringFriends = false)}
		onclick={async () => {
			await set_friendship(FriendshipStatusType.NONE);
			ws.emit(Events.UNFRIEND, other_user);
			remove_friend(other_user);
		}}
	>
		{hoveringFriends ? 'remove' : 'friends'}
	</Button>
{:else if $friendship === FriendshipStatusType.WAS_REJECTED}
	<p class="relationship-note">request declined</p>
{/if}

<style>
	.relationship-note {
		margin: 0;
		color: var(--status-fail);
		font-family: var(--font-mono);
		font-size: 0.68rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}
</style>
