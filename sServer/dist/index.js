"use strict";
// signalling server 
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const ws1 = new ws_1.WebSocketServer({
    port: 8080
});
let senderSocket = null;
let receiverSocket = null;
ws1.on('connection', (ws) => {
    ws.on('error', console.error);
    console.log("connected ws");
    ws.on('message', (data) => {
        const message = JSON.parse(data);
        if (message.type === 'sender') {
            senderSocket = ws;
        }
        else if (message.type === 'reciever') {
            receiverSocket = ws;
        }
        else if (message.type === 'createOffer') {
            if (ws !== senderSocket) {
                return;
            }
            receiverSocket === null || receiverSocket === void 0 ? void 0 : receiverSocket.send(JSON.stringify({ type: 'createOffer', sdp: message.sdp }));
        }
        else if (message.type === 'createAnswer') {
            if (ws != receiverSocket) {
                return;
            }
            senderSocket === null || senderSocket === void 0 ? void 0 : senderSocket.send(JSON.stringify({ type: "createAnswer", sdp: message.sdp }));
        }
        else if (message.type === 'iceCandidate') {
            if (ws === senderSocket)
                receiverSocket === null || receiverSocket === void 0 ? void 0 : receiverSocket.send(JSON.stringify({ type: 'iceCandidate', candidate: message.candidate }));
        }
        else if (ws === receiverSocket) {
            senderSocket === null || senderSocket === void 0 ? void 0 : senderSocket.send(JSON.stringify({ type: 'iceCandidate', candidate: message.candidate }));
        }
    });
});
