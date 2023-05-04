import { io, Socket } from "socket.io-client"
import { rxToTx } from "./txRx"
import { nanoid } from "nanoid"
import { IncomingWebsocketRequestMessage } from "./websocketFetch"

export class SocketioClient{
    socket: Socket
    connected: Promise<void>
    constructor(url: string, actions: Record<string, (payload: any)=>void>){
        this.socket = io(url)
        this.connected = new Promise((resolve) => {
            this.socket.on('connect', () => {
                console.log(`Client Connected to: ${url}`)
                resolve()
            })
        })
        for (const [action, callback] of Object.entries(actions)){
            this.socket.on(rxToTx(action), callback)
        }
    }
    sendMessage = async (action: string, payload: Record<string, any>) => {
        await this.connected
        this.socket.emit(action, payload)
    }
    fetch = async <UpdatePayload extends Record<string, any>=Record<string, any>>(
        action: string, 
        payload?: Record<string, any>, 
        handleUpdateMessage?: (payload: UpdatePayload)=>void
    ): Promise<Record<string, unknown>> => {
        await this.connected
        const messageId = nanoid()
        return new Promise<Record<string, unknown>>((resolve, reject) => {
            this.socket.on(messageId, (data: IncomingWebsocketRequestMessage) => {
                if (!data.status || data.status === 'COMPLETE') {
                    resolve(data.payload)
                } else if (data.status === 'RUNNING') {
                    handleUpdateMessage?.(data.payload as UpdatePayload)
                } else if (data.status === 'ERROR') {
                    reject(data.payload)
                } else {
                    reject('Unknown data format')
                }
            })
            this.socket.emit(action, {
                action,
                messageId,
                ...payload
            })
        })
    }
}