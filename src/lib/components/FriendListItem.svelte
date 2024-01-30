<script lang="ts">
	import { Routes, Status } from "$lib/types";
	import type { Writable } from "svelte/store";
	import AvatarImage from "./AvatarImage.svelte";

    export let friend: string;
    export let status: Writable<Status>;

</script>

<!-- svelte-ignore a11y-missing-attribute -->
<a class="w-10/12 p-1" href="{Routes.CHAT_REDIRECT}/{friend}">
	<div
		class="flex items-center justify-start rounded-md p-2
					transition-colors
					hover:bg-gray-700 cursor-pointer w-full
				"
	>
		<AvatarImage username={friend} />

		<h4 class="ml-4 font-normal text-lg text-gray-200">{friend}</h4>
		<span class="mx-2 text-gray-500"> - </span>
		<p class="{$status} text-gray-400 text-sm">
			{$status}
		</p>
	</div>
</a>
