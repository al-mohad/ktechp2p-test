import mongoose, { Schema } from "mongoose";

const WalletSchema = new Schema(
    {
        uid: { type: Schema.Types.ObjectId, ref: "User" },
        username: {
            type: String,
            required: true,
            trim: true,
            immutable: true,
            unique: true
        },
        balance: { type: Number, required: true, default: 0.0, },
        pin: { type: String, required: true, default: "0000", },
    },
    { timestamps: true }
);

export const WalletModel = mongoose.model("Wallet", WalletSchema);

export const createNewWalletInMongdb = (data: Record<string, any>) =>
    new WalletModel(data).save().then((wallet) => {
        wallet.toObject();
    });

export const getWalletsFromMongodb = () => WalletModel.find();
export const getMongodbWalletByUsername = (username: String) =>
    WalletModel.findOne({ username });

export const deleteMongoWalletById = (id: String) =>
    WalletModel.findByIdAndDelete(id);

export const deleteMongoWalletByUID = (uid: String) =>
    WalletModel.findByIdAndDelete(uid);

export const updateMongoWalletById = (id: String, data: Record<string, any>) =>
    WalletModel.findOneAndUpdate(id, data);

export const updateMongoWalletByUsername = (username: String, data: Record<string, any>) =>
    WalletModel.findOneAndUpdate({ username: username }, data);


