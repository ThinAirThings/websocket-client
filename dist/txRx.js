"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rxToTx = exports.txToRx = void 0;
const txToRx = (input) => {
    // Search for the first instance of "tx" in the input string
    const txIndex = input.indexOf("tx");
    // If "tx" is found, replace it with "rx" and return the modified string
    if (txIndex !== -1) {
        return input.slice(0, txIndex) + "rx" + input.slice(txIndex + 2);
    }
    // If "tx" is not found, return the input string unchanged
    return input;
};
exports.txToRx = txToRx;
const rxToTx = (input) => {
    // Search for the first instance of "tx" in the input string
    const txIndex = input.indexOf("rx");
    // If "tx" is found, replace it with "rx" and return the modified string
    if (txIndex !== -1) {
        return input.slice(0, txIndex) + "tx" + input.slice(txIndex + 2);
    }
    // If "tx" is not found, return the input string unchanged
    return input;
};
exports.rxToTx = rxToTx;
