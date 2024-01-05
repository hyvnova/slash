<script lang="ts">
	import SettingSection from '$lib/components/SettingSection.svelte';
import toast from '$lib/stores/toast';
	import user_config from '$lib/stores/user_config';

	function request_notification_permission() {
		Notification.requestPermission().then((permission) => {
			if (permission === 'granted') {
				// Save the permission
				user_config.update((config) => {
					config.notifications.general.enabled = true;
					return config;
				});

				// Show a notification
				new Notification('Notifications enabled', {
					body: 'You will now get notified when someone sends a message. You can disable and configure notifications in the settings.',
					icon: '/favicon.ico',
					timestamp: Date.now()
				});
			} else {
				console.log('Unable to get permission to notify.');
				toast.set({
					type: "info",
					title: "Can't enable notifications",
					message: "Allow notification permission in your browser settings in order to enable notifications.",
					duration: 5000
				})
			}
		});
	}

	function disable_notifications() {
		user_config.update((config) => {
			config.notifications.general.enabled = false;
			return config;
		});
	}

	let sound = $user_config.notifications ? $user_config.notifications.general.sound : false;
	let vibrate = $user_config.notifications ? $user_config.notifications.general.vibrate : false;
</script>

<SettingSection 
	title="Notifications"
	description="Get notified when someone sends a message"
>

	<!-- Enabled notifications (if not enabled)-->
	{#if $user_config.notifications.general.enabled === false}
		<p class="text-gray-300 m-1">
			Enable notifications to get notified when someone sends a message.
		</p>

		<button
			class="btn btn-green"
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
						config.notifications.general.sound = sound;
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
						config.notifications.general.vibrate = vibrate;
						return config;
					});
				}}
			/>
		</div>

		<hr />

		<!-- Disable notifications -->
		<button
			class="btn btn-yellow"
			on:click={disable_notifications}
		>
			Disable
		</button>
	{/if}
</SettingSection>