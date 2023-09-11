"use strict";
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
exports.chatroomsWithLastMessage = exports.getUserChatroomsWithLastMessage = exports.getUserChatrooms = exports.getMongoChatroomById = exports.createChatroomInDB = void 0;
// chatroom.model.ts
const mongoose_1 = __importStar(require("mongoose"));
const Message_1 = require("./Message");
const chatroomSchema = new mongoose_1.Schema({
    name: { type: String, required: false },
    chatroomId: { type: String, required: true },
    imageUrl: { type: String, required: false },
    description: { type: String, required: false },
    roomType: {
        type: String,
        default: "peer",
        enum: ["peer", "group", "community"],
    },
    admins: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "User" }],
    participants: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "User" }],
    lastMessage: Message_1.messageSchema,
    messages: [Message_1.messageSchema],
}, { timestamps: true });
const Chatroom = mongoose_1.default.model("Chatroom", chatroomSchema);
const createChatroomInDB = (data) => new Chatroom(data).save().then((room) => {
    room.toObject();
});
exports.createChatroomInDB = createChatroomInDB;
const getMongoChatroomById = (chatroomId) => Chatroom.findOne({ chatroomId });
exports.getMongoChatroomById = getMongoChatroomById;
// Find all chatrooms where 'uid' is in the 'participants' array
const getUserChatrooms = (uid) => Chatroom.find({ participants: uid })
    .exec()
    .then((chatrooms) => {
    console.log("Chatrooms where the user is a participant:", chatrooms);
})
    .catch((error) => {
    console.error("Error finding chatrooms:", error);
});
exports.getUserChatrooms = getUserChatrooms;
const getUserChatroomsWithLastMessage = (uid) => Chatroom.aggregate([
    {
        $match: { participants: new mongoose_1.default.Types.ObjectId(uid) }
    },
    {
        $lookup: {
            from: "messages",
            localField: "lastMessage",
            foreignField: "_id",
            as: "lastMessage"
        }
    },
    {
        $unwind: {
            path: "$lastMessage",
            preserveNullAndEmptyArrays: true
        }
    },
    {
        $match: { "lastMessage": { $ne: null } }
    }
])
    .exec()
    .then((chatroomsWithLastMessage) => {
    console.log("Chatrooms with last messages:", chatroomsWithLastMessage);
})
    .catch((error) => {
    console.error("Error finding chatrooms with last messages:", error);
});
exports.getUserChatroomsWithLastMessage = getUserChatroomsWithLastMessage;
const chatroomsWithLastMessage = (uid) => Chatroom.find({
    participants: uid,
    lastMessage: { $ne: null }
});
exports.chatroomsWithLastMessage = chatroomsWithLastMessage;
exports.default = Chatroom;
//# sourceMappingURL=Chatroom.js.map