<script lang="ts">
	import user_config from '$lib/stores/user_config';
	import { Routes } from '$lib/types';
	import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import type { PageData } from './$types';
	import { onMount } from 'svelte';

	export let data: PageData;

	const chat_id = data.chat_id;

	function request_notification_permission() {
		Notification.requestPermission().then((permission) => {
			if (permission === 'granted') {
				// Save the permission
				user_config.update((config) => {
					// @ts-ignore
					config.notifications.custom[chat_id].enabled = true;
					return config;
				});

				// Show a notification
				new Notification('Notifications enabled', {
					body: 'You will now get notified when someone sends a message in this chat. You can disable and configure notifications in the settings.',
					icon: '/favicon.ico',
					timestamp: Date.now()
				});
			} else {
				console.log('Unable to get permission to notify.');
			}
		});
	}

	function disable_notifications() {
		user_config.update((config) => {
			// @ts-ignore
			config.notifications.custom[chat_id].enabled = false;
			return config;
		});
	}

	// Variable for input binding
	let sound = $user_config.notifications ? $user_config.notifications.custom[chat_id].sound : false;

	let vibrate = $user_config.notifications
		? $user_config.notifications.custom[chat_id].vibrate
		: false;

	onMount(() => {});
</script>

<div class="container">
	<!-- Nav -->
	<nav class="mt-2 flex justify-between items-center w-full p-2 border-b border-gray-700">
		<a href="{Routes.CHAT}/{chat_id}" class="rotate text-gray-400 hover:text-gray-100">
			<Fa icon={faArrowLeft} class="text-2xl" />
		</a>
	</nav>
</div>

<main class="container flex flex-col justify-center items-center w-screen h-full mt-4">
	<h1 class="text-4xl text-gray-200 mb-4">Settings</h1>
	<hr />

	<!-- Notifications -->
	<section
		class="container flex flex-col justify-center items-center w-full
			bg-gray-800 rounded-md p-2 mt-2"
	>
		<h2 class="text-2xl text-gray-200 m-1">Notifications</h2>

		<!-- Enabled notifications (if not enabled)-->
		{#if $user_config.notifications.custom[chat_id] === null || $user_config.notifications.custom[chat_id].enabled === false}
			<p class="text-gray-300 m-1">
				Enable notifications to get notified when someone sends a message.
			</p>

			<button
				class="p-2 border-green-500 hover:bg-green-500 rounded-md text-white w-32 m-2"
				on:click={request_notification_permission}
			>
				Enable
			</button>

			<!-- Manage notificaions (sound, if sound which sound, volume)-->
		{:else}
			<p class="text-gray-300 m-1">
				These settings apply to all chats and groups, unless you customize them individually.
			</p>

			<hr />

			<!-- Manage notifications -->
			<div class="flex flex-row justify-between items-center w-auto p-1 mt-2">
				<label for="sound">Sound</label>
				<input
					type="checkbox"
					id="sound"
					name="sound"
					bind:checked={sound}
					class="p-3 border-gray-700 rounded-md text-gray-200 m-1"
					on:change={(e) => {
						user_config.update((config) => {
							// @ts-ignore
							config.notifications.custom[chat_id].sound = e.target.checked;
							return config;
						});
					}}
				/>
			</div>

			<div class="flex flex-row justify-between items-center w-auto p-1 mt-2">
				<label for="sound">Vibrate</label>
				<input
					type="checkbox"
					id="vibrate"
					name="vibrate"
					bind:checked={vibrate}
					class="p-3 border-gray-700 rounded-md text-gray-200 m-1"
					on:change={(e) => {
						user_config.update((config) => {
							// @ts-ignore
							config.notifications.custom[chat_id].vibrate = e.target.checked;
							return config;
						});
					}}
				/>
			</div>
			<hr />

			<!-- Disable notifications -->
			<button
				class="p-2 border-yellow-500 hover:bg-yellow-500 rounded-md text-white w-32 m-1 mt-2"
				on:click={disable_notifications}
				title="Disable notifications for this chat"
			>
				Disable
			</button>
		{/if}
	</section>
</main>
