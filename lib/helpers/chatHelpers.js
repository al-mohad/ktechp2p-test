"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateP2PChatRoomId = exports.generateChatRoomId = void 0;
function generateChatRoomId(a, b) {
    if (a.charCodeAt(0) > b.charCodeAt(0)) {
        return `${b}_${a}`;
    }
    else {
        return `${a}_${b}`;
    }
}
exports.generateChatRoomId = generateChatRoomId;
function generateP2PChatRoomId(a, b) {
    if (a.charCodeAt(0) > b.charCodeAt(0)) {
        return `${b}_${a}`;
    }
    else {
        return `${a}_${b}`;
    }
}
exports.generateP2PChatRoomId = generateP2PChatRoomId;
function generateChatroom(usernameA, usernameB) {
    const a = usernameA.toLowerCase();
    const b = usernameB.toLowerCase();
    if (a.charCodeAt(0) > b.charCodeAt(0)) {
        return `${b}_${a}`;
    }
    else {
        return `${a}_${b}`;
    }
}
//# sourceMappingURL=chatHelpers.js.map