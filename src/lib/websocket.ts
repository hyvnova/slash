import client from 'socket.io-client';

export const ws = process.env.NODE_ENV === "production" ? client("http://localhost:3001") : client();