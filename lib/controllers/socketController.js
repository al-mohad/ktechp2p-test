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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const socket_io_1 = require("socket.io");
const message_enums_1 = require("../enums/message_enums");
const chatHelpers_1 = require("../helpers/chatHelpers");
const Chatroom_1 = __importStar(require("../models/Chatroom"));
const Message_1 = __importDefault(require("../models/Message"));
const UserSchema_1 = require("../models/UserSchema");
function configureSocket(server) {
    const io = new socket_io_1.Server(server);
    io.on('connection', (socket) => {
        console.log(`Socket connected & listening for packets...`);
        // socket.emit('msg', { message: "hello from server", time: Date.now() });
        // socket.on('msg', (data: { message: string; time: number }) => {
        //     console.log('new msg');
        //     console.log(`frontend: ${data.message} ${data.time}`);
        // });
        // * Request all current registered users
        socket.on('users', async (data) => {
            console.log(`User with uid: ${data.uid} is requesting all registered users`);
            let usersFromDB = await (0, UserSchema_1.getMongoUsers)();
            console.log(`registered users retrieved: ${usersFromDB}`);
            socket.emit('users', { uid: data.uid, users: JSON.stringify(usersFromDB) });
            console.log('requested users sent back to user successfulluy');
        });
        socket.on('getP2PChatroom', async (data) => {
            console.log('getting p2p chatroom');
            let roomID = (0, chatHelpers_1.generateP2PChatRoomId)(data.a, data.b);
            console.log(`chatroom id: ${roomID}`);
            let roomExist = await (0, Chatroom_1.getMongoChatroomById)(roomID);
            if (roomExist) {
                console.log(`roomExist: ${roomExist}`);
            }
            else {
                console.log(`generating new chatroom: ${roomID}`);
                const u1 = await (0, UserSchema_1.getMongoUserById)(data.a);
                const u2 = await (0, UserSchema_1.getMongoUserById)(data.b);
                const response = await (0, Chatroom_1.createChatroomInDB)({
                    chatroomId: roomID,
                    participants: [u1, u2]
                });
                console.log(`room created: ${response}`);
            }
        });
        // Chat event listener
        socket.on('chat', async (data) => {
            let roomID = data['roomID'];
            let message = data['message'];
            let senderId = new mongoose_1.default.Types.ObjectId(message['senderId']);
            let receiverId = new mongoose_1.default.Types.ObjectId(message['receiverId']);
            let mt = message['messageType'];
            const messageType = (0, message_enums_1.getMessageTypeEnumValue)(mt);
            let content = message['messageText'];
            console.log(`roomID: ${roomID}`);
            console.log(`message: ${message['messageText']}`);
            //todo if roomID is empty emit error to user
            if (roomID === null || roomID === '')
                return;
            console.log(`ChatroomID: ${roomID}`);
            let chatroom = await (0, Chatroom_1.getMongoChatroomById)(roomID);
            // Ensure messageType is valid
            if (messageType === undefined) {
                throw new Error("Invalid message type");
            }
            // Create a new message document
            // const newMessageData: IMessage = {
            //     senderId: senderId,
            //     messageType: messageType,
            //     content: content,
            // };
            const newMessage = await Message_1.default.create({
                senderId: senderId,
                receiverId: receiverId,
                messageType: messageType,
                content: content,
            });
            // Add the message to the chatroom's messages subcollection
            chatroom.messages.push(newMessage);
            chatroom.lastMessage = newMessage;
            // Save the updated chatroom document
            await chatroom.save();
            // check if the chatroom exist and retrieved the id or name, else generate it
            // Handle the chat logic here
            // Broadcast the chat message to all other users in the same room except the sender
            socket.emit('chat', { 'uid': senderId, 'roomID': roomID, 'message': message });
            // socket.to(data.roomId).emit('chat', { sender: socket.id, message: data.message });
        });
        // Message event listener
        socket.on('message', (data) => {
            // Handle the message logic here
            console.log(`User ${socket.id} sent a message: ${data.message}`);
            // Broadcast the message to all connected users
            io.emit('message', { sender: socket.id, message: data.message });
        });
        // getUserChatRooms event listener
        socket.on('chatrooms', async (data) => {
            // console.log(`retrieving user's chatrooms: ${data['uid']}`)
            let uid = data['uid'];
            // Fetch the user's chatrooms using the getUserChatrooms function
            try {
                // const chatrooms = await getUserChatrooms(uid);
                // const chatrooms = await getUserChatroomsWithLastMessage(uid);
                const chatrooms = await (0, Chatroom_1.chatroomsWithLastMessage)(uid);
                console.log(`Chatrooms: ${chatrooms}`);
                socket.emit('chatrooms', { 'uid': uid, 'chatrooms': JSON.stringify(chatrooms) });
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