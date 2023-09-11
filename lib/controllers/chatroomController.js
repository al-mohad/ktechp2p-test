"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChatroomsForUser = exports.getChatroomById = exports.createChatroom = void 0;
const Chatroom_1 = __importDefault(require("../models/Chatroom"));
async function createChatroom(name, participants) {
    try {
        const chatroom = await Chatroom_1.default.create({ name, participants });
        return chatroom;
    }
    catch (error) {
        throw new Error("Failed to create chatroom");
    }
}
exports.createChatroom = createChatroom;
async function getChatroomById(chatroomId) {
    try {
        const chatroom = await Chatroom_1.default.findById(chatroomId).exec();
        return chatroom;
    }
    catch (error) {
        throw new Error("Failed to fetch chatroom");
    }
}
exports.getChatroomById = getChatroomById;
async function getChatroomsForUser(userId) {
    try {
        const userChatroomIds = []; // Replace this with fetching chatroom IDs associated with the user
        const chatrooms = await Chatroom_1.default.find({
            _id: { $in: userChatroomIds },
        }).exec();
        return chatrooms;
    }
    catch (error) {
        throw new Error("Failed to fetch user chatrooms");
    }
}
exports.getChatroomsForUser = getChatroomsForUser;
//# sourceMappingURL=chatroomController.js.map