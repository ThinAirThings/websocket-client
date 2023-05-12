export type IncomingWebsocketRequestMessage = {
    messageId: string;
    status: 'RUNNING' | 'ERROR' | 'COMPLETE';
    payload: Record<string, any>;
};
export declare const websocketFetch: <UpdatePayload extends Record<string, any> = Record<string, any>>({ url, action, payload, handleUpdateMessage }: {
    url: string;
    action: string;
    payload?: Record<string, any> | undefined;
    handleUpdateMessage?: ((payload: UpdatePayload) => void) | undefined;
}) => Promise<Record<string, unknown>>;
