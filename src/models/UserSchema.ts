import mongoose, { Schema } from "mongoose";

const UserScheme = new Schema(
    {
        mobileNumber: { type: String, require: true, unique: true },
        username: { type: String, require: true, unique: true },
        fcmToken: { type: String, require: true, unique: true },
        email: { type: String, required: true, unique: true, sparse: true },
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
    },
    { timestamps: true }
);

export const UserModel = mongoose.model("User", UserScheme);

export const getMongoUsers = () => UserModel.find();

export const getMongoUserByMobileNumber = (mobileNumber: String) =>
    UserModel.findOne({ mobileNumber });

export const getMongoUserByUsername = (username: String) =>
    UserModel.findOne({ username });

export const getMongoUserByEmail = (email: String) =>
    UserModel.findOne({ email });

export const getMongoUserBySessionToken = (sessionToken: String) =>
    UserModel.findOne({
        "authentication.sessionToken": sessionToken,
    });

export const getMongoUserById = (id: String) => UserModel.findById(id);

export const createUserInDB = (data: Record<string, any>) =>
    new UserModel(data).save().then((user) => {
        user.toObject();
    });

export const deleteMongoUserById = (id: String) =>
    UserModel.findByIdAndDelete(id);

export const updateMongoUserById = (id: String, data: Record<string, any>) =>
    UserModel.findOneAndUpdate(id, data);
