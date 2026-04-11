<script lang="ts">
	import Icon from '$lib/components/ui/Icon.svelte';

	let pos = $state({ x: 0, y: 0 });
	let menu = $state({ w: 0, h: 0 });
	let is_open = $state(false);

	function rightClickContextMenu(event: MouseEvent) {
		event.preventDefault();
		is_open = true;

		pos = {
			x: event.clientX,
			y: event.clientY
		};

		// Keep the menu inside the viewport even on narrow mobile emulation.
		if (window.innerHeight - pos.y < menu.h) pos.y = Math.max(8, pos.y - menu.h);
		if (window.innerWidth - pos.x < menu.w) pos.x = Math.max(8, pos.x - menu.w);
	}

	function closeContextMenu() {
		is_open = false;
	}

	function getContextMenuDimension(node: HTMLElement) {
		menu = {
			w: node.offsetWidth,
			h: node.offsetHeight
		};
	}
</script>

{#if is_open}
	<nav
		class="message-menu"
		use:getContextMenuDimension
		style:top={`${pos.y}px`}
		style:left={`${pos.x}px`}
		aria-label="message actions"
	>
		<button type="button">
			<Icon name="edit" />
			<span>edit</span>
		</button>
		<button type="button" class="danger">
			<Icon name="trash" />
			<span>delete</span>
		</button>
	</nav>
{/if}

<svelte:window oncontextmenu={rightClickContextMenu} onclick={closeContextMenu} />

<style>
	.message-menu {
		position: fixed;
		z-index: var(--z-overlay);
		display: grid;
		gap: 0.2rem;
		min-width: 9rem;
		padding: 0.35rem;
		border: 1px solid var(--line);
		border-radius: var(--radius-md);
		background: var(--bg-elev);
		box-shadow: var(--shadow-card);
	}

	button {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		width: 100%;
		min-height: 2.35rem;
		border: 0;
		border-radius: var(--radius-sm);
		background: transparent;
		color: var(--text-soft);
		font-family: var(--font-mono);
		font-size: 0.72rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		cursor: pointer;
	}

	button:hover {
		background: rgba(121, 166, 163, 0.08);
		color: var(--text);
	}

	.danger:hover {
		background: rgba(182, 106, 72, 0.12);
		color: var(--status-fail);
	}
</style>
