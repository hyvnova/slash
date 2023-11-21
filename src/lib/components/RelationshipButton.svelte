<script lang="ts">
	import { update_friendship } from "$lib/api_shortcuts";
	import { FriendshipStatusType } from "$lib/types";
	import { ws } from "$lib/websocket";
	import type { Writable } from "svelte/store";

    export let username: string;
    export let friendship: Writable<FriendshipStatusType>;
    export let other_user: string;
    export let remove_friend: (username: string) => void;

    let is_button_hovered = false;

    // Handling friend requests
    ws.on('accept friend request', other => {
        if (other === other_user) {
            friendship.set(FriendshipStatusType.FRIENDS);
        }
    })
    ws.on('reject friend request', other => {
        if (other === other_user) {
            friendship.set(FriendshipStatusType.REJECTED);
        }
    })

</script>
{#if $friendship === FriendshipStatusType.NONE}
    <button
        class="ml-auto border-green-600 text-white rounded-lg py-1 px-4 w-auto float-right hover:bg-green-500"
        on:click={() => {
            friendship.set(FriendshipStatusType.REQUESTED);
            update_friendship(
                username,
                other_user,
                FriendshipStatusType.REQUESTED
            );

            ws.emit('new friend request', other_user);
        }}>Add</button
    >
{:else if $friendship === FriendshipStatusType.REQUESTED}
    <button
        class="ml-auto border-white text-white rounded-lg py-1 px-4 w-auto float-right hover:bg-red-500"
        on:click={() => {
            friendship.set(FriendshipStatusType.NONE);
            update_friendship(
                username,
                other_user,
                FriendshipStatusType.NONE
            );

            ws.emit('cancel friend request', other_user);
        }}>Cancel</button
    >
{:else if $friendship === FriendshipStatusType.FRIENDS}
    <button
        class="ml-auto  text-white rounded-lg py-1 px-4 w-auto float-right border-white 
        {is_button_hovered ? "bg-red-500" : "bg-blue-500"}
        "
        on:click={() => {
            friendship.set(FriendshipStatusType.NONE);
            update_friendship(
                username,
                other_user,
                FriendshipStatusType.NONE
            );
            ws.emit('unfriend', other_user);
            remove_friend(other_user);
        }}
        on:mouseenter={() => is_button_hovered = true}
        on:mouseleave={() => is_button_hovered = false}
    >
         {is_button_hovered ? "Unfriend" : "Friends"}
    </button>

{:else if $friendship === FriendshipStatusType.REJECTED}
    <p
        class="ml-auto text-white rounded-lg py-1 px-4 w-auto float-right border-white bg-red-500"
    >
        Your request was rejected
    </p>
{/if}
