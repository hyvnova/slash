<script lang="ts">
	import toast from '$lib/stores/toast';

	$effect(() => {
		if (!$toast?.duration) return;
		const timer = window.setTimeout(() => toast.set(null), $toast.duration);
		return () => window.clearTimeout(timer);
	});
</script>

{#if $toast}
	<section class={`toast toast-${$toast.type}`} role="status" aria-live="polite">
		<p class="toast-title">{$toast.title}</p>
		<p class="toast-message">{$toast.message}</p>
	</section>
{/if}

<style>
	.toast {
		position: fixed;
		top: calc(var(--safe-top) + 1rem);
		left: 50%;
		z-index: 300;
		width: min(calc(100vw - 2rem), 30rem);
		padding: 0.9rem 1rem;
		border: 1px solid var(--line);
		border-radius: var(--radius-md);
		background:
			linear-gradient(135deg, rgba(199, 156, 87, 0.08), transparent 44%), rgba(8, 9, 11, 0.95);
		box-shadow: var(--shadow-card);
		transform: translateX(-50%);
	}

	.toast-error {
		border-color: rgba(182, 106, 72, 0.52);
	}

	.toast-info {
		border-color: rgba(121, 166, 163, 0.42);
	}

	.toast-title,
	.toast-message {
		margin: 0;
		text-align: center;
	}

	.toast-title {
		color: var(--text);
		font-size: 1.05rem;
		letter-spacing: 0;
	}

	.toast-message {
		margin-top: 0.25rem;
		color: var(--muted);
		font-family: var(--font-mono);
		font-size: 0.72rem;
		line-height: 1.45;
	}
</style>
