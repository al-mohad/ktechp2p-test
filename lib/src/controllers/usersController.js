"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutUser = exports.getUserProfile = exports.updateUserAvatar = exports.updateUser = exports.deleteUser = exports.getAllUsers = void 0;
const userHelpers_1 = require("../helpers/userHelpers");
const ActivitySchema_1 = require("../models/ActivitySchema");
const UserSchema_1 = require("../models/UserSchema");
const WalletSchema_1 = require("../models/WalletSchema");
const getAllUsers = async (req, res) => {
    try {
        const users = await (0, UserSchema_1.getMongoUsers)();
        return res.status(200).json({
            "status": "success", "message": "all users retrieved",
            payload: { users: users }
        });
    }
    catch (error) {
        console.log(`An error occured: ${error}`);
        return res.json({ "status": "error", "message": "error occured" });
    }
};
exports.getAllUsers = getAllUsers;
const deleteUser = async (req, res) => {
    try {
        const { uid } = req.body;
        let error = await (0, userHelpers_1.validateDeleteUserBody)(req.body);
        console.log(`Error (validateDeleteUserBody): ${error}`);
        if (error !== null)
            return res.status(406).json({ status: 'error', message: error });
        /*
        todo:: await Promise.all([
            deleteMongoUserById(id),deleteMongoWalletByUID(id),
        ])
        */
        const deletedUser = await (0, UserSchema_1.deleteMongoUserById)(uid);
        const deletedWallet = await (0, WalletSchema_1.deleteMongoWalletByUID)(uid);
        return res.json({ 'statusCode': 200, "message": "user deleted", payload: { deletedUser: deletedUser, deletedWallet: deletedWallet } }).end();
    }
    catch (error) {
        console.log(`An error occured: ${error}`);
        return res.json({ 'statusCode': 400, "message": "error deleting user", data: null });
    }
};
exports.deleteUser = deleteUser;
const updateUser = async (req, res) => {
    try {
        const { uid, username } = req.body;
        if (!username)
            res.sendStatus(400);
        const user = await (0, UserSchema_1.getMongoUserById)(uid);
        user.username = username;
        await user.save();
        res.json({ 'statusCode': 200, "message": "user updated", data: user });
    }
    catch (error) {
        console.log(`An error occured: ${error}`);
        res.json({ 'statusCode': 400, "message": "error updating user", data: null });
    }
};
exports.updateUser = updateUser;
const updateUserAvatar = async (req, res) => {
    console.log(req.file);
    let userId = req.file.filename.split('.')[0];
    console.log(`USER ID: ${userId}`);
    let user = await (0, UserSchema_1.getMongoUserById)(userId);
    user.profileImage = req.file.path;
    user.save();
    return res.status(200).json({ "status": "success", "message": "Profile Image Updated", payload: { user: user } });
    // try {
    //     const { uid } = req.params;
    //     if (!uid) return res.sendStatus(400);
    //     const user = await getMongoUserById(uid)
    //     await user.save();
    //     return res.json({ 'statusCode': 200, "message": "user updated", data: user })
    // } catch (error) {
    //     console.log(`An error occured: ${error}`);
    //     return res.json({ 'statusCode': 400, "message": "error updating user", data: null })
    // }
};
exports.updateUserAvatar = updateUserAvatar;
const getUserProfile = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id)
            return res.status(406).json({ 'status': "error", "message": "user id is required" });
        const user = await (0, UserSchema_1.getMongoUserById)(id);
        if (!user)
            return res.json({ 'status': "error", "message": "user not found" });
        let wallet = await (0, WalletSchema_1.getMongodbWalletByUsername)(user.username);
        return res.json({ 'status': "success", "message": "user profile", payload: { user: user, wallet: wallet } });
    }
    catch (error) {
        console.log(`An error occured: ${error}`);
        return res.json({ 'statusCode': 400, "message": "error updating user", data: null });
    }
};
exports.getUserProfile = getUserProfile;
const logoutUser = async (req, res) => {
    const { id } = req.params;
    // todo:: add up activity log
    await (0, ActivitySchema_1.logActivityInDB)({
        uid: id, activity: "logout"
    });
};
exports.logoutUser = logoutUser;
//# sourceMappingURL=usersController.js.map