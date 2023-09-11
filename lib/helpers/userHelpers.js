"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkFileType = exports.getUploadPath = exports.validateDeleteUserBody = void 0;
const path_1 = __importDefault(require("path"));
const UserSchema_1 = require("../models/UserSchema");
const validateDeleteUserBody = async (body) => {
    const { uid } = body;
    if (!uid)
        return "User ID is missing";
    const user = await (0, UserSchema_1.getMongoUserById)(uid);
    if (!user)
        return "User not found";
    return null;
};
exports.validateDeleteUserBody = validateDeleteUserBody;
const getUploadPath = (fieldName) => {
    switch (fieldName) {
        case 'profile':
            return './public/uploads/profile-avatar';
        default:
            return './public/uploads/';
    }
};
exports.getUploadPath = getUploadPath;
const checkFileType = (file, callback) => {
    const fileTypes = '/jpeg|jpj|png/';
    const extname = fileTypes.match(path_1.default.extname(file.originalname).toLocaleLowerCase());
    const mimeType = fileTypes.match(file.mimetype);
    if (extname && mimeType) {
        return callback(null, true);
    }
    else {
        // bug:: fix this
        callback(null, false);
    }
};
exports.checkFileType = checkFileType;
//# sourceMappingURL=userHelpers.js.map