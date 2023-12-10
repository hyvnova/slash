<script lang="ts">
	import type { Writable } from 'svelte/store';

	export let is_hovered: Writable<boolean>;
	export let timestamp: string;
</script>

<div class="{$is_hovered ? '' : 'invisible'}">
	<!-- Metadata on right -->
	<div class="mx-3">
		<div class="flex justify-between items-center">
			<p class="text-gray-400 text-xs">{timestamp}</p>
		</div>
	</div>
</div>
