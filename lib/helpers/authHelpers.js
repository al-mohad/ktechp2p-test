"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePassword = exports.validateVerifyUser = exports.validateRequestUserVerification = exports.validateLoginSchema = exports.validateRegistrationSchema = void 0;
// import { signJWT } from 'utilities/jwt';
const UserSchema_1 = require("../models/UserSchema");
const validateRegistrationSchema = async (body) => {
    const { mobileNumber, email, password, username, fcmToken } = body;
    if (!mobileNumber)
        return "mobileNumber is required";
    if (!username)
        return "username is required";
    if (!fcmToken)
        return "fcm token is required";
    if (!password)
        return "password is required";
    const nigerianMobileNumberRegex = /^\+234[789]\d{9}$/;
    if (!nigerianMobileNumberRegex.test(mobileNumber)) {
        return "Invalid mobile number";
    }
    if (mobileNumber) {
        const mobileNumberExist = await (0, UserSchema_1.getMongoUserByMobileNumber)(mobileNumber);
        if (mobileNumberExist !== null)
            return "User with that mobile number already exist.";
    }
    if (username) {
        const usernameExist = await (0, UserSchema_1.getMongoUserByUsername)(username);
        if (usernameExist !== null)
            return "Username taken.";
    }
    if (email) {
        const emailExist = await (0, UserSchema_1.getMongoUserByEmail)(email);
        if (emailExist !== null)
            return "User with that email already exist.";
    }
    return null;
};
exports.validateRegistrationSchema = validateRegistrationSchema;
const validateLoginSchema = async (body) => {
    const { mobileNumber, password } = body;
    if (!mobileNumber)
        return "mobileNumber is required";
    if (!password)
        return "password is required";
    const nigerianMobileNumberRegex = /^\+234[789]\d{9}$/;
    if (!nigerianMobileNumberRegex.test(mobileNumber)) {
        return "Invalid mobile number";
    }
    return null;
};
exports.validateLoginSchema = validateLoginSchema;
const validateRequestUserVerification = async (body) => {
    const { mobileNumber } = body;
    if (!mobileNumber)
        return "Mobile number is missing";
    const nigerianMobileNumberRegex = /^\+234[789]\d{9}$/;
    if (!nigerianMobileNumberRegex.test(mobileNumber)) {
        return "Invalid mobile number";
    }
    return null;
};
exports.validateRequestUserVerification = validateRequestUserVerification;
const validateVerifyUser = async (body) => {
    const { mobileNumber, otp } = body;
    if (!mobileNumber)
        return "Mobile number is missing";
    if (!otp)
        return "OTP code is missing";
    const nigerianMobileNumberRegex = /^\+234[789]\d{9}$/;
    if (!nigerianMobileNumberRegex.test(mobileNumber)) {
        return "Invalid mobile number";
    }
    return null;
};
exports.validateVerifyUser = validateVerifyUser;
const validatePassword = async (password) => {
};
exports.validatePassword = validatePassword;
// FIXIT::experiment
// export function signAccessToken(user: Document) {
//     const payload = user.toJSON()
//     const accessToken = signJWT(payload, "accessTokenPrivateKey")
//     return accessToken
// }
// export function signRefreshToken({ userId }: { userId: String }) { }
//# sourceMappingURL=authHelpers.js.map