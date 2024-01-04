<script lang="ts">
	import user_config from '$lib/stores/user_config';

	function request_notification_permission() {
		Notification.requestPermission().then((permission) => {
			if (permission === 'granted') {
				// Save the permission
				user_config.update((config) => {
					config.notifications = {
						custom_notifications: {},
						general: {
							sound: true,
							volume: 1,
							enabled: false
						}
					};
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
			}
		});
	}

	function disable_notifications() {
		user_config.update((config) => {
			config.notifications = null;
			return config;
		});
	}


	let notification_sound = $user_config.notifications? $user_config.notifications.general.sound : false;
</script>

<section
	class="container flex flex-col justify-center items-center w-full
			bg-gray-800 rounded-md p-2 mt-2"
>
	<h2 class="text-2xl text-gray-200 m-1">Notifications</h2>

	<!-- Enabled notifications (if not enabled)-->
	{#if $user_config.notifications === null}
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
				bind:checked={notification_sound}
				class="p-3 border-gray-700 rounded-md text-gray-200 m-1"

				on:change={(e) => {
					user_config.update((config) => {
						// @ts-ignore
						config.notifications.general.sound = notification_sound;
						return config;
					});
				}}
			/>
		</div>

		<label for="volume" class="text-gray-300 m-1">Volume: {$user_config.notifications.general.volume}</label>
		<input 
			type="range" 
			id="volume" 
			name="volume" 
			min="0" 
			max="100" 
			step="1" 
			bind:value={$user_config.notifications.general.volume}
			class="p-3 border-gray-700 rounded-md text-gray-200 m-1"

			on:change={(e) => {
				user_config.update((config) => {
					// @ts-ignore
					config.notifications.general.volume = e.target.value;
					return config;
				});
			}}
		/>

		<hr />

		<!-- Disable notifications -->
		<button
			class="p-2 border-yellow-500 hover:bg-yellow-500 rounded-md text-white w-32 m-1"
			on:click={disable_notifications}
		>
			Disable
		</button>
	{/if}
</section>
