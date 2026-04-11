<script lang="ts">
	type StatusName = 'ok' | 'pend' | 'warn' | 'fail' | 'online' | 'offline' | 'typing';

	interface Props {
		status?: StatusName | string;
		pulse?: boolean;
		size?: number;
		class?: string;
	}

	let { status = 'pend', pulse = true, size = 7, class: className = '' }: Props = $props();

	const color = $derived(
		status === 'ok' || status === 'online'
			? 'var(--status-ok)'
			: status === 'typing'
				? 'var(--signal)'
				: status === 'warn'
					? 'var(--status-warn)'
					: status === 'fail'
						? 'var(--status-fail)'
						: 'var(--status-pend)'
	);
</script>

<span
	class={`ui-status-dot ${pulse ? 'pulse' : ''} ${className}`}
	style:width={`${size}px`}
	style:height={`${size}px`}
	style:background-color={color}
	aria-label={`${status} status`}
></span>

<style>
	.ui-status-dot {
		display: inline-block;
		flex: 0 0 auto;
		border-radius: 999px;
	}

	.pulse {
		animation: pulse-dot 1.8s ease-in-out infinite;
	}
</style>
