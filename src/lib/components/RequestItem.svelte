<script lang="ts">
	import { update_friendship } from '$lib/api_shortcuts';
	import { Events, FriendshipStatusType } from '$lib/types';
	import { ws } from '$lib/websocket';
	import Fa from 'svelte-fa';
	import AvatarImage from './AvatarImage.svelte';

	export let username: string;
	export let requester: string;
	export let remove_request: (username: string) => void;
	export let add_friend: (username: string) => void;

	import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
</script>

<button class="border-none bg-none w-full m-1" title="Friend request from {requester}">
	<li
		class="h-full flex items-center rounded-md w-full p-0 py-1 pl-2
            hover:bg-gray-700
            "
	>
		<AvatarImage username={requester} />
		<p class="ml-2 text-lg">{requester}</p>

		<div class="flex items-center justify-end w-full h-full p-0">
			<!-- Reject -->
			<button
				class="w-auto h-full m-0 p-3 rounded-sm
				hover:bg-red-600 hover:text-white border-none
				"
				on:click={async () => {
					await update_friendship(username, requester, FriendshipStatusType.REJECTED);
					remove_request(requester);
					ws.emit(Events.REJECT_FRIEND_REQUEST, requester);
				}}
				title="Reject request"
			>
				<Fa icon={faTimes} class="mx-1 text-2xl" />
			</button>

			<!-- Accept -->
			<button
				class="w-auto h-full m-0 p-3 rounded-sm
				hover:bg-green-600 hover:text-white border-none
				"
				on:click={async () => {
					await update_friendship(username, requester, FriendshipStatusType.FRIENDS);
					remove_request(requester);
					add_friend(requester);
					ws.emit(Events.ACCEPT_FRIEND_REQUEST, requester);
				}}
				title="Accept request"
			>
				<Fa icon={faCheck} class="text-2xl" />
			</button>
		</div>
	</li>
</button>