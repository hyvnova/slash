<script lang="ts">
	import NotificationConfigPage from '$lib/pages/NotificationConfigPage.svelte';
import user_config, { FONTS } from '$lib/stores/user_config';
	import { Routes } from '$lib/types';
	import { faArrowLeft, faHome } from '@fortawesome/free-solid-svg-icons';
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

<main class="container flex flex-col justify-center items-center w-screen h-full mt-4">
	<h1 class="text-4xl text-gray-200 mb-4">Settings</h1>
	<hr />

	<!-- Appareance -->
	<section
		class="container flex flex-col justify-center items-center w-full
			bg-gray-800 rounded-md p-2 mt-2"
	>
		<h2 class="text-2xl text-gray-200 m-1">Appearance</h2>

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

		<!-- Backgrouund  -->
	</section>

	<!-- Notifications -->
	<NotificationConfigPage />


	<!-- Account -->
	<section
		class="container flex flex-col justify-center items-center w-full
			bg-gray-800 rounded-md p-2 mt-2"

	>
		<h2 class="text-2xl text-gray-200 m-1">Account</h2>
		<p class="text-gray-300 m-1 text-pretty">
			Manage your account settings. Be careful some of these actions are <strong
				>irreversible.</strong
			>
		</p>


		<div class="container flex flex-row justify-center items-center flex-wrap w-full">
			<button
				class="p-2 border-yellow-500 hover:bg-yellow-500 rounded-md text-white w-32 m-1"
				on:click={() => {
					handleSession('logout');
				}}>Logout</button
			>
			<button
				class="p-2 border-red-500 hover:bg-red-500 rounded-md text-white w-32 m-1"
				on:click={() => {
					handleSession('delete');
				}}>Delete</button
			>
		</div>
	</section>
</main>
