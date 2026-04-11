<script lang="ts">
	import { bytes_to_size } from '$lib';
	import Toast from '$lib/components/Toast.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import EmptyState from '$lib/components/ui/EmptyState.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import IconButton from '$lib/components/ui/IconButton.svelte';
	import Panel from '$lib/components/ui/Panel.svelte';
	import Topbar from '$lib/components/ui/Topbar.svelte';
	import toast from '$lib/stores/toast';
	import { Routes, type UserFileListItem } from '$lib/types';

	interface Props {
		data: import('./$types').PageData;
	}

	let { data }: Props = $props();

	// Upload rows are locally pruned after deletes to avoid a full page reload.
	// svelte-ignore state_referenced_locally
	let files = $state([...data.uploads.files]);
	// svelte-ignore state_referenced_locally
	let quota = $state(data.uploads.quota);
	let deleting = $state('');
	let used_percent = $derived(
		quota.userLimitBytes === 0 ? 0 : Math.min(100, (quota.usedBytes / quota.userLimitBytes) * 100)
	);

	async function removeFile(file: UserFileListItem) {
		deleting = file.id;
		const response = await fetch(`/api/file/${file.id}`, {
			method: 'DELETE'
		});
		const payload = (await response.json()) as {
			error?: string;
			quota?: typeof quota;
		};

		if (response.ok) {
			files = files.filter((entry) => entry.id !== file.id);
			if (payload.quota) quota = payload.quota;
		} else {
			toast.set({
				type: 'error',
				title: 'file stayed put',
				message: payload.error || 'delete did not complete.',
				duration: 5000
			});
		}
		deleting = '';
	}
</script>

<Toast />

<main class="app-page uploads-page">
	<Topbar backHref={Routes.SETTINGS} backLabel="settings" title="uploads" label="storage" />

	<Panel
		title="your files"
		description={`${bytes_to_size(quota.usedBytes)} used of ${bytes_to_size(quota.userLimitBytes)}`}
	>
		<div class="quota-meter" aria-label="storage quota">
			<div style:width={`${used_percent}%`}></div>
		</div>

		{#if files.length === 0}
			<EmptyState
				title="nothing stored"
				description="attachments will appear here once they exist."
			/>
		{:else}
			<div class="file-list">
				{#each files as file (file.id)}
					<article class="file-row">
						<div class="file-mark">
							<Icon name="file" />
						</div>
						<div class="file-main">
							<h2>{file.name}</h2>
							<p>{file.type} / {bytes_to_size(file.size)} / {file.source} / {file.status}</p>
							<time datetime={file.lastUsedAt}
								>last used {new Date(file.lastUsedAt).toLocaleString()}</time
							>
						</div>
						<div class="file-actions">
							<Button
								variant="danger"
								size="sm"
								disabled={deleting === file.id}
								loading={deleting === file.id}
								onclick={() => removeFile(file)}
							>
								delete
							</Button>
							<IconButton
								icon="trash"
								label={`delete ${file.name}`}
								variant="danger"
								disabled={deleting === file.id}
								onclick={() => removeFile(file)}
							/>
						</div>
					</article>
				{/each}
			</div>
		{/if}
	</Panel>
</main>

<style>
	.uploads-page {
		display: grid;
		gap: clamp(1rem, 3vw, 1.5rem);
		max-width: 60rem;
	}

	.quota-meter {
		height: 0.55rem;
		overflow: hidden;
		margin-bottom: 1rem;
		border: 1px solid var(--line);
		border-radius: 999px;
		background: rgba(8, 9, 11, 0.62);
	}

	.quota-meter div {
		height: 100%;
		background: linear-gradient(90deg, var(--signal), var(--accent));
		transition: width var(--transition-smooth);
	}

	.file-list {
		display: grid;
		gap: 0.7rem;
	}

	.file-row {
		display: grid;
		grid-template-columns: auto minmax(0, 1fr) auto;
		align-items: center;
		gap: 0.85rem;
		min-width: 0;
		padding: 0.85rem;
		border: 1px solid var(--line);
		border-radius: var(--radius-md);
		background: rgba(8, 9, 11, 0.34);
	}

	.file-mark {
		display: grid;
		place-items: center;
		width: 2.5rem;
		height: 2.5rem;
		border: 1px solid var(--line);
		border-radius: var(--radius-md);
		color: var(--signal);
		background: rgba(121, 166, 163, 0.08);
	}

	.file-main {
		display: grid;
		gap: 0.25rem;
		min-width: 0;
	}

	h2,
	p,
	time {
		margin: 0;
	}

	h2 {
		overflow: hidden;
		color: var(--text);
		font-size: 1rem;
		font-weight: 400;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	p,
	time {
		color: var(--muted);
		font-family: var(--font-mono);
		font-size: 0.68rem;
		line-height: 1.35;
		overflow-wrap: anywhere;
	}

	.file-actions {
		display: flex;
		align-items: center;
		gap: 0.45rem;
	}

	.file-actions :global(.ui-icon-button) {
		display: none;
	}

	@media (max-width: 38rem) {
		.file-row {
			grid-template-columns: auto minmax(0, 1fr);
			align-items: start;
		}

		.file-actions {
			grid-column: 1 / -1;
			justify-content: flex-end;
		}

		.file-actions :global(.ui-button) {
			display: none;
		}

		.file-actions :global(.ui-icon-button) {
			display: inline-flex;
		}
	}
</style>
