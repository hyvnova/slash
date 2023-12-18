import http from 'http';
import express from 'express';
import injectSocketIO from './socket_server.js';
const app = express();
const server = http.createServer(app);
// Inject SocketIO
// @ts-ignore
injectSocketIO(server);
// SvelteKit handlers
server.listen(3000, () => {
    console.log('Running on http://localhost:3000');
});
