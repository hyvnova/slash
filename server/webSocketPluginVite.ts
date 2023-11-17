import injectSocketIO from './socketIoHandler';

export const webSocketServer = {
    name: 'webSocketServer',
    configureServer(server: { httpServer: any; }) {
        injectSocketIO(server.httpServer);
    }
};