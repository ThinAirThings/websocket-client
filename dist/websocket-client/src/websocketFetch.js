"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.websocketFetch = void 0;
const nanoid_1 = require("nanoid");
const websocketFetch = async ({ url, action, payload, handleUpdateMessage }) => {
    const messageId = (0, nanoid_1.nanoid)();
    return new Promise((resolve, reject) => {
        const websocket = new WebSocket(url);
        websocket.onopen = () => {
            websocket.onmessage = (event) => {
                const data = JSON.parse(event.data);
                if (data.messageId === messageId) {
                    if (data.status === 'RUNNING') {
                        handleUpdateMessage?.(data.payload);
                    }
                    else if (data.status === 'COMPLETE') {
                        resolve(data.payload);
                        websocket.close();
                    }
                    else if (data.status === 'ERROR') {
                        reject(data.payload);
                        websocket.close();
                    }
                    else {
                        reject('Unknown status');
                        websocket.close();
                    }
                }
            };
            websocket.send(JSON.stringify({
                action,
                messageId,
                ...payload
            }));
        };
    });
};
exports.websocketFetch = websocketFetch;
