<script lang="ts">
	import AvatarImage from './AvatarImage.svelte';
	import IconButton from '$lib/components/ui/IconButton.svelte';
	import { update_friendship } from '$lib/api_shortcuts';
	import { Events, FriendshipStatusType } from '$lib/types';
	import { ws } from '$lib/websocket';

	interface Props {
		username: string;
		requester: string;
		remove_request: (username: string) => void;
		add_friend: (username: string) => void;
	}

	let { username, requester, remove_request, add_friend }: Props = $props();
</script>

<li class="request-row">
	<AvatarImage username={requester} size={38} />
	<span>{requester}</span>

	<div class="request-actions">
		<IconButton
			icon="close"
			label="reject request"
			variant="danger"
			onclick={async () => {
				await update_friendship(username, requester, FriendshipStatusType.REJECTED);
				remove_request(requester);
				ws.emit(Events.REJECT_FRIEND_REQUEST, requester);
			}}
		/>
		<IconButton
			icon="check"
			label="accept request"
			onclick={async () => {
				await update_friendship(username, requester, FriendshipStatusType.FRIENDS);
				remove_request(requester);
				add_friend(requester);
				ws.emit(Events.ACCEPT_FRIEND_REQUEST, requester);
			}}
		/>
	</div>
</li>

<style>
	.request-row {
		display: grid;
		grid-template-columns: auto minmax(0, 1fr) auto;
		align-items: center;
		gap: 0.75rem;
		padding: 0.65rem;
		border: 1px solid var(--line);
		border-radius: var(--radius-md);
		background: rgba(8, 9, 11, 0.34);
	}

	span {
		min-width: 0;
		overflow: hidden;
		color: var(--text);
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.request-actions {
		display: flex;
		gap: 0.4rem;
	}
</style>
