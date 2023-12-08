<!-- BottomBar.svelte -->
<script lang="ts">
	import Fa from 'svelte-fa';
	import AvatarImage from './AvatarImage.svelte';
	import { faCertificate } from '@fortawesome/free-solid-svg-icons';
	import { Routes } from '$lib/types';

	export let username: string;
	export let verified: boolean;
</script>

<div class="bottom-bar flex p-2 items-center justify-center">
	<div class="contanier w-8/12 p-2 rounded-lg bg-gray-800">
		<div class="flex justify-between items-center">
			<!-- Profile icon -->
			<a href="{Routes.PROFILE}/{username}" class="rotate text-gray-400 hover:text-gray-100" title="Profile">
				<AvatarImage {username} />
			</a>

			<p class="inline text-gray-30 font-normal text-lg mr-4">
				{username}
				<span title="Verified">
					{#if verified}
						<Fa icon={faCertificate} class="inline text-purple-500 text-sm" />
					{/if}
				</span>
			</p>
		</div>
	</div>
</div>

<style>
	.bottom-bar {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		transition: transform 0.3s ease; /* Optional: Add a smooth transition effect */
	}
</style>
