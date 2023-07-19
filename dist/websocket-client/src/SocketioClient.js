"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketioClient = void 0;
const socket_io_client_1 = require("socket.io-client");
const txRx_1 = require("../../shared/txRx");
const nanoid_1 = require("nanoid");
class SocketioClient {
    constructor(url, actions) {
        this.actions = {};
        this.reconnect = () => {
            this.connected = new Promise((resolve) => {
                this.socket.off('connect');
                setTimeout(() => {
                    this.socket.on('connect', () => {
                        resolve(true);
                    });
                    this.socket.connect();
                }, 1000);
            });
        };
        this.addAction = (action, callback) => {
            this.socket.on((0, txRx_1.rxToTx)(action), callback);
        };
        this.removeAction = (action, callback) => {
            this.socket.off((0, txRx_1.rxToTx)(action), callback);
        };
        this.addActions = (actions) => {
            for (const [action, callback] of Object.entries(actions)) {
                this.socket.on((0, txRx_1.rxToTx)(action), callback);
            }
        };
        this.removeActions = (actions) => {
            for (const [action, callback] of Object.entries(actions)) {
                this.socket.off((0, txRx_1.rxToTx)(action), callback);
            }
        };
        this.sendMessage = async (action, payload) => {
            await this.connected;
            this.socket.emit(action, payload);
        };
        this.fetch = async (action, txPayload, handleUpdateMessage) => {
            await this.connected;
            const messageId = (0, nanoid_1.nanoid)();
            return new Promise((resolve, reject) => {
                this.socket.on(messageId, (rxMessage) => {
                    if (!rxMessage.status || rxMessage.status === 'COMPLETE') {
                        resolve(rxMessage.payload);
                    }
                    else if (rxMessage.status === 'RUNNING') {
                        handleUpdateMessage?.(rxMessage.payload);
                    }
                    else if (rxMessage.status === 'ERROR') {
                        reject(rxMessage.payload);
                    }
                    else {
                        reject('Unknown data format');
                    }
                });
                this.socket.emit(action, {
                    action,
                    messageId,
                    ...txPayload
                });
            });
        };
        this.socket = (0, socket_io_client_1.io)(url, { forceNew: true });
        this.actions = actions ?? {};
        this.connected = new Promise((resolve) => {
            this.socket.on('connect', () => {
                resolve(true);
            });
            this.socket.on('connect_error', this.reconnect);
            this.socket.on('disconnect', this.reconnect);
        });
        this.addActions(this.actions);
    }
}
exports.SocketioClient = SocketioClient;
