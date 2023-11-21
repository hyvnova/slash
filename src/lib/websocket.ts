import { get } from "svelte/store";
import { socket } from "./stores/websocket";

export const ws = get(socket);