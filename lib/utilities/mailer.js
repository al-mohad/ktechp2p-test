"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const default_1 = __importDefault(require("../configs/default"));
async function createTestCreds() {
    const creds = await nodemailer_1.default.createTestAccount();
    console.log({ creds });
}
// createTestCreds()
const smtp = default_1.default.smtp;
const transporter = nodemailer_1.default.createTransport({
    ...smtp,
    auth: { user: smtp.user, pass: smtp.pass }
});
async function sendMail(payload) {
    await transporter.sendMail(payload, (error, info) => {
        if (error) {
            console.log(`Nodemailer error: ${error}`);
            return;
        }
        console.log(`Preview url: ${nodemailer_1.default.getTestMessageUrl(info)} `);
    });
}
exports.default = sendMail;
//# sourceMappingURL=mailer.js.map