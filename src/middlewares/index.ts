import express from "express"
import jwt from "jsonwebtoken"
import { getMongoUserById } from "../models/UserSchema"
import { getMongodbWalletByUsername } from "../models/WalletSchema"
require('dotenv').config()

export const isOwner = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { uid } = req.body
    try {
        if (!uid) return res.status(403)
            .json({ status: 'error', message: 'User ID is required' });

        let user = await getMongoUserById(uid)
        if (user.id !== uid) res.status(401)
            .json({ status: 'error', message: 'This is above your pay grade!' });
        next();
    } catch (error) {
        console.log(`An error occured: ${error}`)
    }
}

export const isCorrectPin = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { uid, pin } = req.body
    try {
        if (!uid) return res.status(403)
            .json({ status: 'error', message: 'User ID is required' });

        if (!pin) return res.status(403)
            .json({ status: 'error', message: 'Please provide transaction pin' });

        let user = await getMongoUserById(uid)

        if (!user) return res.status(403)
            .json({ status: 'error', message: 'Please provide transaction pin' });

        let wallet = await getMongodbWalletByUsername(user.username)

        if (user.id !== uid) res.status(403)
            .json({ status: 'error', message: 'This is above your pay grade: NOT OWNER' });

        if (wallet.pin !== pin || wallet.pin == undefined || wallet.pin == "0000") res.status(403)
            .json({ status: 'error', message: 'Incorrect Transaction PIN' });

        next();
    } catch (error) {
        console.log(`An error occured: ${error}`)
    }
}

// export const isAuthenticated = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
//     try {
//         const sessionToken = req.cookies['almohad']
//         if (!sessionToken) res.sendStatus(403).json({ "message": "Unauthenticated" })
//         const existingUser = await getMongoUserBySessionToken(sessionToken)
//         if (!existingUser) res.sendStatus(400).json({ "message": "Unathorized" })
//         merge(req, { identity: existingUser })
//         next();
//     } catch (error) {
//         console.log(`An error occured: ${error}`)
//     }
// }

// export const verifyToken = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
//     const token = req.headers.authorization.split(' ')[1]
//     if (!token) return res.status(403).json({ "message": "A token is required" })
//     try {
//         const decoded = jwt.verify(token, process.env.TOKEN_KEY)
//         console.log(`Decoded token: ${decoded}`)
//         next()
//     } catch (error) {
//         console.log(`An error occured: ${error}`)
//         res.json({ "message": `Error ${error}` })
//     }
// }
export const verifyToken = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
        return res.status(401).json({ status: "error", message: 'A token is required' });
    }
    try {
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET) as { [key: string]: any };
        console.log('Decoded token:', decoded);
        next();
    } catch (error) {
        console.error('An error occurred:', error);
        return res.status(401).json({ status: "error", message: 'Unauthorized' });
    }
};

export const isUserVerified = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { id } = req.body
    if (!id) return res.status(406).json({ "staus": "error", "message": "User could not be verified, pass user id" })
    let user = await getMongoUserById(id)
    if (!user) return res.status(406).json({ "staus": "error", "message": "User not found" })
    if (user.isVerified === false) return res.status(406).json({ "staus": "error", "message": "User not verified" })
    next()
}