import { WebSocketServer } from 'ws';

let wss;

export const createWebSocketServer = (server) => {
    wss = new WebSocketServer({ server, path: '/ws' });

    wss.on('connection', (ws, req) => {
        console.log('🔌 New WebSocket connection from:', req.socket.remoteAddress);

        ws.on('message', (message) => {
            try {
                const data = JSON.parse(message);
                console.log('📨 Received:', data);

                // Echo back or handle different message types
                if (data.type === 'subscribe') {
                    ws.send(JSON.stringify({
                        type: 'subscribed',
                        channel: data.channel,
                        timestamp: new Date().toISOString()
                    }));
                }
            } catch (error) {
                console.error('WebSocket message error:', error);
            }
        });

        ws.on('close', () => {
            console.log('🔌 WebSocket connection closed');
        });

        ws.on('error', (error) => {
            console.error('WebSocket error:', error);
        });

        // Send initial connection message
        ws.send(JSON.stringify({
            type: 'connected',
            message: 'Connected to HackWebTools real-time feed',
            timestamp: new Date().toISOString()
        }));
    });

    return wss;
};

// Broadcast to all connected clients
export const broadcast = (data) => {
    if (wss) {
        wss.clients.forEach((client) => {
            if (client.readyState === 1) { // OPEN
                client.send(JSON.stringify(data));
            }
        });
    }
};

// Send to specific client
export const sendToClient = (ws, data) => {
    if (ws.readyState === 1) {
        ws.send(JSON.stringify(data));
    }
};
