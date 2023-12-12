<script lang="ts">

	export let timestamp: string;
	let time = new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
</script>

<!-- Metadata on right -->
<div class="mx-3"
	title="Message timestamp: {timestamp}"
>
	<div class="flex justify-between items-center">
		<p class="text-gray-400 text-xs">{time}</p>
	</div>
</div>
