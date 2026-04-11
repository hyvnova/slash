<script lang="ts">
	import { onMount } from 'svelte';
	import type { ActionData, PageServerData } from './$types';
	import { Routes } from '$lib/types';
	import toast from '$lib/stores/toast';
	import Toast from '$lib/components/Toast.svelte';
	import Avatar from '$lib/components/ui/Avatar.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import IconButton from '$lib/components/ui/IconButton.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import Panel from '$lib/components/ui/Panel.svelte';
	import Topbar from '$lib/components/ui/Topbar.svelte';

	interface Props {
		data: PageServerData;
		form: ActionData;
	}

	let { data, form }: Props = $props();

	let editing_username = $state(false);
	let editing_avatar = $state(false);
	// Edit fields start from server data, then become ordinary form drafts.
	// svelte-ignore state_referenced_locally
	let username = $state(data.username);
	// svelte-ignore state_referenced_locally
	let avatar = $state(data.avatar);

	$effect(() => {
		if (form?.error) {
			toast.set({
				type: 'error',
				title: 'profile stayed put',
				message: form.error as string,
				duration: 5000
			});
		}
	});

	onMount(() => {
		function stop_editing(event: KeyboardEvent) {
			if (event.key === 'Escape') {
				editing_username = false;
				editing_avatar = false;
			}
		}

		window.addEventListener('keydown', stop_editing);
		return () => window.removeEventListener('keydown', stop_editing);
	});
</script>

<svelte:head>
	<title>{data.username}</title>
	<meta property="og:title" content={data.username} />
	<meta property="og:type" content="profile" />
	<meta property="og:image" content={data.avatar} />
	<meta property="og:description" content={`${data.username}'s profile`} />
</svelte:head>

<Toast />

<main class="app-page profile-page">
	<Topbar backHref={Routes.HOME} backLabel="home" title={data.username} label="profile" />

	<section class="profile-stage">
		<Panel label={data.owner ? 'local profile' : 'public profile'} title={data.username}>
			<div class="profile-card">
				<div class="avatar-block">
					<Avatar src={data.avatar} name={data.username} size={128} />
					{#if data.owner}
						<IconButton
							icon="edit"
							label="edit avatar"
							onclick={() => {
								editing_avatar = !editing_avatar;
								editing_username = false;
							}}
						/>
					{/if}
				</div>

				{#if editing_avatar}
					<form
						class="edit-form"
						method="post"
						action={`${Routes.PROFILE}/${data.username}?/update_avatar`}
					>
						<Input
							type="url"
							name="avatar"
							label="avatar url"
							placeholder="https://..."
							bind:value={avatar}
							required
						/>
						<div class="form-actions">
							<Button type="submit">save</Button>
							<Button
								type="button"
								variant="ghost"
								onclick={() => {
									avatar = data.avatar;
									editing_avatar = false;
								}}>cancel</Button
							>
						</div>
					</form>
				{/if}

				{#if editing_username}
					<form
						class="edit-form"
						method="post"
						action={`${Routes.PROFILE}/${data.username}?/update_username`}
					>
						<Input
							name="username"
							label="username"
							placeholder="some_username78"
							minlength={1}
							maxlength={16}
							pattern="[a-z0-9_]+"
							autocomplete="username"
							bind:value={username}
							required
						/>
						<div class="form-actions">
							<Button type="submit">save</Button>
							<Button
								type="button"
								variant="ghost"
								onclick={() => {
									username = data.username;
									editing_username = false;
								}}>cancel</Button
							>
						</div>
					</form>
				{:else}
					<div class="name-row">
						<div>
							<p class="ui-label">handle</p>
							<h2>{data.username}</h2>
						</div>
						{#if data.owner}
							<IconButton
								icon="edit"
								label="edit username"
								onclick={() => {
									editing_username = true;
									editing_avatar = false;
								}}
							/>
						{/if}
					</div>
				{/if}
			</div>
		</Panel>
	</section>
</main>

<style>
	.profile-page {
		min-height: 100dvh;
		display: grid;
		grid-template-rows: auto minmax(0, 1fr);
		gap: clamp(1rem, 3vw, 1.5rem);
	}

	.profile-stage {
		display: grid;
		align-items: center;
		justify-items: center;
		min-width: 0;
		padding-bottom: calc(var(--safe-bottom) + 2rem);
	}

	:global(.profile-stage .ui-panel) {
		width: min(100%, 28rem);
	}

	.profile-card {
		display: grid;
		gap: 1.1rem;
		min-width: 0;
	}

	.avatar-block {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		gap: 1rem;
	}

	.edit-form {
		display: grid;
		gap: 0.85rem;
		min-width: 0;
	}

	.form-actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.55rem;
	}

	.name-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		min-width: 0;
		padding-top: 0.25rem;
	}

	h2 {
		margin: 0.2rem 0 0;
		overflow-wrap: anywhere;
		color: var(--text);
		font-family: var(--font-mono);
		font-size: 1.45rem;
		font-weight: 400;
		letter-spacing: 0.02em;
	}

	@media (max-width: 25rem) {
		.avatar-block,
		.name-row {
			align-items: flex-start;
			flex-direction: column;
		}
	}
</style>
