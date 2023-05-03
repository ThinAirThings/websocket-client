import { io, Socket } from "socket.io-client"
import { rxToTx } from "./txRx"

export class WebsocketClient{
    socket: Socket
    connected: Promise<void>
    constructor(url: string, actions: Record<string, any>){
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
}