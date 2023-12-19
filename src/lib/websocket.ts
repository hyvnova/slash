import client from 'socket.io-client';



export const ws = process.env.NODE_ENV === 'production' ?
                client()  // If in production
                :
                client(); // If in development
