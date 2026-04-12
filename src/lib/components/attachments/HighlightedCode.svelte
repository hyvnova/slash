<script lang="ts">
	import type { CodeLanguage } from './attachment-utils';

	type Token = {
		text: string;
		type?: string;
	};

	interface Props {
		code: string;
		language: CodeLanguage;
		maxHeight?: string;
	}

	let { code, language, maxHeight = 'min(60dvh, 32rem)' }: Props = $props();
	let tokens = $state<Token[]>([]);
	let pending = $state(false);

	$effect(() => {
		let cancelled = false;
		pending = true;

		import('@speed-highlight/core')
			.then(async ({ tokenize }) => {
				const next: Token[] = [];
				await tokenize(code, language, (text, type) => next.push({ text, type }));
				if (!cancelled) tokens = next;
			})
			.catch(() => {
				if (!cancelled) tokens = [{ text: code }];
			})
			.finally(() => {
				if (!cancelled) pending = false;
			});

		return () => {
			cancelled = true;
		};
	});
</script>

<pre data-language={language} style:max-height={maxHeight}>{#if pending && tokens.length === 0}<code
			>{code}</code
		>{:else}<code
			>{#each tokens as token}<span class={token.type ? `tok tok-${token.type}` : 'tok'}
					>{token.text}</span
				>{/each}</code
		>{/if}</pre>

<style>
	pre {
		position: relative;
		max-width: 100%;
		margin: 0;
		padding: 1rem;
		overflow: auto;
		background:
			linear-gradient(180deg, rgba(240, 232, 218, 0.014), transparent 36%), rgba(5, 6, 7, 0.72);
		color: var(--text-soft);
		font-family: var(--font-mono);
		font-size: 0.82rem;
		line-height: 1.52;
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

	.tok-cmnt {
		color: #7e8d82;
	}

	.tok-kwd,
	.tok-oper {
		color: #e0b76b;
	}

	.tok-str,
	.tok-esc {
		color: #91b8ae;
	}

	.tok-num,
	.tok-bool {
		color: #d49178;
	}

	.tok-func,
	.tok-section {
		color: #d8d0bf;
	}

	.tok-class,
	.tok-type {
		color: #b8c989;
	}

	.tok-var {
		color: #aeb9c6;
	}

	.tok-err,
	.tok-deleted {
		color: var(--status-fail);
	}

	.tok-insert {
		color: var(--status-ok);
	}
</style>
