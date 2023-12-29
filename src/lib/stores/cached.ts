import { writable } from "svelte/store";

export const cached = writable<Record<string, string>>({});