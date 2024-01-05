import http from 'http';
import injectSocketIO from './socket_server.js';
import app from "./app.js";
import * as logger from "./utils/logger.js";

const server = http.createServer(app);

// Inject SocketIO
// @ts-ignore
injectSocketIO(server);

const PORT = process.env.PORT || 3003;

server.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
});
