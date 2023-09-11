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
exports.updateMongoWalletByUsername = exports.updateMongoWalletById = exports.deleteMongoWalletByUID = exports.deleteMongoWalletById = exports.getMongodbWalletByUsername = exports.getWalletsFromMongodb = exports.createNewWalletInMongdb = exports.WalletModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const WalletSchema = new mongoose_1.Schema({
    uid: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    username: {
        type: String,
        required: true,
        trim: true,
        immutable: true,
        unique: true
    },
    balance: { type: Number, required: true, default: 0.0, },
    pin: {
        type: String,
        required: false,
        // default: "00000",
    },
}, { timestamps: true });
exports.WalletModel = mongoose_1.default.model("Wallet", WalletSchema);
const createNewWalletInMongdb = (data) => new exports.WalletModel(data).save().then((wallet) => {
    wallet.toObject();
});
exports.createNewWalletInMongdb = createNewWalletInMongdb;
const getWalletsFromMongodb = () => exports.WalletModel.find();
exports.getWalletsFromMongodb = getWalletsFromMongodb;
const getMongodbWalletByUsername = (username) => exports.WalletModel.findOne({ username });
exports.getMongodbWalletByUsername = getMongodbWalletByUsername;
const deleteMongoWalletById = (id) => exports.WalletModel.findByIdAndDelete(id);
exports.deleteMongoWalletById = deleteMongoWalletById;
const deleteMongoWalletByUID = (uid) => exports.WalletModel.findByIdAndDelete(uid);
exports.deleteMongoWalletByUID = deleteMongoWalletByUID;
const updateMongoWalletById = (id, data) => exports.WalletModel.findOneAndUpdate(id, data);
exports.updateMongoWalletById = updateMongoWalletById;
const updateMongoWalletByUsername = (username, data) => exports.WalletModel.findOneAndUpdate({ username: username }, data);
exports.updateMongoWalletByUsername = updateMongoWalletByUsername;
//# sourceMappingURL=WalletSchema.js.map