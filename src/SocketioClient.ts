import { io, Socket } from "socket.io-client"
import { rxToTx } from "../../shared/txRx"
import { nanoid } from "nanoid"
import { IncomingWebsocketRequestMessage } from "./websocketFetch"

export class SocketioClient{
    socket: Socket
    connected: Promise<void>
    constructor(url: string, actions?: Record<string, (payload: any)=>void>){
        this.socket = io(url)
        this.connected = new Promise((resolve) => {
            this.socket.on('connect', () => {
                console.log(`Client Connected to: ${url}`)
                resolve()
            })
        })
        this.addActions(actions??{})
    }
    addAction = (action: string, callback: (payload: any)=>void) => {
        this.socket.on(rxToTx(action), callback)
    }
    removeAction = (action: string, callback: (payload: any)=>void) => {
        this.socket.off(rxToTx(action), callback)
    }
    addActions = (actions: Record<string, (payload: any)=>void>) => {
        for (const [action, callback] of Object.entries(actions)){
            this.socket.on(rxToTx(action), callback)
        }
    }
    sendMessage = async (action: string, payload?: Record<string, any>) => {
        await this.connected
        this.socket.emit(action, payload)
    }
    fetch = async <UpdatePayload extends Record<string, any>=Record<string, any>>(
        action: string, 
        txPayload?: Record<string, any>, 
        handleUpdateMessage?: (rxPayload: UpdatePayload)=>void
    ): Promise<Record<string, unknown>> => {
        await this.connected
        const messageId = nanoid()
        return new Promise((resolve, reject) => {
            this.socket.on(messageId, (rxMessage: IncomingWebsocketRequestMessage) => {
                if (!rxMessage.status || rxMessage.status === 'COMPLETE') {
                    resolve(rxMessage.payload)
                } else if (rxMessage.status === 'RUNNING') {
                    handleUpdateMessage?.(rxMessage.payload as UpdatePayload)
                } else if (rxMessage.status === 'ERROR') {
                    reject(rxMessage.payload)
                } else {
                    reject('Unknown data format')
                }
            })
            this.socket.emit(action, {
                action,
                messageId,
                ...txPayload
            })
        })
    }
}