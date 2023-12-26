import type { DefaultEventsMap } from '@socket.io/component-emitter';
import client, { Socket } from 'socket.io-client';
import notification from './stores/notification';

export let ws: Socket<DefaultEventsMap, DefaultEventsMap>;

try {
    ws = process.env.NODE_ENV === "production" ? 
        client("https://slash-socket-server.ezsnova.repl.co/") 
        : 
        client("http://localhost:3001")
}
catch(err) {
    console.error("Failed to connect to the socket server.");
    notification.set({
        type: "error",
        title: "Connection Error",
        message: "Failed to connect to the server."
    })
}