import user_config from "$lib/stores/user_config";
import { get } from "svelte/store";
import type { PageLoad } from "./$types";

function create_notification_config(chat_id: string) {
    user_config.update((config) => {
        if (config.notifications === null) {
            config.notifications = {
                general: {
                    sound: false,
                    vibrate: false,
                    enabled: false
                },
                custom: {}
            };
        }

        if (config.notifications.custom[chat_id] === undefined) {
            config.notifications.custom[chat_id] = {
                sound: true,
                vibrate: false,
                enabled: true
            };
        }

        return config;
    });
}


export const load: PageLoad = async ({ params }) => {
    let chat_id = params.id;

    // Create notification config if it doesn't exist
    if (get(user_config).notifications === null || get(user_config).notifications?.custom[chat_id] === undefined) {
        create_notification_config(chat_id);
    }
    return {
        chat_id
    }
}