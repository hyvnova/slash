
import { writable, type Writable } from "svelte/store";

type MessageContextMenuType = Writable<null | {
    // Position in pixels
    x: string,
    y: string, 
    message_id: string,
    owned: boolean;
}>


const message_context_menu: MessageContextMenuType = writable(null);
export default message_context_menu;
