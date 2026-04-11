<script lang="ts">
	import { onMount } from 'svelte';
	import type { Writable } from 'svelte/store';
	import RequestItem from './RequestItem.svelte';
	import IconButton from '$lib/components/ui/IconButton.svelte';
	import Modal from '$lib/components/ui/Modal.svelte';

	interface Props {
		requests: Writable<string[]>;
		friends: Writable<string[]>;
		username: string;
	}

	let { requests, friends, username }: Props = $props();
	let modal_open = $state(false);

	function remove_request(value: string) {
		requests.update((items) => items.filter((request) => request !== value));
	}

	function add_friend(value: string) {
		friends.update((items) => [value, ...items]);
	}

	onMount(() => {
		const handler = (event: KeyboardEvent) => {
			if (event.key === 'Escape') modal_open = false;
		};
		window.addEventListener('keydown', handler);
		return () => window.removeEventListener('keydown', handler);
	});
</script>

<IconButton icon="user-plus" label="pending requests" onclick={() => (modal_open = true)} />

<Modal open={modal_open} title="pending requests" onclose={() => (modal_open = false)}>
	<ol class="request-list">
		{#each $requests as requester}
			<RequestItem {username} {requester} {remove_request} {add_friend} />
		{/each}
	</ol>
</Modal>

<style>
	.request-list {
		display: grid;
		gap: 0.55rem;
		margin: 0;
		padding: 0;
		list-style: none;
	}
</style>
