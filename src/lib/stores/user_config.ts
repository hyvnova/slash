import { writable } from 'svelte/store';
import { browser } from '$app/environment';


export const FONTS = [
    'Ubuntu',
    'Roboto',
    'Open Sans',
    'Writer',
    'Fira Code',
    'Fira Sans'
]


// channel_id : notification_config
type NotificationConfigType = {
    enabled: boolean,
    sound: boolean,
    vibrate: boolean,
};

type UserConfig = {
    font: typeof FONTS[number],
    font_size: number, // 12 - 24
    background: string // CSS valid background property
    color: string // CSS valid color property ,

    // Notication config - if null no notifications will be sent, otherwise it will be an array of notification configs. 
    notifications: {
        general: NotificationConfigType,
        custom: Record<string, NotificationConfigType> // {channel_id: notification_config}
    }
}


const default_value: UserConfig = {
    font: 'Ubuntu',
    font_size: 16,
    background: "#11191f",
    color: "whitesmoke",
    notifications: {
        general: {
            enabled: true,
            sound: true,
            vibrate: false,
        },
        custom: {}
    }
}

function load_config() {
    let config = default_value;
    if (browser && localStorage.getItem('user_config')) {
        config = JSON.parse(localStorage.getItem('user_config') || '') as UserConfig;
    }

    // Check for missing keys
    for (const key in default_value) {
        if (!(key in config)) {
            // @ts-ignore
            config[key] = default_value[key];
        }
    }

    return config;

}


const initial_value: UserConfig = load_config();
const user_config = writable(initial_value);

user_config.subscribe((value) => {
    if (browser) {
        localStorage.setItem('user_config', JSON.stringify(value));
    }
});

export default user_config;