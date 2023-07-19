import { Socket } from "socket.io-client";
export declare class SocketioClient {
    socket: Socket;
    connected: Promise<boolean>;
    actions: Record<string, (payload: any) => void>;
    constructor(url: string, actions?: Record<string, (payload: any) => void>);
    reconnect: () => void;
    addAction: (action: string, callback: (payload: any) => void) => void;
    removeAction: (action: string, callback: (payload: any) => void) => void;
    addActions: (actions: Record<string, (payload: any) => void>) => void;
    removeActions: (actions: Record<string, (payload: any) => void>) => void;
    sendMessage: (action: string, payload?: Record<string, any>) => Promise<void>;
    fetch: <UpdatePayload extends Record<string, any> = Record<string, any>>(action: string, txPayload?: Record<string, any>, handleUpdateMessage?: ((rxPayload: UpdatePayload) => void) | undefined) => Promise<Record<string, unknown>>;
}
