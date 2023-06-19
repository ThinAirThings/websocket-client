import {nanoid} from 'nanoid'
export type IncomingWebsocketRequestMessage = {
    messageId: string
    status: 'RUNNING'|'ERROR'|'COMPLETE'
    payload: Record<string, any>
}

export const websocketFetch = async <UpdatePayload extends Record<string, any>=Record<string, any>>({
    url,
    action, 
    payload, 
    handleUpdateMessage
}: {
    url: string, 
    action: string, 
    payload?: Record<string, any>, 
    handleUpdateMessage?: (payload: UpdatePayload)=>void
}): Promise<Record<string, unknown>> => {
    const messageId = nanoid()
    return new Promise((resolve, reject) => {
        const websocket = new WebSocket(url)
        websocket.onopen = () => {
            websocket.onmessage = (event) => {
                const data = JSON.parse(event.data) as IncomingWebsocketRequestMessage
                if (data.messageId === messageId) {
                    if (data.status === 'RUNNING') {
                        handleUpdateMessage?.(data.payload as UpdatePayload)
                    } else if (data.status === 'COMPLETE') {
                        resolve(data.payload)
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