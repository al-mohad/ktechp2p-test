"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.performDebitWallet = exports.performCreditWallet = exports.createWallet = exports.validateFundWalletBody = exports.validateGetUserWallet = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const TransactionSchema_1 = require("../models/TransactionSchema");
const WalletSchema_1 = require("../models/WalletSchema");
const validateGetUserWallet = async (body) => {
    const { username } = body;
    if (!username)
        return "Username is required";
    let wallet = await (0, WalletSchema_1.getMongodbWalletByUsername)(username);
    if (!wallet)
        return "User wallet does not exist";
    return null;
};
exports.validateGetUserWallet = validateGetUserWallet;
const validateFundWalletBody = async (body) => {
    const { username, amount } = body;
    if (!username)
        return "Username is required";
    if (!amount)
        return "Amount is required";
    if (amount === 0 || amount === 0.0 || amount == null)
        return "Amount not acceptable";
    let wallet = await (0, WalletSchema_1.getMongodbWalletByUsername)(username);
    if (!wallet)
        return "User wallet does not exist";
    return null;
};
exports.validateFundWalletBody = validateFundWalletBody;
//
const createWallet = async (username, uid) => {
    try {
        const walletExists = await (0, WalletSchema_1.getMongodbWalletByUsername)(username);
        if (walletExists)
            return 'Wallet already exists';
        const result = await (0, WalletSchema_1.createNewWalletInMongdb)({
            uid,
            username
        });
        console.log(result);
        return 'Wallets created successfully';
    }
    catch (err) {
        return `Unable to create wallet. Please try again. \n Error: ${err}`;
    }
};
exports.createWallet = createWallet;
const performCreditWallet = async (amount, username, purpose, reference, summary, trnxSummary) => {
    const wallet = await (0, WalletSchema_1.getMongodbWalletByUsername)(username);
    if (!wallet) {
        return {
            status: false,
            statusCode: 404,
            message: `User ${username} doesn\'t exist`,
        };
    }
    const session = await mongoose_1.default.startSession();
    session.startTransaction();
    const updatedWallet = await (0, WalletSchema_1.updateMongoWalletByUsername)(username, { $inc: { balance: amount } });
    // BUG:: fix transaction not saving
    const transaction = await (0, TransactionSchema_1.createTransactionInMongdb)({
        trnxType: "CR",
        purpose,
        amount,
        walletId: wallet.id,
        uid: wallet.uid,
        reference,
        balanceBefore: Number(wallet.balance),
        balanceAfter: Number(wallet.balance) + Number(amount),
        summary,
        trnxSummary,
        session
    });
    console.log(`Credit successful`);
    await session.commitTransaction();
    session.endSession();
    return {
        status: true,
        statusCode: 201,
        message: "Credit successful",
        data: { updatedWallet, transaction },
    };
};
exports.performCreditWallet = performCreditWallet;
const performDebitWallet = async (amount, username, purpose, reference, summary, trnxSummary) => {
    const wallet = await (0, WalletSchema_1.getMongodbWalletByUsername)(username);
    if (!wallet) {
        return {
            status: false,
            statusCode: 404,
            message: `User ${username} doesn\'t exist`,
        };
    }
    if (wallet.balance < amount) {
        return {
            status: false,
            statusCode: 400,
            message: `User ${username} has insufficient balance`,
        };
    }
    const updatedWallet = await (0, WalletSchema_1.updateMongoWalletByUsername)(username, { $inc: { balance: -amount } });
    const transaction = await (0, TransactionSchema_1.createTransactionInMongdb)({
        trnxType: "DR",
        purpose,
        amount,
        username,
        reference,
        balanceBefore: Number(wallet.balance),
        balanceAfter: Number(wallet.balance) - Number(amount),
        summary,
        trnxSummary,
    });
    console.log(`Debit successful`);
    return {
        status: true,
        statusCode: 201,
        message: "Debit successful",
        data: { updatedWallet, transaction },
    };
};
exports.performDebitWallet = performDebitWallet;
//# sourceMappingURL=paymentHelpers.js.map