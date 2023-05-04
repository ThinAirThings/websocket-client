import { Socket } from "socket.io-client";
export declare class SocketioClient {
    socket: Socket;
    connected: Promise<void>;
    constructor(url: string, actions: Record<string, (payload: any) => void>);
    addAction: (action: string, callback: (payload: any) => void) => void;
    addActions: (actions: Record<string, (payload: any) => void>) => void;
    sendMessage: (action: string, payload: Record<string, any>) => Promise<void>;
    fetch: <UpdatePayload extends Record<string, any> = Record<string, any>>(action: string, txPayload?: Record<string, any>, handleUpdateMessage?: ((rxPayload: UpdatePayload) => void) | undefined) => Promise<Record<string, unknown>>;
}
