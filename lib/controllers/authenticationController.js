"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassword = exports.register = exports.login = exports.verifyPasswordOTP = exports.verifyUser = exports.verifyOTPCode = exports.requestChangePasswordOTP = exports.requestUserVerification = exports.requestOTPCode = void 0;
const termii_node_client_1 = require("termii-node-client");
const firebaseController_1 = __importDefault(require("../controllers/firebaseController"));
const redisController_1 = require("../controllers/redisController");
const helpers_1 = require("../helpers");
const authHelpers_1 = require("../helpers/authHelpers");
const UserSchema_1 = require("../models/UserSchema");
const WalletSchema_1 = require("../models/WalletSchema");
require('dotenv').config();
const firebaseController = new firebaseController_1.default();
// todo: abstract this to a controller
const requestOTPCode = async (req, res) => {
    const termii = (0, termii_node_client_1.Termii)("TLjKp4BnWJMsxCKBS8qrJevIfl1Qeb45Tpu1lhHG9xtffzrwCEnZ88u2eswB5P");
    const { mobileNumber } = req.body;
    if (!mobileNumber)
        res.json({ "status": "error", "message": "Mobile number is missing" });
    const generatedOTP = (0, helpers_1.generateOTP)(); // Generate a 6-digit OTP
    redisController_1.redisController.write(`otp-${mobileNumber}`, generatedOTP);
    const msgDetails = {
        sms: `Use ${generatedOTP} code to verify and continue your registration on Flash. The OTP code expires in the next 15 minutes`,
        to: mobileNumber,
        from: "N-Alert",
    };
    const sendsms = await termii.message().sendSmsDnd(msgDetails, false).catch((e) => {
        console.log(`error sending sms: ${e}`);
    });
    return res.json({ "data": `SMS Sent to ${mobileNumber}` });
};
exports.requestOTPCode = requestOTPCode;
const requestUserVerification = async (req, res) => {
    const termii = (0, termii_node_client_1.Termii)("TLjKp4BnWJMsxCKBS8qrJevIfl1Qeb45Tpu1lhHG9xtffzrwCEnZ88u2eswB5P");
    const { mobileNumber } = req.body;
    let error = await (0, authHelpers_1.validateRequestUserVerification)(req.body);
    console.log(`Error (validateRequestUserVerification): ${error}`);
    if (error !== null)
        return res.status(406).json({ status: 'error', message: error });
    const generatedOTP = (0, helpers_1.generateOTP)(); // Generate a 6-digit OTP
    redisController_1.redisController.write(`otp-${mobileNumber}`, generatedOTP);
    const msgDetails = {
        sms: `Use ${generatedOTP} code to verify and continue your registration on Flash. The OTP code expires in the next 15 minutes`,
        to: mobileNumber,
        from: "N-Alert",
    };
    await termii.message().sendSmsDnd(msgDetails, false).catch((e) => {
        console.log(`error sending sms: ${e}`);
    });
    return res.status(200).json({ "status": "success", "message": `OTP Sent to ${mobileNumber}` });
};
exports.requestUserVerification = requestUserVerification;
const requestChangePasswordOTP = async (req, res) => {
    const termii = (0, termii_node_client_1.Termii)("TLjKp4BnWJMsxCKBS8qrJevIfl1Qeb45Tpu1lhHG9xtffzrwCEnZ88u2eswB5P");
    const { mobileNumber } = req.body;
    if (!mobileNumber)
        res.status(403).json({ "status": "error", "message": "Mobile number is missing" });
    const userExist = await (0, UserSchema_1.getMongoUserByMobileNumber)(mobileNumber);
    if (!userExist)
        return res.status(403).json({ "status": "error", "message": "User not registered" });
    const generatedOTP = (0, helpers_1.generateOTP)(); // Generate a 6-digit OTP
    redisController_1.redisController.write(`passwordOTP-${mobileNumber}`, generatedOTP);
    const msgDetails = {
        sms: `Use ${generatedOTP} code to verify and reset your password on Flash. The OTP code expires in the next 15 minutes`,
        to: mobileNumber,
        from: "N-Alert",
    };
    await termii.message().sendSmsDnd(msgDetails, false).catch((e) => {
        console.log(`error sending sms: ${e}`);
    });
    return res.status(200).json({ "status": "success", "message": `SMS Sent to ${mobileNumber}` });
};
exports.requestChangePasswordOTP = requestChangePasswordOTP;
const verifyOTPCode = async (req, res) => {
    const { mobileNumber, otpCode } = req.body;
    if (!mobileNumber || !otpCode)
        res.json({ "status": "error", "message": "Mobile number or OTP Code is missing" });
    let error = await (0, authHelpers_1.validateRequestUserVerification)(req.body);
    console.log(`Error (validateRequestUserVerification): ${error}`);
    if (error !== null)
        return res.status(406).json({ status: 'error', message: error });
    try {
        let retrievedOtp = await redisController_1.redisController.read(`otp-${mobileNumber}`);
        console.log(`retrieved otp ${retrievedOtp}`);
        if (!retrievedOtp)
            return res.json({ "status": "success", "message": "OTP code expired" });
        if (retrievedOtp !== otpCode)
            return res.json({ "status": "success", "message": "Invalid OTP code" });
        const user = await (0, UserSchema_1.getMongoUserByMobileNumber)(mobileNumber);
        if (!user)
            return res.json({ "status": "error", "message": "User not found" });
        user.isVerified = true;
        user.save();
        return res.json({ "status": "success", "message": `OTP for ${mobileNumber} is verified` });
    }
    catch (error) {
        console.log(`An error occured ${error}`);
    }
};
exports.verifyOTPCode = verifyOTPCode;
const verifyUser = async (req, res) => {
    const { mobileNumber, otp } = req.body;
    let error = await (0, authHelpers_1.validateVerifyUser)(req.body);
    console.log(`Error (validateVerifyUser): ${error}`);
    if (error !== null)
        return res.status(406).json({ status: 'error', message: error });
    try {
        let retrievedOtp = await redisController_1.redisController.read(`otp-${mobileNumber}`);
        console.log(`retrieved otp ${retrievedOtp}`);
        if (!retrievedOtp)
            return res.json({ "status": "success", "message": "OTP code expired" });
        if (retrievedOtp !== otp)
            return res.status(406).json({ "status": "error", "message": "Invalid OTP code" });
        const user = await (0, UserSchema_1.getMongoUserByMobileNumber)(mobileNumber);
        if (!user)
            return res.json({ "status": "error", "message": "User not found" });
        user.isVerified = true;
        user.save();
        return res.json({ "status": "success", "message": `User ${user.username} is now verified` });
    }
    catch (error) {
        console.log(`An error occured ${error}`);
    }
};
exports.verifyUser = verifyUser;
const verifyPasswordOTP = async (req, res) => {
    const { mobileNumber, otp } = req.body;
    if (!mobileNumber || !otp) {
        return res.status(400).json({ status: "error", message: "Mobile number or OTP Code is missing" });
    }
    try {
        let retrievedOtp = await redisController_1.redisController.read(`passwordOTP-${mobileNumber}`);
        console.log(`retrieved otp ${retrievedOtp}`);
        if (!retrievedOtp) {
            return res.status(403).json({ status: "error", message: "OTP code expired" });
        }
        if (retrievedOtp !== otp) {
            return res.status(403).json({ status: "error", message: "Invalid OTP code" });
        }
        const user = await (0, UserSchema_1.getMongoUserByMobileNumber)(mobileNumber);
        if (!user) {
            return res.status(404).json({ status: "error", message: "User not found" });
        }
        return res.status(200).json({ status: "success", message: `OTP for ${mobileNumber} is verified` });
    }
    catch (error) {
        console.log(`An error occured ${error}`);
        return res.status(500).json({ status: "error", message: "Internal server error" });
    }
};
exports.verifyPasswordOTP = verifyPasswordOTP;
const login = async (req, res) => {
    try {
        const { mobileNumber, password } = req.body;
        let error = await (0, authHelpers_1.validateLoginSchema)(req.body);
        if (error !== null)
            console.log(`Error (validateLoginSchema): ${error}`);
        if (error !== null)
            return res.status(406).json({ status: 'error', message: error });
        const rawUser = await (0, UserSchema_1.getMongoUserByMobileNumber)(mobileNumber).select("+authentication.salt +authentication.password");
        if (!rawUser)
            return res.status(404).json({ "status": "error", "message": "User is not registered" });
        // if (rawUser.isVerified === false) return res.status(403).json({ "status": "error", "message": "user not verified" })
        const expectedHash = (0, helpers_1.authentication)(rawUser.authentication.salt, password);
        if (rawUser.authentication.password !== expectedHash)
            return res.status(400).json({ status: 'error', message: "Invalid credentials" });
        const token = (0, helpers_1.generateToken)(rawUser._id, rawUser.username);
        await rawUser.save();
        // merge(req, { identity: rawUser })
        let user = await (0, UserSchema_1.getMongoUserByMobileNumber)(mobileNumber);
        let wallet = await (0, WalletSchema_1.getMongodbWalletByUsername)(rawUser.username);
        return res.status(200).json({ "status": "success", "message": "sign in successfully", "payload": { token: token, user: user, wallet: wallet } });
    }
    catch (error) {
        console.log(`An error occured: ${error}`);
        return res.status(406).json({ "status": "error", "message": "backend " });
    }
};
exports.login = login;
// export const register = async (req: express.Request, res: express.Response) => {
//     try {
//         const { mobileNumber, email, password, username } = req.body;
//         let error = await validateRegistrationSchema(req.body)
//         console.log(`Error (validateRegistrationSchema): ${error}`)
//         if (error !== null) res.status(406).json({ 'status': 'error', 'message': error })
//         const salt = random;
//         await createUserInDB({
//             mobileNumber,
//             email,
//             username,
//             authentication: {
//                 salt,
//                 password: authentication(salt, password),
//             },
//         });
//         let newUser = await getMongoUserByMobileNumber(mobileNumber)
//         const token = generateToken(newUser._id);
//         const generatedOTP = generateOTP(); // Generate a 6-digit OTP
//         redisController.write(`otp-${mobileNumber}`, generatedOTP)
//         const msgDetails = {
//             sms: `Use ${generatedOTP} code to verify and continue your registration on Flash. The OTP code expires in the next 15 minutes`,
//             to: mobileNumber,
//             from: "N-Alert",
//         };
//         const termii = Termii("TLjKp4BnWJMsxCKBS8qrJevIfl1Qeb45Tpu1lhHG9xtffzrwCEnZ88u2eswB5P");
//         await termii.message().sendSms(msgDetails)
//         res.status(200).json({ "status": "success", "message": "User registered successfully", "payload": { "token": token, "data": newUser } })
//     } catch (error) {
//         console.log(error);
//         res.sendStatus(400).send(`Something went wrong: ${error}`);
//     }
// };
const register = async (req, res) => {
    try {
        const { mobileNumber, email, password, username, fcmToken } = req.body;
        let error = await (0, authHelpers_1.validateRegistrationSchema)(req.body);
        if (error !== null)
            console.log(`Error (validateRegistrationSchema): ${error}`);
        if (error !== null)
            return res.status(406).json({ "status": "error", message: `${error}` });
        let e = email ?? ' ';
        const salt = helpers_1.random;
        await (0, UserSchema_1.createUserInDB)({
            mobileNumber,
            e,
            username,
            fcmToken,
            authentication: {
                salt,
                password: (0, helpers_1.authentication)(salt, password),
            },
        });
        let newUser = await (0, UserSchema_1.getMongoUserByMobileNumber)(mobileNumber);
        await firebaseController.createUser(newUser.toObject());
        await (0, WalletSchema_1.createNewWalletInMongdb)({ "uid": newUser._id, "username": newUser.username });
        let newWallet = await (0, WalletSchema_1.getMongodbWalletByUsername)(newUser.username);
        const token = (0, helpers_1.generateToken)(newUser._id, newUser.username);
        const generatedOTP = (0, helpers_1.generateOTP)(); // Generate a 6-digit OTP
        await redisController_1.redisController.write(`otp-${mobileNumber}`, generatedOTP);
        const msgDetails = {
            sms: `Use ${generatedOTP} code to verify and continue your registration on Flash. The OTP code expires in the next 15 minutes`,
            to: mobileNumber,
            from: 'N-Alert',
        };
        const termii = (0, termii_node_client_1.Termii)('TLjKp4BnWJMsxCKBS8qrJevIfl1Qeb45Tpu1lhHG9xtffzrwCEnZ88u2eswB5P');
        await termii.message().sendSmsDnd(msgDetails, false);
        return res.status(200)
            .json({ "status": "success", "message": 'User registered successfully', payload: { token, user: newUser, wallet: newWallet } });
    }
    catch (error) {
        console.log(error);
        return res.status(406).json({ "status": "success", "message": `backend: ${error}` });
    }
};
exports.register = register;
// todo: change password
const changePassword = async (req, res) => {
    const { mobileNumber, password } = req.body;
    const userExist = await (0, UserSchema_1.getMongoUserByMobileNumber)(mobileNumber);
    if (!userExist)
        return res.status(403).json({ "status": "error", "message": "user not found", "payload": { "data": null } });
    const salt = helpers_1.random;
    userExist.authentication = {
        salt,
        password: (0, helpers_1.authentication)(salt, password),
    };
    userExist.save();
    return res.status(200).json({ "status": "succes", "message": "Password changed successfully", "payload": { "data": null } });
};
exports.changePassword = changePassword;
//# sourceMappingURL=authenticationController.js.map