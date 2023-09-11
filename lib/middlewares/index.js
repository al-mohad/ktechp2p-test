"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isUserVerified = exports.verifyToken = exports.isCorrectPin = exports.isOwner = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const UserSchema_1 = require("../models/UserSchema");
const WalletSchema_1 = require("../models/WalletSchema");
require('dotenv').config();
const isOwner = async (req, res, next) => {
    const { uid } = req.body;
    try {
        if (!uid)
            return res.status(403)
                .json({ status: 'error', message: 'User ID is required' });
        let user = await (0, UserSchema_1.getMongoUserById)(uid);
        if (user.id !== uid)
            res.status(401)
                .json({ status: 'error', message: 'This is above your pay grade!' });
        next();
    }
    catch (error) {
        console.log(`An error occured: ${error}`);
    }
};
exports.isOwner = isOwner;
const isCorrectPin = async (req, res, next) => {
    const { uid, pin } = req.body;
    try {
        if (!uid)
            return res.status(403)
                .json({ status: 'error', message: 'User ID is required' });
        if (!pin)
            return res.status(403)
                .json({ status: 'error', message: 'Please provide transaction pin' });
        let user = await (0, UserSchema_1.getMongoUserById)(uid);
        if (!user)
            return res.status(403)
                .json({ status: 'error', message: 'Please provide transaction pin' });
        let wallet = await (0, WalletSchema_1.getMongodbWalletByUsername)(user.username);
        if (user.id !== uid)
            res.status(403)
                .json({ status: 'error', message: 'This is above your pay grade: NOT OWNER' });
        if (wallet.pin !== pin || wallet.pin == undefined || wallet.pin == "0000")
            res.status(403)
                .json({ status: 'error', message: 'Incorrect Transaction PIN' });
        next();
    }
    catch (error) {
        console.log(`An error occured: ${error}`);
    }
};
exports.isCorrectPin = isCorrectPin;
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
const verifyToken = async (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
        return res.status(401).json({ status: "error", message: 'A token is required' });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.TOKEN_SECRET);
        console.log('Decoded token:', decoded);
        next();
    }
    catch (error) {
        console.error('An error occurred:', error);
        return res.status(401).json({ status: "error", message: 'Unauthorized' });
    }
};
exports.verifyToken = verifyToken;
const isUserVerified = async (req, res, next) => {
    const { id } = req.body;
    if (!id)
        return res.status(406).json({ "staus": "error", "message": "User could not be verified, pass user id" });
    let user = await (0, UserSchema_1.getMongoUserById)(id);
    if (!user)
        return res.status(406).json({ "staus": "error", "message": "User not found" });
    if (user.isVerified === false)
        return res.status(406).json({ "staus": "error", "message": "User not verified" });
    next();
};
exports.isUserVerified = isUserVerified;
//# sourceMappingURL=index.js.map