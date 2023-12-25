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

type UserConfig = {
    font: 'Ubuntu' | 'Roboto' | 'Open Sans' | 'Writer' | 'Fira Code' | 'Fira Sans',
    font_size: number, // 12 - 24
    background: string // CSS valid background property
    color: string // CSS valid color property 
}


const default_value: UserConfig = {
    font: 'Ubuntu',
    font_size: 16,
    background: "#11191f",
    color: "whitesmoke"
}

const initial_value: UserConfig = browser ? JSON.parse(localStorage.getItem('user_config') || JSON.stringify(default_value))  : default_value;
const user_config = writable(initial_value);

user_config.subscribe((value) => {
    if (browser) {
        localStorage.setItem('user_config', JSON.stringify(value));
    }
});

export default user_config;