<script lang="ts">
	import SettingSection from '$lib/components/SettingSection.svelte';
	import SettingsLayout from '$lib/components/SettingsLayout.svelte';
	import Toast from '$lib/components/Toast.svelte';
	import NotificationConfigPage from '$lib/pages/NotificationConfigPage.svelte';
	import user_config, { FONTS } from '$lib/stores/user_config';
	import { Routes } from '$lib/types';
	import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';

	function handleSession(action: string) {
		fetch('/api/session', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				action: action
			})
		}).then(() => {
			window.location.href = '/';
		});
	}
</script>

<div class="container">
	<nav class="mt-2 flex justify-between items-center w-full p-2 border-b border-gray-700">
		<a href={Routes.HOME} class="ml-1 rotate text-gray-400 hover:text-gray-100">
			<Fa icon={faArrowLeft} class="text-2xl" />
		</a>
	</nav>
</div>

<Toast />

<SettingsLayout>
	<!-- Notifications -->
	<NotificationConfigPage />

	<!-- Appareance -->
	<SettingSection title="Appearance" description="Change the way the app looks">
		<!-- Font family select -->
		<label for="font-family" class="text-gray-300 m-1">Font family</label>
		<select
			class="p-2 border-gray-700 rounded-md text-gray-200 w-64 m-1"
			bind:value={$user_config.font}
		>
			{#each FONTS as font}
				<option value={font}>{font}</option>
			{/each}
		</select>

		<!-- Font size  -->
		<label for="font-size" class="text-gray-300 m-1">Font size</label>
		<input
			type="number"
			min="8"
			max="32"
			class="p-2 border-gray-700 rounded-md text-gray-200 m-1 max-w-[5em]"
			bind:value={$user_config.font_size}
		/>
	</SettingSection>

	<!-- Account -->
	<SettingSection
		title="Account"
		description="Manage your account settings. Be careful some of these actions are irreversible."
	>
		<div class="container flex flex-row justify-center items-center flex-wrap w-full">
			<button
				class="btn btn-yellow"
				on:click={() => {
					handleSession('logout');
				}}>Logout</button
			>
			<button
				class="btn btn-red"
				on:click={() => {
					handleSession('delete');
				}}>Delete</button
			>
		</div>
	</SettingSection>
</SettingsLayout>
