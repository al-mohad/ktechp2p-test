"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = exports.generateOTP = exports.authentication = exports.random = void 0;
const crypto_1 = __importDefault(require("crypto"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const otpGenerator = require('otp-generator');
const SECRET = 'almohad';
require('dotenv').config();
exports.random = crypto_1.default.randomBytes(128).toString('base64');
const authentication = (salt, password) => {
    return crypto_1.default.createHmac('sha256', [salt, password].join('/'))
        .update(SECRET).digest('hex');
};
exports.authentication = authentication;
const generateOTP = () => {
    return otpGenerator.generate(6, { upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false, });
};
exports.generateOTP = generateOTP;
const generateToken = (uid, username) => {
    const token = jsonwebtoken_1.default.sign({ _id: uid.toString(), username: username }, process.env.TOKEN_SECRET, {
        expiresIn: "24hr",
    });
    return token;
};
exports.generateToken = generateToken;
//# sourceMappingURL=index.js.map