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
exports.updateMongoUserById = exports.deleteMongoUserById = exports.createUserInDB = exports.getMongoUserById = exports.getMongoUserBySessionToken = exports.getMongoUserByEmail = exports.getMongoUserByUsername = exports.getMongoUserByMobileNumber = exports.getMongoUsers = exports.UserModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const UserScheme = new mongoose_1.Schema({
    mobileNumber: { type: String, require: true, unique: true },
    username: { type: String, require: true, unique: true },
    fcmToken: { type: String, require: true, unique: true },
    email: { type: String, required: false, unique: true, sparse: true },
    isVerified: { type: Boolean, default: false },
    profileImage: { type: String, required: false },
    authentication: {
        password: { type: String, require: true, select: false },
        salt: { type: String, select: false },
        // sessionToken: { type: String, select: false },
    },
    role: {
        type: String,
        default: "user",
        enum: ["user", "moderator", "supervisor", "superAdmin", "admin"],
    },
}, { timestamps: true });
exports.UserModel = mongoose_1.default.model("User", UserScheme);
const getMongoUsers = () => exports.UserModel.find();
exports.getMongoUsers = getMongoUsers;
const getMongoUserByMobileNumber = (mobileNumber) => exports.UserModel.findOne({ mobileNumber });
exports.getMongoUserByMobileNumber = getMongoUserByMobileNumber;
const getMongoUserByUsername = (username) => exports.UserModel.findOne({ username });
exports.getMongoUserByUsername = getMongoUserByUsername;
const getMongoUserByEmail = (email) => exports.UserModel.findOne({ email });
exports.getMongoUserByEmail = getMongoUserByEmail;
const getMongoUserBySessionToken = (sessionToken) => exports.UserModel.findOne({
    "authentication.sessionToken": sessionToken,
});
exports.getMongoUserBySessionToken = getMongoUserBySessionToken;
const getMongoUserById = (id) => exports.UserModel.findById(id);
exports.getMongoUserById = getMongoUserById;
const createUserInDB = (data) => new exports.UserModel(data).save().then((user) => {
    user.toObject();
});
exports.createUserInDB = createUserInDB;
const deleteMongoUserById = (id) => exports.UserModel.findByIdAndDelete(id);
exports.deleteMongoUserById = deleteMongoUserById;
const updateMongoUserById = (id, data) => exports.UserModel.findOneAndUpdate(id, data);
exports.updateMongoUserById = updateMongoUserById;
//# sourceMappingURL=UserSchema.js.map