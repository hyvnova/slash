import http from 'http';
import express from 'express';
import injectSocketIO from './socketIoHandler.js';
import { handler } from '../build/handler.js'

const app = express();
const server = http.createServer(app);

// Inject SocketIO
injectSocketIO(server);

// SvelteKit handlers
app.use(handler)

server.listen(3000, () => {
    // close server with q 
    if (process.stdin.isTTY) {
        process.stdin.setRawMode(true);
        process.stdin.resume();
        process.stdin.setEncoding('utf8');
        process.stdin.on('data', (key) => {
            if (key === 'q') {
                console.log('Closing server');
                process.exit();
            }
        });
    }

    console.log('Server listening on port 3000');
});