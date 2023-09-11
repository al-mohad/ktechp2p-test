"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMessageTypeEnumValue = exports.MessageType = void 0;
var MessageType;
(function (MessageType) {
    MessageType["Text"] = "text";
    MessageType["Audio"] = "audio";
    MessageType["Video"] = "video";
    MessageType["Image"] = "image";
    MessageType["File"] = "file";
    MessageType["Location"] = "location";
    MessageType["Sticker"] = "sticker";
    MessageType["Emoji"] = "emoji";
    MessageType["Link"] = "link";
    MessageType["Contact"] = "contact";
})(MessageType || (exports.MessageType = MessageType = {}));
function getMessageTypeEnumValue(type) {
    return Object.values(MessageType).find(enumValue => enumValue === type);
}
exports.getMessageTypeEnumValue = getMessageTypeEnumValue;
//# sourceMappingURL=message_enums.js.map