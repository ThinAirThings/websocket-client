"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketioClient = void 0;
const socket_io_client_1 = require("socket.io-client");
const txRx_1 = require("./txRx");
const nanoid_1 = require("nanoid");
class SocketioClient {
    constructor(url, actions) {
        this.sendMessage = async (action, payload) => {
            await this.connected;
            this.socket.emit(action, payload);
        };
        this.fetch = async (action, payload, handleUpdateMessage) => {
            console.log("Above connected");
            await this.connected;
            console.log("Below connected");
            const messageId = (0, nanoid_1.nanoid)();
            console.log(messageId);
            console.log(payload);
            return new Promise((resolve, reject) => {
                this.socket.on(messageId, (data) => {
                    console.log("Received data from server", data);
                    if (!data.status || data.status === 'COMPLETE') {
                        resolve(data.payload);
                    }
                    else if (data.status === 'RUNNING') {
                        handleUpdateMessage?.(data.payload);
                    }
                    else if (data.status === 'ERROR') {
                        reject(data.payload);
                    }
                    else {
                        reject('Unknown data format');
                    }
                });
                this.socket.emit(action, {
                    action,
                    messageId,
                    ...payload
                });
            });
        };
        this.socket = (0, socket_io_client_1.io)(url);
        this.connected = new Promise((resolve) => {
            this.socket.on('connect', () => {
                console.log(`Client Connected to: ${url}`);
                resolve();
            });
        });
        for (const [action, callback] of Object.entries(actions)) {
            this.socket.on((0, txRx_1.rxToTx)(action), callback);
        }
    }
}
exports.SocketioClient = SocketioClient;
