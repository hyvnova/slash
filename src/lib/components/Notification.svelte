<script lang="ts">
	import notification from "$lib/stores/notification";

	/**
	 * A general porpuse notification.
	 * Position: top center
	 */

	let card_styles = {
		error: 'bg-black border border-red-400 text-red-700',
		info: 'bg-black border border-blue-400 text-blue-700',
	};


    $: if ($notification?.duration) {
        setTimeout(() => {
            notification.set(null);
        }, $notification.duration);
    }
</script>

{#if $notification}
	<div class="w-10/12 relative top-0 left-0 flex flex-col justify-center items-center p-2 m-4 rounded-lg z-50 {card_styles[$notification.type]}">
        <h3>{$notification.title}</h3>
        <p>{$notification.message}</p>        
    </div>
{/if}
