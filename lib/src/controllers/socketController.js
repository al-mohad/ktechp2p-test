"use strict";
// socketController.ts
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const Chatroom_1 = __importStar(require("../models/Chatroom"));
const UserSchema_1 = require("../models/UserSchema");
function configureSocket(server) {
    const io = new socket_io_1.Server(server);
    io.on('connection', (socket) => {
        console.log(`Socket connected & listening...\nUser: ${socket.id}`);
        socket.emit('msg', { message: "hello from server", time: Date.now() });
        socket.on('msg', (data) => {
            console.log('new msg');
            console.log(`frontend: ${data.message} ${data.time}`);
        });
        // * Request all current registered users
        socket.on('users', async (data) => {
            console.log(`User with uid: ${data.uid} is requesting all registered users`);
            let usersFromDB = await (0, UserSchema_1.getMongoUsers)();
            console.log(`registered users retrieved: ${usersFromDB}`);
            socket.emit('users', { uid: data.uid, users: usersFromDB });
            console.log('requested users sent back to user successfulluy');
        });
        // Chat event listener
        socket.on('chat', (data) => {
            // Handle the chat logic here
            console.log(`User ${socket.id} sent a chat message: ${data.message}`);
            // Broadcast the chat message to all other users in the same room except the sender
            socket.to(data.roomId).emit('chat', { sender: socket.id, message: data.message });
        });
        // Message event listener
        socket.on('message', (data) => {
            // Handle the message logic here
            console.log(`User ${socket.id} sent a message: ${data.message}`);
            // Broadcast the message to all connected users
            io.emit('message', { sender: socket.id, message: data.message });
        });
        // getUserChatRooms event listener
        socket.on('getUserChatRooms', async (data) => {
            console.log(`retrieving user's chatrooms: ${data['uid']}`);
            let uid = data['uid'];
            // Fetch the user's chatrooms using the getUserChatrooms function
            try {
                const chatrooms = await (0, Chatroom_1.getUserChatrooms)(uid);
                console.log(`Chatrooms: ${chatrooms}`);
                socket.emit('userChatRooms', { 'uid': uid, 'chatrooms': chatrooms });
            }
            catch (error) {
                console.error(error.message);
                socket.emit('error', 'Failed to fetch chatrooms');
            }
        });
        // notifications event listener
        socket.on('notifications', (data) => {
            // Handle the notification logic here
            console.log(`User ${socket.id} received a notification: ${data.message}`);
            // Emit the notification to the connected user
            socket.emit('notification', { message: data.message });
        });
        // test event listener
        socket.on('createTestChatroom', (data) => {
            // Handle the notification logic here
            console.log(`User ${socket.id} received a notification: ${data.message}`);
            // Emit the notification to the connected user
            const newChatroom = new Chatroom_1.default({
                name: data.chatroomName,
                roomType: "peer",
                participants: [data.uid]
            });
            newChatroom.save();
            socket.emit('notification', { message: data.message });
        });
    });
    return io;
}
exports.default = configureSocket;
//# sourceMappingURL=socketController.js.map