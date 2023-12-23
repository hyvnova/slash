import http from 'http';
import express from 'express';
import injectSocketIO from './socket_server.js'
import cors from 'cors';

const app = express();

// cors
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: '*',
    credentials: true,
    optionsSuccessStatus: 204,
}))

const server = http.createServer(app);

// Inject SocketIO
// @ts-ignore
injectSocketIO(server);


server.listen(3001, () => {
    console.log('listening on http://localhost:3001');
})