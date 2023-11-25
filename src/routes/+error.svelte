<script lang="ts">
	import { page } from '$app/stores';
	import { faHome } from '@fortawesome/free-solid-svg-icons';
	import Fa from 'svelte-fa';
</script>


<svelte:head>
    <title> Oops! Something went wrong</title>
    <meta:og title="Slash chat" />
    <meta:og description="Error while loading chat page" />

</svelte:head>



<main class="container flex flex-col items-center justify-center">
    <h1 class="text-2xl">{$page.error?.message}</h1>
</main>