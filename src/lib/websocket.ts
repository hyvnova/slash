import client from 'socket.io-client';
const ENDPOINT = 'http://localhost:3000/';

export const ws = client(ENDPOINT);