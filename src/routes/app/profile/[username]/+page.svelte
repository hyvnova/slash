<script lang="ts">
	import { onMount } from 'svelte';
	import { bytes_to_size } from '$lib';
	import type { ActionData, PageServerData } from './$types';
	import { Routes } from '$lib/types';
	import { upload_attachment_files } from '$lib/api_shortcuts';
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
	let uploading_avatar = $state(false);
	let avatar_file = $state<File | null>(null);
	let avatar_progress = $state(0);
	// Edit fields start from server data, then become ordinary form drafts.
	// svelte-ignore state_referenced_locally
	let username = $state(data.username);
	// svelte-ignore state_referenced_locally
	let avatar = $state(editableAvatar(data.avatar));

	function editableAvatar(value: string) {
		return value.startsWith('/default_avatars/') || value.startsWith('/file/') ? '' : value;
	}

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

	async function submitAvatar(event: SubmitEvent) {
		if (!avatar_file) return;
		event.preventDefault();

		if (!avatar_file.type.startsWith('image/')) {
			toast.set({
				type: 'error',
				title: 'avatar stayed put',
				message: 'choose an image file'
			});
			return;
		}

		uploading_avatar = true;
		avatar_progress = 0;

		try {
			const [attachment] = await upload_attachment_files([avatar_file], (_file, percentage) => {
				avatar_progress = percentage;
			});

			const body = new FormData();
			body.set('avatar_file_id', attachment.id);
			const response = await fetch(`${Routes.PROFILE}/${data.username}?/update_avatar`, {
				method: 'POST',
				body
			});

			if (!response.ok) {
				throw new Error('avatar upload was not accepted');
			}

			location.href = `${Routes.PROFILE}/${data.username}`;
		} catch (error) {
			toast.set({
				type: 'error',
				title: 'avatar stayed put',
				message: error instanceof Error ? error.message : 'the avatar did not upload'
			});
		} finally {
			uploading_avatar = false;
		}
	}
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
						onsubmit={submitAvatar}
					>
						<Input
							type="url"
							name="avatar"
							label="avatar url"
							placeholder="https://..."
							bind:value={avatar}
							required={!avatar_file}
						/>
						<label class="avatar-upload">
							<span class="ui-label">image upload</span>
							<input
								type="file"
								accept="image/*"
								onchange={(event) => {
									avatar_file = event.currentTarget.files?.[0] ?? null;
								}}
							/>
							{#if avatar_file}
								<strong>{avatar_file.name}</strong>
								<small>{bytes_to_size(avatar_file.size)}</small>
								{#if uploading_avatar}
									<progress value={avatar_progress} max="100"></progress>
								{/if}
							{:else}
								<small>pick a local image; it counts toward uploads.</small>
							{/if}
						</label>
						<div class="form-actions">
							<Button type="submit" loading={uploading_avatar} disabled={uploading_avatar}>save</Button>
							<Button
								type="button"
								variant="ghost"
								onclick={() => {
									avatar = editableAvatar(data.avatar);
									avatar_file = null;
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

	.avatar-upload {
		display: grid;
		gap: 0.4rem;
		min-width: 0;
		padding: 0.75rem;
		border: 1px solid var(--line);
		border-radius: var(--radius-md);
		background: rgba(8, 9, 11, 0.42);
	}

	.avatar-upload input {
		width: 100%;
		color: var(--muted);
		font-family: var(--font-mono);
		font-size: 0.72rem;
	}

	.avatar-upload strong {
		overflow: hidden;
		color: var(--text-soft);
		font-family: var(--font-mono);
		font-size: 0.78rem;
		font-weight: 400;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.avatar-upload small {
		color: var(--muted);
		font-family: var(--font-mono);
		font-size: 0.68rem;
	}

	.avatar-upload progress {
		width: 100%;
		height: 2px;
		accent-color: var(--accent);
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
