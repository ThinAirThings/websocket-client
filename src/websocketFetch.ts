import {nanoid} from 'nanoid'
export type IncomingWebsocketRequestMessage = {
    messageId: string
    status: 'RUNNING'|'ERROR'|'COMPLETE'
    payload: Record<string, any>
}

export const websocketFetch = async <R=Record<string, any>, UpdatePayload extends Record<string, any>=Record<string, any>>(
    url: string, 
    action: string, 
    payload: Record<string, any>, 
    handleUpdateMessage?: (payload: UpdatePayload)=>void
): Promise<R> => {
    const messageId = nanoid()
    return new Promise<R>((resolve, reject) => {
        const websocket = new WebSocket(url)
        websocket.onopen = () => {
            websocket.onmessage = (event) => {
                const data = JSON.parse(event.data) as IncomingWebsocketRequestMessage
                if (data.messageId === messageId) {
                    if (data.status === 'RUNNING') {
                        handleUpdateMessage?.(data.payload as UpdatePayload)
                    } else if (data.status === 'COMPLETE') {
                        resolve(data.payload as R)
                        websocket.close()
                    } else if (data.status === 'ERROR') {
                        reject(data.payload)
                        websocket.close()
                    } else {
                        reject('Unknown status')
                        websocket.close()
                    }
                }
            }
            websocket.send(JSON.stringify({
                action,
                messageId,
                ...payload
            }))
        }
    })
}