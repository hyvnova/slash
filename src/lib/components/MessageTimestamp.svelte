<script lang="ts">
	interface Props {
		timestamp: string;
	}

	let { timestamp }: Props = $props();
	const time = $derived(
		new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
	);
</script>

<time datetime={timestamp} title={`message timestamp: ${timestamp}`}>{time}</time>

<style>
	time {
		flex: 0 0 auto;
		color: var(--muted-strong);
		font-family: var(--font-mono);
		font-size: 0.62rem;
		letter-spacing: 0.06em;
		opacity: 0;
		transition: opacity var(--transition-fast);
	}

	:global(.message:hover) time,
	time:focus {
		opacity: 1;
	}

	@media (hover: none) {
		time {
			opacity: 0.72;
		}
	}
</style>
