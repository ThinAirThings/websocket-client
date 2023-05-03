export type IncomingWebsocketRequestMessage = {
    messageId: string;
    status: 'RUNNING' | 'ERROR' | 'COMPLETE';
    payload: Record<string, any>;
};
export declare const websocketFetch: <R = Record<string, any>, UpdatePayload extends Record<string, any> = Record<string, any>>(url: string, action: string, payload: Record<string, any>, handleUpdateMessage?: ((payload: UpdatePayload) => void) | undefined) => Promise<R>;
