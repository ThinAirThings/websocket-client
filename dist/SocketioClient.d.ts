import { Socket } from "socket.io-client";
export declare class SocketioClient {
    socket: Socket;
    connected: Promise<void>;
    constructor(url: string, actions: Record<string, any>);
    sendMessage: (action: string, payload: Record<string, any>) => Promise<void>;
    fetch: <R = Record<string, any>, UpdatePayload extends Record<string, any> = Record<string, any>>(action: string, payload: Record<string, any>, handleUpdateMessage?: ((payload: UpdatePayload) => void) | undefined) => Promise<R>;
}
