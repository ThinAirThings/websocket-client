import { Socket } from "socket.io-client";
export declare class SocketioClient {
    socket: Socket;
    connected: Promise<boolean>;
    constructor(url: string, actions?: Record<string, (payload: any) => void>);
    createSocket: (url: string, actions?: Record<string, (payload: any) => void> | undefined) => Socket<import("@socket.io/component-emitter").DefaultEventsMap, import("@socket.io/component-emitter").DefaultEventsMap>;
    addAction: (action: string, callback: (payload: any) => void) => void;
    removeAction: (action: string, callback: (payload: any) => void) => void;
    addActions: (socket: Socket, actions: Record<string, (payload: any) => void>) => void;
    sendMessage: (action: string, payload?: Record<string, any>) => Promise<void>;
    fetch: <UpdatePayload extends Record<string, any> = Record<string, any>>(action: string, txPayload?: Record<string, any>, handleUpdateMessage?: ((rxPayload: UpdatePayload) => void) | undefined) => Promise<Record<string, unknown>>;
}
