// src/SocketioClient.ts
import { io } from "socket.io-client";
import { nanoid } from "nanoid";
import { rxToTx } from "@thinairthings/txrx";
var SocketioClient = class {
  socket;
  connected;
  actions = {};
  constructor(url, actions) {
    this.socket = io(url, { forceNew: true });
    this.actions = actions ?? {};
    this.connected = new Promise((resolve) => {
      this.socket.on("connect", () => {
        resolve(true);
      });
      this.socket.on("connect_error", this.reconnect);
      this.socket.on("disconnect", this.reconnect);
    });
    this.addActions(this.actions);
  }
  reconnect = () => {
    this.connected = new Promise((resolve) => {
      this.socket.off("connect");
      setTimeout(() => {
        this.socket.on("connect", () => {
          resolve(true);
        });
        this.socket.connect();
      }, 1e3);
    });
  };
  addAction = (action, callback) => {
    this.socket.on(rxToTx(action), callback);
  };
  removeAction = (action, callback) => {
    this.socket.off(rxToTx(action), callback);
  };
  addActions = (actions) => {
    for (const [action, callback] of Object.entries(actions)) {
      this.socket.on(rxToTx(action), callback);
    }
  };
  removeActions = (actions) => {
    for (const [action, callback] of Object.entries(actions)) {
      this.socket.off(rxToTx(action), callback);
    }
  };
  sendMessage = async (action, payload) => {
    await this.connected;
    this.socket.emit(action, payload);
  };
  fetch = async (action, txPayload, handleUpdateMessage) => {
    await this.connected;
    const messageId = nanoid();
    return new Promise((resolve, reject) => {
      this.socket.on(messageId, (rxMessage) => {
        if (!rxMessage.status || rxMessage.status === "COMPLETE") {
          resolve(rxMessage.payload);
        } else if (rxMessage.status === "RUNNING") {
          handleUpdateMessage == null ? void 0 : handleUpdateMessage(rxMessage.payload);
        } else if (rxMessage.status === "ERROR") {
          reject(rxMessage.payload);
        } else {
          reject("Unknown data format");
        }
      });
      this.socket.emit(action, {
        action,
        messageId,
        ...txPayload
      });
    });
  };
};

// src/websocketFetch.ts
import { nanoid as nanoid2 } from "nanoid";
var websocketFetch = async ({
  url,
  action,
  payload,
  handleUpdateMessage
}) => {
  const messageId = nanoid2();
  return new Promise((resolve, reject) => {
    const websocket = new WebSocket(url);
    websocket.onopen = () => {
      websocket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.messageId === messageId) {
          if (data.status === "RUNNING") {
            handleUpdateMessage == null ? void 0 : handleUpdateMessage(data.payload);
          } else if (data.status === "COMPLETE") {
            resolve(data.payload);
            websocket.close();
          } else if (data.status === "ERROR") {
            reject(data.payload);
            websocket.close();
          } else {
            reject("Unknown status");
            websocket.close();
          }
        }
      };
      websocket.send(JSON.stringify({
        action,
        messageId,
        ...payload
      }));
    };
  });
};
export {
  SocketioClient,
  websocketFetch
};
//# sourceMappingURL=index.mjs.map