<script lang="ts">
	import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
	import type { Writable } from 'svelte/store';
	export let is_open: Writable<boolean>;
	export let owned: boolean;

	let pos = { x: 0, y: 0 };
	let menu = { h: 0, y: 0 };
	let browser = { h: 0, y: 0 };
	let showMenu = false;
	let content: HTMLDivElement;

	function rightClickContextMenu(e: { clientX: any; clientY: any }) {
		showMenu = true;
		browser = {
			w: window.innerWidth,
			h: window.innerHeight
		};
		pos = {
			x: e.clientX,
			y: e.clientY
		};

		if (browser.h - pos.y < menu.h) pos.y = pos.y - menu.h;
		if (browser.w - pos.x < menu.w) pos.x = pos.x - menu.w;
	}
	function onPageClick(e: any) {
		showMenu = false;
	}
	function getContextMenuDimension(node: HTMLElement) {
		let height = node.offsetHeight;
		let width = node.offsetWidth;
		menu = {
			h: height,
			w: width
		};
	}

</script>

{#if showMenu}
	<nav use:getContextMenuDimension style="position: absolute; top:{pos.y}px; left:{pos.x}px">
		<ul class="flex flex-col border w-auto h-auto">
			<!-- Edit message -->
			<li class="flex p-1 w-full">
				<button
                    class="inline-flex items-center px-2 py-1 rounded-md  text-gray-100"
                >
					<Fa icon={faEdit} class="text-gray-100" />
					Edit
				</button>
			</li>

			<!-- Delete message -->
			<li class="flex p-1 w-full">
				<button
                    class="inline-flex items-center px-2 py-1 rounded-md  text-gray-100"
                >
					<Fa icon={faTrash} class="text-gray-100" />
					Delete
				</button>
			</li>
		</ul>
	</nav>
{/if}

<svelte:window on:contextmenu|preventDefault={rightClickContextMenu} on:click={onPageClick} />
