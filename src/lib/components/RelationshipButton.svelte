<script lang="ts">
	import { update_friendship } from '$lib/api_shortcuts';
	import { Events, FriendshipStatusType } from '$lib/types';
	import { ws } from '$lib/websocket';
	import { faWarning } from '@fortawesome/free-solid-svg-icons';
	import { onMount } from 'svelte';
	import Fa from 'svelte-fa';
	import type { Writable } from 'svelte/store';

	export let username: string;
	export let friendship: Writable<FriendshipStatusType>;
	export let other_user: string;
	export let remove_friend: (username: string) => void;

	let is_button_hovered = false;

	// Handling friend requests status change
	onMount(() => {
		ws.on(Events.accept_friend_request, (other) => {
			if (other === other_user) {
				friendship.set(FriendshipStatusType.FRIENDS);
			}
		});
		ws.on(Events.reject_friend_request, (other) => {
			if (other === other_user) {
				friendship.set(FriendshipStatusType.REJECTED);
			}
		});
	});
</script>

<!-- Send friend request -->
{#if $friendship === FriendshipStatusType.NONE || $friendship === FriendshipStatusType.REJECTED}
	<button
		class="ml-auto border-green-600 text-white rounded-lg py-1 px-4 w-auto float-right hover:bg-green-500"
		on:click={async () => {
			friendship.set(FriendshipStatusType.REQUESTED);
			await update_friendship(username, other_user, FriendshipStatusType.REQUESTED);
			ws.emit(Events.new_friend_request, other_user);
		}}
		>Add

		<!-- If user has previously rejected -->
		{#if $friendship === FriendshipStatusType.REJECTED}
		<p title="You previously rejected this user" class="inline">
			<Fa icon={faWarning} class="text-yellow-600 text-lg inline" />
		</p>
		{/if}
	</button>

<!-- Cancel friend request -->
{:else if $friendship === FriendshipStatusType.REQUESTED}
	<button
		class="ml-auto border-white text-white rounded-lg py-1 px-4 w-auto float-right hover:bg-red-500"
		on:click={async () => {
			friendship.set(FriendshipStatusType.NONE);
			await update_friendship(username, other_user, FriendshipStatusType.NONE);

			ws.emit(Events.cancel_friend_request, other_user);
		}}>Cancel</button
	>

<!-- Unfriend -->
{:else if $friendship === FriendshipStatusType.FRIENDS}
	<button
		class="ml-auto text-white rounded-lg py-1 px-4 w-auto float-right border-white
        {is_button_hovered ? 'bg-red-500' : 'bg-blue-500'}
        "
		on:click={async () => {
			friendship.set(FriendshipStatusType.NONE);
			await update_friendship(username, other_user, FriendshipStatusType.NONE);
			ws.emit(Events.unfriend, other_user);
			remove_friend(other_user);
		}}
		on:mouseenter={() => (is_button_hovered = true)}
		on:mouseleave={() => (is_button_hovered = false)}
	>
		{is_button_hovered ? 'Unfriend' : 'Friends'}
	</button>

<!-- Request rejected -->
{:else if $friendship === FriendshipStatusType.WAS_REJECTED}
	<p class="ml-auto text-white rounded-lg py-1 px-4 w-auto float-right border-white bg-red-500">
		Your request was rejected
	</p>
{/if}
