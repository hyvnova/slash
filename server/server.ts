import http from 'http';
import injectSocketIO from './socket_server.js';
import app from "./app.js";

const server = http.createServer(app);

// Inject SocketIO
// @ts-ignore
injectSocketIO(server);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});
