import { get, writable, type Writable } from "svelte/store";
import { is_window_focused } from "./stores/window_focus";


export function handle_notication(value: () => Notification) {
    /**
     * * Handles what to do before a notification is created (sent)
     * * Already has permission to send notifications
     * * Checks if the window is focused, if not, it creates the notification
     */

    if (!value) return;

    // Check if the window is not focused
    if (get(is_window_focused)) return;

    // Create the notification
    value();
};

