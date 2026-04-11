<script lang="ts">
	interface Props {
		src?: string;
		name: string;
		size?: number;
		class?: string;
	}

	let { src, name, size = 40, class: className = '' }: Props = $props();
	const initials = $derived(name.slice(0, 2).toUpperCase());
</script>

<span
	class={`ui-avatar ${className}`}
	style:width={`${size}px`}
	style:height={`${size}px`}
	style:font-size={`${Math.max(11, size * 0.34)}px`}
>
	{#if src}
		<img {src} alt={`${name}'s avatar`} loading="lazy" />
	{:else}
		<span>{initials}</span>
	{/if}
</span>

<style>
	.ui-avatar {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		flex: 0 0 auto;
		border: 1px solid var(--line);
		border-radius: 999px;
		background: linear-gradient(135deg, rgba(199, 156, 87, 0.1), transparent 58%), var(--bg-elev);
		color: var(--muted);
		font-family: var(--font-mono);
		letter-spacing: 0.05em;
	}

	img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}
</style>
