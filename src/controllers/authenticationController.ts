import express from "express";
import { authentication, generateOTP, generateToken, random } from "../helpers";
import { validateLoginSchema, validateRegistrationSchema } from "../helpers/authHelpers";
import { createUserInDB, getMongoUserByMobileNumber } from "../models/UserSchema";
import { createNewWalletInMongdb, getMongodbWalletByUsername } from "../models/WalletSchema";
require('dotenv').config()



export const login = async (req: express.Request, res: express.Response) => {
    try {
        const { mobileNumber, password } = req.body;

        let error = await validateLoginSchema(req.body);
        if (error !== null) console.log(`Error (validateLoginSchema): ${error}`);
        if (error !== null) return res.status(406).json({ status: 'error', message: error });

        const rawUser = await getMongoUserByMobileNumber(mobileNumber).select(
            "+authentication.salt +authentication.password"
        );

        if (!rawUser)
            return res.status(404).json({ "status": "error", "message": "User is not registered" })
        // if (rawUser.isVerified === false) return res.status(403).json({ "status": "error", "message": "user not verified" })
        const expectedHash = authentication(rawUser.authentication.salt, password);
        if (rawUser.authentication.password !== expectedHash)
            return res.status(400).json({ status: 'error', message: "Invalid credentials" });

        const token = generateToken(rawUser._id, rawUser.username);
        await rawUser.save();

        // merge(req, { identity: rawUser })

        let user = await getMongoUserByMobileNumber(mobileNumber)
        let wallet = await getMongodbWalletByUsername(rawUser.username)

        return res.status(200).json({ "status": "success", "message": "sign in successfully", "payload": { token: token, user: user, wallet: wallet } })
    } catch (error) {
        console.log(`An error occured: ${error}`);
        return res.status(406).json({ "status": "error", "message": "backend " })
    }
};


export const register = async (req: express.Request, res: express.Response) => {
    try {
        const { mobileNumber, email, password, username, fcmToken } = req.body;

        let error = await validateRegistrationSchema(req.body);
        if (error !== null) console.log(`Error (validateRegistrationSchema): ${error}`);
        if (error !== null) return res.status(406).json({ "status": "error", message: `${error}` });

        const salt = random;
        await createUserInDB({
            mobileNumber,
            email,
            username,
            fcmToken,
            authentication: {
                salt,
                password: authentication(salt, password),
            },
        });

        let newUser = await getMongoUserByMobileNumber(mobileNumber);


        await createNewWalletInMongdb({ "uid": newUser._id, "username": newUser.username })
        let newWallet = await getMongodbWalletByUsername(newUser.username)
        const token = generateToken(newUser._id, newUser.username);

        const generatedOTP = generateOTP(); // Generate a 6-digit OTP



        return res.status(200)
            .json({ "status": "success", "message": 'User registered successfully', payload: { token, user: newUser, wallet: newWallet } });
    } catch (error) {
        console.log(error);
        return res.status(406).json({ "status": "success", "message": `backend: ${error}` });
    }
};
