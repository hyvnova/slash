<script>
	import '@picocss/pico/css/pico.min.css';
	import './../app.css';

	import { fly } from 'svelte/transition';
	import { cubicIn, cubicOut } from 'svelte/easing';

	import { BarLoader } from 'svelte-loading-spinners';

	import { beforeNavigate, afterNavigate } from '$app/navigation';
	import user_config from '$lib/stores/user_config';
	import { is_window_focused } from '$lib/stores/window_focus';

	let isLoading = false;

	beforeNavigate(({ to }) => (isLoading = !!to?.route.id));
	afterNavigate(() => (isLoading = false));

	export let data;

	const duration = 300;
	const delay = duration + 100;
	const y = 10;

	const transitionIn = { easing: cubicOut, y, duration, delay };
	const transitionOut = { easing: cubicIn, y: -y, duration };
</script>

<svelte:window
	on:focus={() => is_window_focused.set(true)}
	on:blur={() => is_window_focused.set(false)}
/>

{#if isLoading}
	<BarLoader />
{/if}

{#key data.pathname}
	<div in:fly|global={transitionIn} out:fly|global={transitionOut}>
		<div
			style="
				font-family:{$user_config.font} !important; 
				font-size:{$user_config.font_size}px !important;
				background:{$user_config.background};
				color:{$user_config.color};
				"
		>
			<slot />
		</div>
	</div>
{/key}

<style>
	* {
		font-family: 'Noto Color Emoji', Arial, Helvetica, sans-serif;
		background: inherit;
		color: inherit;
	}
</style>
