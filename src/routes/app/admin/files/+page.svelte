<script lang="ts">
	import { goto } from '$app/navigation';
	import { bytes_to_size } from '$lib';
	import Toast from '$lib/components/Toast.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import EmptyState from '$lib/components/ui/EmptyState.svelte';
	import Panel from '$lib/components/ui/Panel.svelte';
	import TableShell from '$lib/components/ui/TableShell.svelte';
	import Topbar from '$lib/components/ui/Topbar.svelte';
	import toast from '$lib/stores/toast';
	import { Routes, type AdminFileListResponse } from '$lib/types';

	interface Props {
		data: import('./$types').PageData;
	}

	let { data }: Props = $props();

	// Local mutations keep deletes instant without waiting for page invalidation.
	// svelte-ignore state_referenced_locally
	let response = $state(data.files);
	let deleting = $state('');

	const filters: AdminFileListResponse['filter'][] = [
		'all',
		'active',
		'deleted',
		'orphaned',
		'legacy'
	];

	async function removeFile(fileId: string) {
		deleting = fileId;
		const result = await fetch(`/api/admin/files/${fileId}`, {
			method: 'DELETE'
		});

		if (result.ok) {
			response.files = response.files.filter((file) => file.id !== fileId);
		} else {
			const payload = (await result.json().catch(() => null)) as { error?: string } | null;
			toast.set({
				type: 'error',
				title: 'file stayed put',
				message: payload?.error || 'delete did not complete.',
				duration: 5000
			});
		}

		deleting = '';
	}
</script>

<Toast />

<main class="app-page admin-page">
	<Topbar backHref={Routes.SETTINGS} backLabel="settings" title="admin files" label="storage" />

	<section class="metrics">
		<Panel title="active bytes" description={bytes_to_size(response.stats.uniqueActiveBytes)} />
		<Panel title="dedupe saved" description={bytes_to_size(response.stats.dedupeSavingsBytes)} />
		<Panel
			title="mongo storage"
			description={response.stats.mongo.storageSize === null
				? 'not reported'
				: bytes_to_size(response.stats.mongo.storageSize)}
		/>
	</section>

	<Panel title="inventory" description={`${response.total} files indexed`}>
		<div class="filter-row" aria-label="file filters">
			{#each filters as filter}
				<Button
					size="sm"
					variant={response.filter === filter ? 'primary' : 'secondary'}
					onclick={() => goto(`${Routes.ADMIN_FILES}?filter=${filter}`)}
				>
					{filter}
				</Button>
			{/each}
		</div>

		{#if response.files.length === 0}
			<EmptyState title="nothing matched" description="the selected filter returned no files." />
		{:else}
			<TableShell label="admin file table">
				<table>
					<thead>
						<tr>
							<th>Name</th>
							<th>Type</th>
							<th>Size</th>
							<th>Source</th>
							<th>Status</th>
							<th>Refs</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						{#each response.files as file (file.id)}
							<tr>
								<td>
									<strong>{file.name}</strong>
									<small>{file.sha256}</small>
								</td>
								<td>{file.type}</td>
								<td>{bytes_to_size(file.size)}</td>
								<td>{file.source}</td>
								<td>{file.status}</td>
								<td>{file.refCount}</td>
								<td>
									<Button
										variant="danger"
										size="sm"
										disabled={deleting === file.id}
										loading={deleting === file.id}
										onclick={() => removeFile(file.id)}
									>
										delete
									</Button>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</TableShell>
		{/if}
	</Panel>

	<Panel title="top users" description="largest active file totals">
		<div class="user-list">
			{#each response.stats.topUsers as user}
				<div class="user-row">
					<span>{user.username}</span>
					<strong>{bytes_to_size(user.usedBytes)}</strong>
				</div>
			{:else}
				<EmptyState title="no usage" description="no ranked users yet." />
			{/each}
		</div>
	</Panel>
</main>

<style>
	.admin-page {
		display: grid;
		gap: clamp(1rem, 3vw, 1.5rem);
	}

	.metrics {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 0.8rem;
		min-width: 0;
	}

	.filter-row {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-bottom: 1rem;
	}

	table {
		width: 100%;
		min-width: 48rem;
		border-collapse: collapse;
		text-align: left;
	}

	th,
	td {
		padding: 0.85rem;
		border-bottom: 1px solid var(--line);
		vertical-align: top;
	}

	th {
		color: var(--muted-strong);
		font-family: var(--font-mono);
		font-size: 0.66rem;
		font-weight: 400;
		letter-spacing: 0.12em;
		text-transform: uppercase;
	}

	td {
		color: var(--text-soft);
		font-family: var(--font-mono);
		font-size: 0.72rem;
	}

	td strong,
	td small {
		display: block;
		max-width: 22rem;
		overflow-wrap: anywhere;
	}

	td strong {
		color: var(--text);
		font-weight: 400;
	}

	td small {
		margin-top: 0.25rem;
		color: var(--muted);
		font-size: 0.62rem;
	}

	.user-list {
		display: grid;
		gap: 0.55rem;
	}

	.user-row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		min-width: 0;
		padding: 0.75rem;
		border: 1px solid var(--line);
		border-radius: var(--radius-md);
		background: rgba(8, 9, 11, 0.34);
		font-family: var(--font-mono);
	}

	.user-row span,
	.user-row strong {
		min-width: 0;
		overflow-wrap: anywhere;
		font-weight: 400;
	}

	.user-row strong {
		color: var(--signal);
	}

	@media (max-width: 52rem) {
		.metrics {
			grid-template-columns: 1fr;
		}
	}
</style>
