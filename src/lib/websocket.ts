import { writable } from "svelte/store";
import client from 'socket.io-client';

export const ws = writable(client('http://localhost:3000'));