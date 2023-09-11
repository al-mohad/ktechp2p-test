
import express from "express";

import { validateDeleteUserBody } from "../helpers/userHelpers";
import { logActivityInDB } from "../models/ActivitySchema";
import { deleteMongoUserById, getMongoUserById, getMongoUsers } from "../models/UserSchema";
import { deleteMongoWalletByUID, getMongodbWalletByUsername } from "../models/WalletSchema";

export const getAllUsers = async (req: express.Request, res: express.Response) => {
    try {
        const users = await getMongoUsers()
        return res.status(200).json({
            "status": "success", "message": "all users retrieved",
            payload: { users: users }
        })
    } catch (error) {
        console.log(`An error occured: ${error}`);
        return res.json({ "status": "error", "message": "error occured" })
    }
}

export const deleteUser = async (req: express.Request, res: express.Response) => {
    try {
        const { uid } = req.body;

        let error = await validateDeleteUserBody(req.body);
        console.log(`Error (validateDeleteUserBody): ${error}`);
        if (error !== null) return res.status(406).json({ status: 'error', message: error });

        /*
        todo:: await Promise.all([
            deleteMongoUserById(id),deleteMongoWalletByUID(id),
        ])
        */
        const deletedUser = await deleteMongoUserById(uid);
        const deletedWallet = await deleteMongoWalletByUID(uid);

        return res.json({ 'statusCode': 200, "message": "user deleted", payload: { deletedUser: deletedUser, deletedWallet: deletedWallet } }).end()
    } catch (error) {
        console.log(`An error occured: ${error}`);
        return res.json({ 'statusCode': 400, "message": "error deleting user", data: null })
    }
}

export const updateUser = async (req: express.Request, res: express.Response) => {
    try {
        const { uid, username } = req.body;
        if (!username) res.sendStatus(400);
        const user = await getMongoUserById(uid)
        user.username = username;
        await user.save();
        res.json({ 'statusCode': 200, "message": "user updated", data: user })

    } catch (error) {
        console.log(`An error occured: ${error}`);
        res.json({ 'statusCode': 400, "message": "error updating user", data: null })
    }
}
export const updateUserAvatar = async (req: express.Request, res: express.Response) => {
    console.log(req.file)
    let userId = req.file.filename.split('.')[0]
    console.log(`USER ID: ${userId}`)
    let user = await getMongoUserById(userId)
    user.profileImage = req.file.path
    user.save()
    return res.status(200).json({ "status": "success", "message": "Profile Image Updated", payload: { user: user } })
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
}
export const getUserProfile = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;
        if (!id) return res.status(406).json({ 'status': "error", "message": "user id is required" })
        const user = await getMongoUserById(id)
        if (!user) return res.json({ 'status': "error", "message": "user not found" })
        let wallet = await getMongodbWalletByUsername(user.username)
        return res.json({ 'status': "success", "message": "user profile", payload: { user: user, wallet: wallet } })
    } catch (error) {
        console.log(`An error occured: ${error}`);
        return res.json({ 'statusCode': 400, "message": "error updating user", data: null })
    }
}

export const logoutUser = async (req: express.Request, res: express.Response) => {
    const { id } = req.body
    // todo:: add up activity log
    // todo:: invalidate jwt
    await logActivityInDB({
        uid: id, activity: "logout"
    })
    return res.status(401).json({ "status": "success", "message": "User logout successfully" });
}