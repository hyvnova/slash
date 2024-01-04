import type { DefaultEventsMap } from '@socket.io/component-emitter';
import client, { Socket } from 'socket.io-client';
import toast from './stores/toast';

export let ws: Socket<DefaultEventsMap, DefaultEventsMap>;

ws = process.env.NODE_ENV === "production" ?
    client("https://slash-socket-server.ezsnova.repl.co/")
    :
    client("http://192.168.1.229:3001",)

ws.on("connect_error", (err) => {
    if (process.env.NODE_ENV !== "production"){ console.error(err); }
    toast.set({
        type: "error",
        title: "Connection Error",
        message: "Failed to connect to the server."
    })
})
