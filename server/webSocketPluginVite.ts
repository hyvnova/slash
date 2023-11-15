import injectSocketIO from './socketIoHandler.js';

export const webSocketServer = {
    name: 'webSocketServer',
    configureServer(server: { httpServer: any; }) {
        injectSocketIO(server.httpServer);
    }
};