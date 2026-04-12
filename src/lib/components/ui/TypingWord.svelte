<script lang="ts">
	interface Props {
		text?: string;
	}

	let { text = 'typing' }: Props = $props();
	const letters = $derived([...text]);
</script>

<span class="typing-word" aria-label={text}>
	{#each letters as letter, index}
		<span style:animation-delay={`${index * 90}ms`}>{letter}</span>
	{/each}
</span>

<style>
	.typing-word {
		display: inline-flex;
		gap: 0.02rem;
		color: var(--signal);
		font-family: var(--font-mono);
		text-transform: uppercase;
	}

	span span {
		animation: typing-hop 0.72s ease-in-out infinite;
	}

	@keyframes typing-hop {
		0%,
		100% {
			transform: translateY(0);
		}
		45% {
			transform: translateY(-0.18rem);
		}
	}
</style>
