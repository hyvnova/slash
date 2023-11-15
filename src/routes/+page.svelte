<script lang="ts">
	import { browser } from '$app/environment';
	import Notification from '$lib/components/Notification.svelte';
	import { writable } from 'svelte/store';
	import type { ActionData, PageServerData } from './$types';
	import type { NotificationType } from '$lib/types';
	import notification from '$lib/stores/notification';

	let username: string = '';
	let password: string = '';

	function goto_next_sibling(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			e.preventDefault();
			if (e.target && e.target instanceof HTMLInputElement) {
				// check if element has content
				if (!e.target.value) {
					return;
				}

				// Get and move to next sibling if it exists
				let next_sibling = (e.target as HTMLInputElement).nextElementSibling;
				if (next_sibling) {
					(next_sibling as HTMLInputElement).focus();
				}
			}
		}
	}


	/**
	 * If form submission was successful -> redirect to /me
	 * ... unsuccessful -> display error
	 */
	export let form: ActionData;
	$: if (form) {
		notification.set({
			title: "Couldn't log in",
			message: form.error,
			type: 'error',
			duration: 5000
		})
	}

</script>

<main
	class="container h-screen flex flex-col justify-center items-center"
	title="Login or sing up page"
>

	<!-- Notification card to show form error -->
	<Notification />


	<header class="mb-4">
		<h1 class="text-4xl">Join</h1>
		<p>Enter your credentials to <strong>log in</strong> or <strong>sign up</strong>.</p>
	</header>

	<!-- Split loging options: form (70%) nova-auth (30%)-->
	<div class="flex flex-row w-10/12 justify-center items-center">
		<section class="w-max">
			<form
				title="Login or sing up form"
				class="m-2 flex flex-col justify-center items-center"
				action="/"
				method="POST"
			>
				<!-- svelte-ignore a11y-autofocus -->
				<input
					class="hover:border-blue-700"
					type="text"
					title="username"
					placeholder="cool_username78"
					minlength="1"
					maxlength="16"
					required
					autofocus
					name="username"
					autocomplete="username"
					bind:value={username}
					on:keydown={goto_next_sibling}
					pattern="[a-zA-Z0-9_]+"
				/>

				<input
					class="hover:border-blue-700"
					type="password"
					title="password"
					placeholder="password"
					minlength="4"
					maxlength="128"
					required
					name="password"
					autocomplete="current-password"
					bind:value={password}
				/>

				<button
					type="submit"
					class="mt-2 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded border-blue-700"
					title="Submit"
				>
					Submit
				</button>
			</form>
		</section>

	</div>
</main>

<footer class="absolute w-full text-center">
	<p class="text-sm text-gray-500">
		Made with <span class="text-red-500">&hearts;</span> by
		<a href="https://github.com/ezsnova/"><strong>NoVa</strong></a>
	</p>
</footer>
