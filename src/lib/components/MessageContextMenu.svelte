<script lang="ts">
	import type { Writable } from "svelte/store";
    export let is_open: Writable<boolean>;
    export let pos: Writable<{x: number, y: number}>;
</script>


<!-- svelte-ignore a11y-no-static-element-interactions -->
{#if $is_open}
<div 
    class="absolute top z-10 w-3/12 h-auto context-menu">
    style="left: {$pos.x}px; top: {$pos.y}px;"

    <div class="relative flex flex-col rounded-lg bg-gray-900 border-gray-700"
        on:mouseleave={() => {
            is_open.set(false);
        }}
    >
        <div class="bg-gray-800 border-b border-gray-700 p-2">
            <p class="text-gray-300 text-sm">Message Context Menu</p>
        </div>
    </div>
</div>
{/if}


<style>
  .context-menu {
    display: none;
    /* other styles... */
  }
  .context-menu[open] {
    display: block;
  }
</style>