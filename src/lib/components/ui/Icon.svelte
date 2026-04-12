<script lang="ts">
	export type IconName =
		| 'arrow-left'
		| 'check'
		| 'close'
		| 'copy'
		| 'archive'
		| 'code'
		| 'download'
		| 'edit'
		| 'expand'
		| 'file'
		| 'font'
		| 'home'
		| 'paperclip'
		| 'pdf'
		| 'reset'
		| 'send'
		| 'search'
		| 'settings'
		| 'shield'
		| 'spinner'
		| 'table'
		| 'trash'
		| 'user-plus'
		| 'warn'
		| 'zoom-in'
		| 'zoom-out';

	interface Props {
		name: IconName;
		size?: number;
		label?: string;
		class?: string;
	}

	let { name, size = 18, label = '', class: className = '' }: Props = $props();
</script>

<svg
	class={`ui-icon ${className}`}
	width={size}
	height={size}
	viewBox="0 0 24 24"
	fill="none"
	stroke="currentColor"
	stroke-width="1.8"
	stroke-linecap="round"
	stroke-linejoin="round"
	aria-hidden={label ? undefined : 'true'}
	aria-label={label || undefined}
>
	{#if name === 'arrow-left'}
		<path d="M19 12H5" />
		<path d="m12 19-7-7 7-7" />
	{:else if name === 'check'}
		<path d="m5 12 4 4L19 6" />
	{:else if name === 'close'}
		<path d="M18 6 6 18" />
		<path d="m6 6 12 12" />
	{:else if name === 'copy'}
		<rect x="8" y="8" width="11" height="11" rx="2" />
		<path d="M5 15H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v1" />
	{:else if name === 'archive'}
		<path d="M4 7h16" />
		<path d="M6 7v13h12V7" />
		<path d="M8 3h8l2 4H6Z" />
		<path d="M12 10v7" />
		<path d="M10.5 12h3" />
	{:else if name === 'code'}
		<path d="m8 8-4 4 4 4" />
		<path d="m16 8 4 4-4 4" />
		<path d="m14 4-4 16" />
	{:else if name === 'download'}
		<path d="M12 3v11" />
		<path d="m7 10 5 5 5-5" />
		<path d="M5 21h14" />
	{:else if name === 'edit'}
		<path d="M12 20h9" />
		<path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
	{:else if name === 'expand'}
		<path d="M8 3H3v5" />
		<path d="M16 3h5v5" />
		<path d="M21 16v5h-5" />
		<path d="M3 16v5h5" />
		<path d="m3 3 7 7" />
		<path d="m21 3-7 7" />
		<path d="m21 21-7-7" />
		<path d="m3 21 7-7" />
	{:else if name === 'file'}
		<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9Z" />
		<path d="M14 3v6h6" />
	{:else if name === 'font'}
		<path d="M4 19 10 5h4l6 14" />
		<path d="M7 14h10" />
		<path d="M9 19h6" />
	{:else if name === 'home'}
		<path d="m3 11 9-8 9 8" />
		<path d="M5 10v10h14V10" />
	{:else if name === 'paperclip'}
		<path d="m21 12-8.5 8.5a5 5 0 0 1-7-7L14 5a3.2 3.2 0 0 1 4.5 4.5L10 18a1.4 1.4 0 0 1-2-2l8-8" />
	{:else if name === 'pdf'}
		<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9Z" />
		<path d="M14 3v6h6" />
		<path d="M7 15h1.5a1.5 1.5 0 0 0 0-3H7v5" />
		<path d="M12 12v5h1a2.5 2.5 0 0 0 0-5Z" />
		<path d="M17 17v-5h3" />
		<path d="M17 14h2" />
	{:else if name === 'reset'}
		<path d="M4 12a8 8 0 1 0 2.35-5.65" />
		<path d="M4 4v6h6" />
	{:else if name === 'send'}
		<path d="m22 2-7 20-4-9-9-4Z" />
		<path d="M22 2 11 13" />
	{:else if name === 'search'}
		<circle cx="11" cy="11" r="7" />
		<path d="m21 21-4.3-4.3" />
	{:else if name === 'settings'}
		<circle cx="12" cy="12" r="3" />
		<path d="M12 2v3" />
		<path d="M12 19v3" />
		<path d="m4.9 4.9 2.1 2.1" />
		<path d="m17 17 2.1 2.1" />
		<path d="M2 12h3" />
		<path d="M19 12h3" />
		<path d="m4.9 19.1 2.1-2.1" />
		<path d="m17 7 2.1-2.1" />
	{:else if name === 'shield'}
		<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
	{:else if name === 'spinner'}
		<path d="M21 12a9 9 0 0 1-9 9" />
		<path d="M3 12a9 9 0 0 1 9-9" />
	{:else if name === 'table'}
		<rect x="3" y="5" width="18" height="14" rx="2" />
		<path d="M3 10h18" />
		<path d="M9 5v14" />
		<path d="M15 5v14" />
	{:else if name === 'trash'}
		<path d="M3 6h18" />
		<path d="M8 6V4h8v2" />
		<path d="M19 6 18 21H6L5 6" />
	{:else if name === 'user-plus'}
		<path d="M15 19a6 6 0 0 0-12 0" />
		<circle cx="9" cy="8" r="4" />
		<path d="M19 8v6" />
		<path d="M16 11h6" />
	{:else if name === 'warn'}
		<path d="M12 9v4" />
		<path d="M12 17h.01" />
		<path d="M10.3 3.9 2.5 18a2 2 0 0 0 1.7 3h15.6a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
	{:else if name === 'zoom-in'}
		<circle cx="11" cy="11" r="7" />
		<path d="m21 21-4.3-4.3" />
		<path d="M11 8v6" />
		<path d="M8 11h6" />
	{:else if name === 'zoom-out'}
		<circle cx="11" cy="11" r="7" />
		<path d="m21 21-4.3-4.3" />
		<path d="M8 11h6" />
	{/if}
</svg>

<style>
	.ui-icon {
		display: inline-block;
		flex: 0 0 auto;
	}
</style>
