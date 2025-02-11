class WebSocketService {
    constructor() {
        this.ws = null;
        this.listeners = new Map();
    }

    connect() {
        if (this.ws?.readyState === WebSocket.OPEN) return;

        const wsUrl = process.env.NODE_ENV === 'development' 
            ? 'ws://localhost:3000/ws'
            : `ws://${window.location.host}/ws`;

        this.ws = new WebSocket(wsUrl);

        this.ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                const listeners = this.listeners.get(data.type) || [];
                listeners.forEach(callback => callback(data.payload));
            } catch (error) {
                console.error('WebSocket message error:', error);
            }
        };

        this.ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        this.ws.onclose = () => {
            console.log('WebSocket closed');
            // Attempt to reconnect after 5 seconds
            setTimeout(() => this.connect(), 5000);
        };
    }

    on(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event).push(callback);
    }

    off(event, callback) {
        if (!this.listeners.has(event)) return;
        const callbacks = this.listeners.get(event);
        const index = callbacks.indexOf(callback);
        if (index !== -1) {
            callbacks.splice(index, 1);
        }
    }

    send(type, payload) {
        if (this.ws?.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({ type, payload }));
        }
    }
}

export const wsService = new WebSocketService(); 