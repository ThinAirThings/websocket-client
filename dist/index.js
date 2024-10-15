"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  SocketioClient: () => SocketioClient,
  websocketFetch: () => websocketFetch
});
module.exports = __toCommonJS(src_exports);

// src/SocketioClient.ts
var import_socket = require("socket.io-client");
var import_nanoid = require("nanoid");
var import_txrx = require("@thinairthings/txrx");
var SocketioClient = class {
  socket;
  connected;
  actions = {};
  constructor(url, actions) {
    this.socket = (0, import_socket.io)(url, { forceNew: true });
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
    this.socket.on((0, import_txrx.rxToTx)(action), callback);
  };
  removeAction = (action, callback) => {
    this.socket.off((0, import_txrx.rxToTx)(action), callback);
  };
  addActions = (actions) => {
    for (const [action, callback] of Object.entries(actions)) {
      this.socket.on((0, import_txrx.rxToTx)(action), callback);
    }
  };
  removeActions = (actions) => {
    for (const [action, callback] of Object.entries(actions)) {
      this.socket.off((0, import_txrx.rxToTx)(action), callback);
    }
  };
  sendMessage = async (action, payload) => {
    await this.connected;
    this.socket.emit(action, payload);
  };
  fetch = async (action, txPayload, handleUpdateMessage) => {
    await this.connected;
    const messageId = (0, import_nanoid.nanoid)();
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
var import_nanoid2 = require("nanoid");
var websocketFetch = async ({
  url,
  action,
  payload,
  handleUpdateMessage
}) => {
  const messageId = (0, import_nanoid2.nanoid)();
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  SocketioClient,
  websocketFetch
});
//# sourceMappingURL=index.js.map