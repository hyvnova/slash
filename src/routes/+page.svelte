<script lang="ts">
	import { browser } from '$app/environment';
	import type { ActionData, PageServerData } from './$types';

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
		alert(form.error);
	}

	export let data: PageServerData;

	let auth_url = data.auth_url;
</script>

<main
	class="container h-screen flex flex-col justify-center items-center"
	title="Login or sing up page"
>
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
					placeholder="username"
					minlength="1"
					maxlength="24"
					required
					autofocus
					name="username"
					autocomplete="username"
					bind:value={username}
					on:keydown={goto_next_sibling}
				/>

				<input
					class="hover:border-blue-700"
					type="password"
					title="password"
					placeholder="password"
					minlength="7"
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

		<section class="ml-4 w-2/12 min-w-[2.5em]" title="Login using Nova Auth">
			<div class="blink-rotate text-center border rounded-full max-w-[6em] max-h-[6em]">
				<a href={auth_url}>
					<img src={'/nova-auth.png'} alt="nova auth icon" />
				</a>
			</div>
		</section>
	</div>
</main>

<footer class="absolute w-full text-center">
	<p class="text-sm text-gray-500">
		Made with <span class="text-red-500">&hearts;</span> by
		<a href="https://github.com/ezsnova/">NoVa</a>
	</p>
</footer>

<style>
	.blink-rotate {
		animation: blinker 2.5s cubic-bezier(0.755, 0.05, 0.855, 0.26) infinite,
			rotate 5s linear infinite;
	}
	@keyframes blinker {
		50% {
			opacity: 0;
			border-bottom: 2px solid #7d1fc2;
		}
	}

	.blink-rotate:hover {
		animation: none;
		scale: 1.1;
		filter: contrast(1.5) brightness(1.5);
	}

	@keyframes rotate {
		50% {
			transform: rotate(360deg);
		}
	}
</style>
