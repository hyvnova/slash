<script lang="ts">
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import Panel from '$lib/components/ui/Panel.svelte';
	import type { ActionData } from './$types';

	interface Props {
		form?: ActionData;
	}

	let { form }: Props = $props();
</script>

<svelte:head>
	<title>Slash</title>
	<meta name="description" content="anonymous chat with a small, direct interface" />
</svelte:head>

<main class="auth-shell">
	<section class="auth-copy" aria-labelledby="auth-title">
		<p class="ui-label">slash / gateway</p>
		<h1 id="auth-title" class="ui-title">signal first. name second.</h1>
		<p class="ui-copy">
			use one form to enter. if the handle exists, it signs in. if it does not, it creates the room
			key.
		</p>
	</section>

	<Panel label="access" title="enter" description="no email. no ceremony." inset class="auth-panel">
		<form class="auth-form" action="/" method="POST">
			<Input
				label="handle"
				type="text"
				name="username"
				placeholder="some_username78"
				minlength={1}
				maxlength={16}
				required
				autofocus
				autocomplete="username"
				pattern="[a-z0-9_]+"
			/>

			<Input
				label="key"
				type="password"
				name="password"
				placeholder="password"
				minlength={4}
				maxlength={128}
				required
				autocomplete="current-password"
			/>

			<label class="remember-row">
				<input type="checkbox" name="remember" />
				<span>keep me signed in</span>
			</label>

			{#if form?.error}
				<p class="form-error">{form.error}</p>
			{/if}

			<Button variant="primary" type="submit" class="auth-submit">submit</Button>
		</form>
	</Panel>
</main>

<footer class="auth-footer">
	<p>made by <a href="https://github.com/ezsnova/">nova</a></p>
</footer>

<style>
	.auth-shell {
		min-height: 100dvh;
		display: grid;
		grid-template-columns: minmax(0, 0.88fr) minmax(19rem, 0.62fr);
		align-items: center;
		gap: clamp(2rem, 7vw, 5rem);
		width: min(100%, 68rem);
		margin: 0 auto;
		padding: calc(var(--safe-top) + clamp(2rem, 8vw, 6rem))
			calc(var(--safe-right) + var(--shell-pad)) calc(var(--safe-bottom) + 4rem)
			calc(var(--safe-left) + var(--shell-pad));
	}

	.auth-copy {
		display: grid;
		gap: 1rem;
	}

	.auth-copy .ui-copy {
		max-width: 31rem;
	}

	:global(.auth-panel) {
		width: 100%;
	}

	.auth-form {
		display: grid;
		gap: 0.9rem;
	}

	.form-error {
		margin: 0;
		color: var(--status-fail);
		font-family: var(--font-mono);
		font-size: 0.72rem;
		line-height: 1.4;
	}

	.remember-row {
		display: inline-flex;
		align-items: center;
		gap: 0.55rem;
		width: fit-content;
		color: var(--muted-strong);
		font-family: var(--font-mono);
		font-size: 0.72rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		cursor: pointer;
	}

	.remember-row input {
		width: 1rem;
		height: 1rem;
		margin: 0;
		accent-color: var(--accent);
	}

	:global(.auth-submit) {
		width: 100%;
		margin-top: 0.25rem;
	}

	.auth-footer {
		position: fixed;
		left: 0;
		right: 0;
		bottom: calc(var(--safe-bottom) + 0.85rem);
		display: flex;
		justify-content: center;
		pointer-events: none;
	}

	.auth-footer p {
		margin: 0;
		color: var(--muted-strong);
		font-family: var(--font-mono);
		font-size: 0.68rem;
		letter-spacing: 0.08em;
	}

	.auth-footer a {
		color: var(--accent);
		text-decoration: underline;
		text-underline-offset: 0.18em;
		pointer-events: auto;
	}

	@media (max-width: 48rem) {
		.auth-shell {
			grid-template-columns: 1fr;
			align-content: center;
			gap: 1.5rem;
		}

		.auth-copy .ui-title {
			max-width: 9ch;
		}
	}
</style>
