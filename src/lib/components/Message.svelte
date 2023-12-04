<script lang="ts">
	import type { MessageType } from "$lib/types";

    export let username: string;
    export let message: MessageType;

    const owned = username === message.author; // Person who sent the message -> perspective of massage bubble
</script>

<div class="bubble flex flex-col items-start break-words rounded-xl p-2 mb-2 w-fit
    border-gray-700
    hover:bg-gray-800
    {owned ? 'owned' : ''}
"
>
    <div class="flex flex-col items-start">
        <p class="text-gray-200 text-base">{message.content}</p>
    </div>
</div>


<style lang="postcss">
    .bubble {
        border: 2px solid theme(colors.gray.700);
        border-bottom-left-radius: 0;
    }

    .owned {
        align-self: flex-end;
        background-color: theme(colors.gray.700 );
        border: 2px solid theme(colors.gray.700);
        border-bottom-left-radius: 0.75em;
        border-bottom-right-radius: 0;
    }
    .owned:hover {
        background-color: theme(colors.gray.800);
    }
</style>