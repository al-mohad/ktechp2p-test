"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testUpload = exports.sendSMS = exports.getotp = exports.sendOTP = exports.getRepos = exports.playingPlayground = void 0;
const helpers_1 = require("../helpers");
// import { client } from "../connections/redis.connection";
const termii_node_client_1 = require("termii-node-client");
const redisController_1 = require("../controllers/redisController");
// Send and retrieve some values
// await redisClient.set('key', 'node redis');
// const value = await redisClient.get('key');
// console.log("found value: ", value)
const playingPlayground = async (req, res) => {
    return res.status(200).send("Playground up and serving");
};
exports.playingPlayground = playingPlayground;
const getRepos = async (req, res, next) => {
    try {
        const { username } = req.params;
        const response = await fetch(`https://api.github.com/users/${username}`);
        const data = await response.json();
        const repos = data.public_repos;
        // client.set("key", username)
        res.json({ "data": `${username} has ${repos}` });
    }
    catch (error) {
        console.log(`An error occured: ${error}`);
    }
};
exports.getRepos = getRepos;
// function generateOTP(length: number): string {
//     const digits = '0123456789';
//     let otp = '';
//     for (let i = 0; i < length; i++) {
//         const index = crypto.randomInt(0, digits.length);
//         otp += digits[index];
//     }
//     return otp;
// }
const sendOTP = async (req, res, next) => {
    try {
        const { username } = req.body;
        console.log(req.body);
        // if (!username || !optValue) { return res.json({ "data": `username and otpValue are required` }); }
        // client.set(`otp-${username}`, optValue)
        // const otp = crypto.randomBytes(Math.ceil(32 / 2)).toString('hex').slice(0, 32);
        const otp = (0, helpers_1.generateOTP)(); // Generate a 6-digit OTP
        redisController_1.redisController.write(`otp-${username}`, otp);
        // await client.setEx(`otp-${username}`, 10000, JSON.stringify(otp))
        // RedisController.write(`otp-${username}`, 10000, JSON.stringify(otp));
        res.setHeader('Content-Type', 'text/plain');
        // return res.status(200).json({ message: 'ok' });
        res.json({ "data": `OTP Generated: ${otp} for ${username}` });
    }
    catch (error) {
        console.log(`An error occured: ${error}`);
    }
};
exports.sendOTP = sendOTP;
const getotp = async (req, res, next) => {
    try {
        const { username, otpValue } = req.body;
        console.log(req.body);
        if (!username || !otpValue) {
            return res.json({ "data": `username and otpValue are required` });
        }
        // if (data !== otpValue) res.json({ 'error': 'invalid otp' })
        // res.setHeader('Content-Type', 'text/plain');
        // return res.status(200).json({ message: 'ok' });
        const retrievedOtp = redisController_1.redisController.read(`otp-${username}`);
        console.log(`retrieved otp ${retrievedOtp}`);
        if (!retrievedOtp || redisController_1.redisController == null)
            return res.json({ 'error': 'OTP expired' });
        if (retrievedOtp !== otpValue)
            return res.json({ 'error': 'Invalid OTP' });
        return res.json({ "data": `OTP for ${username} is verified` });
    }
    catch (error) {
        console.log(`An error occured: ${error}`);
    }
};
exports.getotp = getotp;
const sendSMS = async (req, res, next) => {
    const termii = (0, termii_node_client_1.Termii)("TLjKp4BnWJMsxCKBS8qrJevIfl1Qeb45Tpu1lhHG9xtffzrwCEnZ88u2eswB5P");
    const { number, otp } = req.body;
    if (!number || !otp)
        res.json({ "status": "error", "message": "Enter phone number and otp" });
    // todo regex to verify phone number
    const msgDetails = {
        sms: `Use ${otp} code to verify and continue your registration on Flash. The OTP code expires in the next 15 minutes`,
        to: number,
        from: "N-Alert",
    };
    const sendsms = await termii.message().sendSms(msgDetails).catch((e) => {
        console.log(`error sending sms: ${e}`);
    });
    return res.json({ "data": `SMS Sent to ${number}` });
};
exports.sendSMS = sendSMS;
const testUpload = async (req, res, next) => {
};
exports.testUpload = testUpload;
//# sourceMappingURL=playgroundController.js.map