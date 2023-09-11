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
exports.getUserChatrooms = void 0;
// chatroom.model.ts
const mongoose_1 = __importStar(require("mongoose"));
const chatroomSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    // chatroomId: { type: String, required: true },
    imageUrl: { type: String, required: false },
    description: { type: String, required: false },
    roomType: {
        type: String,
        default: "peer",
        enum: ["peer", "group", "community"],
    },
    admins: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "User" }],
    participants: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "User" }],
    // lastMessage: {type:MessageModel}
}, { timestamps: true });
const Chatroom = mongoose_1.default.model("Chatroom", chatroomSchema);
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
exports.default = Chatroom;
//# sourceMappingURL=Chatroom.js.map