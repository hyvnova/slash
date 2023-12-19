<script lang="ts">
	import { FileLoadState } from "$lib/types";
	import { faExclamationTriangle, faSpinner } from "@fortawesome/free-solid-svg-icons";
	import Fa from "svelte-fa";
	import type { Writable } from "svelte/store";

    export let state: Writable<FileLoadState>;
</script>

{#if $state == FileLoadState.LOADING}
    <div class="flex items-center justify-center h-full">
        <Fa icon={faSpinner} class="text-gray-300 animate-spin mr-2" />
        <span class="text-sm text-gray-300">Loading file...</span>
    </div>
{:else if $state == FileLoadState.FAILED}
    <div class="flex items-center justify-center h-full">
        <Fa icon={faExclamationTriangle} class="text-yellow-500 mr-2" />
        <span class="text-sm text-gray-300">Failed to load file</span>
    </div>

{:else}
   <slot />
{/if}
