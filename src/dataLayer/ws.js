import { v4 } from 'uuid';

const wsUrl = 'ws://localhost:8082';
const connectionId = v4();

export default class WS {
    ws = null;
    listeners = {
        requestHandshake: () => {
            this.send('handshake', connectionId);
        }
    };
    constructor() {
        this.ws = new WebSocket(wsUrl);
        this.ws.addEventListener('message', ({ data }) => {
            console.log('MESSAGE', data)
            const msg = JSON.parse(data);
            Object.entries(this.listeners).forEach(([key, event]) => {
                if(msg[key]) {
                    event(msg[key]);
                }
            });
        })
    }

    addListener = (key, event) => {
        this.listeners[key] = event;
    }

    send = (path, payload) => {
        const message = JSON.stringify({
            [path]: payload
        });
        this.ws.send(message);
    }
}