import type { NotificationType } from "$lib/types";
import { writable } from "svelte/store";


const notification: NotificationType = writable(null);
export default notification;
