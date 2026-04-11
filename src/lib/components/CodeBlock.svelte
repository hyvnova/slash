<script lang="ts">
	interface Props {
		language?: string;
		code: string;
	}

	let { language = 'text', code }: Props = $props();
</script>

<pre data-language={language}><code>{code}</code></pre>

<style>
	pre {
		position: relative;
		max-width: 100%;
		max-height: min(60dvh, 32rem);
		margin: 0;
		padding: 1rem;
		overflow: auto;
		background:
			linear-gradient(180deg, rgba(240, 232, 218, 0.012), transparent 38%), rgba(5, 6, 7, 0.68);
		color: var(--text-soft);
		font-family: var(--font-mono);
		font-size: 0.82rem;
		line-height: 1.5;
		tab-size: 2;
	}

	pre::before {
		content: attr(data-language);
		position: sticky;
		top: 0;
		float: right;
		margin-left: 1rem;
		color: var(--muted-strong);
		font-size: 0.62rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
	}

	code {
		white-space: pre-wrap;
		overflow-wrap: anywhere;
	}
</style>
