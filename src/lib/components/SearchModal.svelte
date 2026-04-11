<script lang="ts">
	import { onMount } from 'svelte';
	import type { Writable } from 'svelte/store';
	import AvatarImage from './AvatarImage.svelte';
	import RelationshipButton from './RelationshipButton.svelte';
	import EmptyState from '$lib/components/ui/EmptyState.svelte';
	import IconButton from '$lib/components/ui/IconButton.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';
	import { search_users } from '$lib/api_shortcuts';
	import type { UserSearchResult, UserType } from '$lib/types';

	interface Props {
		modal_open: Writable<boolean>;
		user: UserType;
		remove_friend: (username: string) => void;
	}

	let { modal_open, user, remove_friend }: Props = $props();
	let query = $state('');
	let results = $state<UserSearchResult[]>([]);
	let searching = $state(false);
	let searchId = 0;

	async function make_search() {
		const current = ++searchId;
		const value = query.trim();

		if (!value) {
			results = [];
			return;
		}

		searching = true;
		const next = await search_users(value, user);
		if (current === searchId) {
			results = next;
			searching = false;
		}
	}

	onMount(() => {
		const handler = (event: KeyboardEvent) => {
			if (event.key === 'Escape') modal_open.set(false);
		};

		window.addEventListener('keydown', handler);
		return () => window.removeEventListener('keydown', handler);
	});
</script>

<IconButton icon="search" label="search people" onclick={() => modal_open.set(true)} />

<Modal open={$modal_open} title="find a signal" onclose={() => modal_open.set(false)}>
	<div class="search-panel">
		<Input
			label="handle"
			type="search"
			placeholder="search by handle"
			bind:value={query}
			oninput={make_search}
			autocomplete="off"
			autofocus
		/>

		<div class="results" aria-busy={searching}>
			{#if query.trim() && results.length === 0 && !searching}
				<EmptyState title="nothing at these coordinates" />
			{:else}
				{#each results as result (result.username)}
					<article class="result-row">
						<AvatarImage username={result.username} size={38} />
						<span>{result.username}</span>
						<RelationshipButton
							username={user.username}
							friendship={result.friendship}
							other_user={result.username}
							{remove_friend}
						/>
					</article>
				{/each}
			{/if}
		</div>
	</div>
</Modal>

<style>
	.search-panel {
		display: grid;
		gap: 1rem;
	}

	.results {
		display: grid;
		gap: 0.45rem;
		min-height: 6rem;
	}

	.results[aria-busy='true']::before {
		content: 'resolving';
		padding: 1rem;
		color: var(--muted);
		font-family: var(--font-mono);
		font-size: 0.72rem;
		letter-spacing: 0.12em;
		text-align: center;
		text-transform: uppercase;
	}

	.result-row {
		display: grid;
		grid-template-columns: auto minmax(0, 1fr) auto;
		align-items: center;
		gap: 0.75rem;
		padding: 0.65rem;
		border: 1px solid var(--line);
		border-radius: var(--radius-md);
		background: rgba(8, 9, 11, 0.34);
	}

	.result-row span {
		min-width: 0;
		overflow: hidden;
		color: var(--text);
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	@media (max-width: 34rem) {
		.result-row {
			grid-template-columns: auto minmax(0, 1fr);
		}

		.result-row :global(.ui-button),
		.result-row :global(button) {
			grid-column: 1 / -1;
			width: 100%;
		}
	}
</style>
