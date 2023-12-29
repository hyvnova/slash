<script>
	// @ts-nocheck

	/**
	* TODO: Finish message context menu
	* * Doesn't open at click location
	* * Is not linked to a message 
	*/

	import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';

    // pos is cursor position when right click occur
    let pos = { x: 0, y: 0 }
    // menu is dimension (height and width) of context menu
    let menu = { h: 0, y: 0 }
    // browser/window dimension (height and width)
    let browser = { h: 0, y: 0 }
    // showMenu is state of context-menu visibility
    let is_open = false;
    // to display some text
    let content;

    function rightClickContextMenu(e){
        is_open = true
        browser = {
            w: window.innerWidth,
            h: window.innerHeight
        };
        pos = {
            x: e.clientX,
            y: e.clientY
        };
        // If bottom part of context menu will be displayed
        // after right-click, then change the position of the
        // context menu. This position is controlled by `top` and `left`
        // at inline style. 
        // Instead of context menu is displayed from top left of cursor position
        // when right-click occur, it will be displayed from bottom left.
        if (browser.h -  pos.y < menu.h)
            pos.y = pos.y - menu.h
        if (browser.w -  pos.x < menu.w)
            pos.x = pos.x - menu.w
    }
    function onPageClick(e){
        // To make context menu disappear when
        // mouse is clicked outside context menu
        is_open = false;
    }
	function getContextMenuDimension(node) {
		// This function will get context menu dimension
		// when navigation is shown => showMenu = true
		let height = node.offsetHeight;
		let width = node.offsetWidth;
		menu = {
			h: height,
			w: width
		};
	}
</script>

{#if is_open}
	<nav use:getContextMenuDimension style="position: absolute; top:{pos.y}px; left:{pos.x}px">
		<ul class="flex flex-col border w-auto h-auto">
			<!-- Edit message -->
			<li class="flex p-1 w-full">
				<button class="inline-flex items-center px-2 py-1 rounded-md text-gray-100">
					<Fa icon={faEdit} class="text-gray-100" />
					Edit
				</button>
			</li>

			<!-- Delete message -->
			<li class="flex p-1 w-full">
				<button class="inline-flex items-center px-2 py-1 rounded-md text-gray-100">
					<Fa icon={faTrash} class="text-gray-100" />
					Delete
				</button>
			</li>
		</ul>
	</nav>
{/if}

<svelte:window on:contextmenu|preventDefault={rightClickContextMenu} on:click={onPageClick} />
