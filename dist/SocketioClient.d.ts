import { Socket } from "socket.io-client";
export declare class SocketioClient {
    socket: Socket;
    connected: Promise<void>;
    constructor(url: string, actions: Record<string, any>);
    sendMessage: (action: string, payload: Record<string, any>) => Promise<void>;
}
