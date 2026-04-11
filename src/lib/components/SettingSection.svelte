<script lang="ts">
	import Panel from '$lib/components/ui/Panel.svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		description: string;
		children?: Snippet;
	}

	let { title, description, children }: Props = $props();
</script>

<Panel {title} {description}>
	{@render children?.()}
</Panel>
