<script lang="ts">
	import { onMount } from "svelte";

    let notification_supported = false;

    onMount(() => {
		if (!("Notification" in window)) {
			alert("This browser does not support desktop notification");
		} else if (Notification.permission === "granted") {
			notification_supported = true;
		} else if (Notification.permission !== "denied") {
			Notification.requestPermission().then((permission) => {
				if (permission === "granted") {
					notification_supported = true;
				}
			});
		}
	});

	function notify() {
		if (!notification_supported) {
			alert("This browser does not support desktop notification");
		} else {
			new Notification("Hi there!");
		}
	}
</script>


<main
 class="container flex flex-col h-screen mx-auto p-4 justify-center items-center"
 >
	<button
	class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
	 on:click={notify}
	>
		Notification
	</button>

</main>
