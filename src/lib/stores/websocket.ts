import client from 'socket.io-client';
import { readable } from 'svelte/store';

export const socket = readable(client());