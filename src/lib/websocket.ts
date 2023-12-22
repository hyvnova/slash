import client from 'socket.io-client';

export const ws = process.env.NODE_ENV === "production" ? client("https://slash-socket-server.ezsnova.repl.co/") : client("http://localhost:3001") 