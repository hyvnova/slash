<script lang="ts">
	import AvatarImage from './AvatarImage.svelte';
	import Icon from '$lib/components/ui/Icon.svelte';
	import { Routes } from '$lib/types';

	interface Props {
		username: string;
		verified: boolean;
	}

	let { username, verified }: Props = $props();
</script>

<footer class="account-rail">
	<a href="{Routes.PROFILE}/{username}" class="account-card" title="profile">
		<AvatarImage {username} size={34} />
		<span>{username}</span>
		{#if verified}<Icon name="shield" size={15} class="verified" />{/if}
	</a>
</footer>

<style>
	.account-rail {
		position: fixed;
		right: 0;
		bottom: 0;
		left: 0;
		z-index: 20;
		display: flex;
		justify-content: center;
		padding: 0.75rem var(--shell-pad) calc(0.75rem + var(--safe-bottom));
		pointer-events: none;
	}

	.account-card {
		width: min(100%, 32rem);
		display: flex;
		align-items: center;
		gap: 0.7rem;
		padding: 0.55rem 0.7rem;
		border: 1px solid var(--line);
		border-radius: var(--radius-md);
		background:
			linear-gradient(90deg, rgba(199, 156, 87, 0.08), transparent 70%), rgba(8, 9, 11, 0.9);
		box-shadow: var(--shadow-card);
		pointer-events: auto;
	}

	span {
		min-width: 0;
		overflow: hidden;
		color: var(--text-soft);
		font-family: var(--font-mono);
		font-size: 0.82rem;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	:global(.verified) {
		margin-left: auto;
		color: var(--signal);
	}
</style>
