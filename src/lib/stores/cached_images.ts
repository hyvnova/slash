import { writable } from "svelte/store";

export const cached_images = writable<Record<string, string>>({});