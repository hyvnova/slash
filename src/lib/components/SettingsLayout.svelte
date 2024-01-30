<script lang="ts">
    export let title: string = 'Settings';
</script>

<main class="
        container 
        flex flex-col justify-center items-center 
        w-screen h-full max-w-3xl 
        mt-4 
    "
>
	<h1 class="text-4xl text-gray-200 mb-4">{title}</h1>
    <hr />

    <slot />
</main>