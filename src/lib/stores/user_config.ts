import { writable } from 'svelte/store';
import { browser } from '$app/environment';



type UserConfig = {
    font: 'Ubuntu' | 'Roboto' | 'Open Sans' | 'Writer' | 'Fira Code' | 'Fira Sans',
    font_size: number, // 12 - 24
    background: {
        type: 'color' | 'image',
        value: string,
        opacity?: number
        brightness?: number
    }
}


const default_value: UserConfig = {
    font: 'Ubuntu',
    font_size: 16,
    background: {
        type: 'color',
        value: 'transparent'
    }
}

const initial_value: UserConfig = browser ? JSON.parse(localStorage.getItem('user_config') || JSON.stringify(default_value))  : default_value;
const user_config = writable(initial_value);

user_config.subscribe((value) => {
    if (browser) {
        localStorage.setItem('user_config', JSON.stringify(value));
    }
});

export default user_config;