"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SMSController = void 0;
const termii_node_client_1 = require("termii-node-client");
class SMSController {
    constructor() {
        this.#init();
    }
    async #init() {
    }
    sendOTPCode = async (otp, mobileNumber) => {
        const termii = (0, termii_node_client_1.Termii)("TLjKp4BnWJMsxCKBS8qrJevIfl1Qeb45Tpu1lhHG9xtffzrwCEnZ88u2eswB5P");
        const msgDetails = {
            sms: `Use ${otp} code to verify and continue your registration on Flash. The OTP code expires in the next 15 minutes`,
            to: mobileNumber,
            from: "N-Alert",
        };
        const sendsms = await termii.message().sendSmsDnd(msgDetails, false).catch((e) => {
            console.log(`error sending sms: ${e}`);
        });
    };
}
exports.SMSController = SMSController;
//# sourceMappingURL=smsController.js.map