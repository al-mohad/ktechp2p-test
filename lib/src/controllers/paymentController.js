"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transferFundsToUser = exports.getUserTransactions = exports.debitUserWallet = exports.fundUserWallet = exports.getUserWallet = void 0;
const paymentHelpers_1 = require("../helpers/paymentHelpers");
const TransactionSchema_1 = require("../models/TransactionSchema");
const UserSchema_1 = require("../models/UserSchema");
const WalletSchema_1 = require("../models/WalletSchema");
// const Transactions = require("../models/transactions");
const mongoose = require("mongoose");
const { v4 } = require("uuid");
const getUserWallet = async (req, res, next) => {
    const { username } = req.body;
    let error = await (0, paymentHelpers_1.validateGetUserWallet)(req.body);
    if (error !== null)
        console.log(`Error (validateGetUserWallet): ${error}`);
    if (error !== null)
        return res.status(406).json({ status: 'error', message: error });
    let wallet = await (0, WalletSchema_1.getMongodbWalletByUsername)(username);
    return res.status(200)
        .json({ status: 'success', message: 'User registered successfully', payload: { wallet: wallet } });
};
exports.getUserWallet = getUserWallet;
const fundUserWallet = async (req, res, next) => {
    const { username, amount, purpose, summary } = req.body;
    let error = await (0, paymentHelpers_1.validateFundWalletBody)(req.body);
    if (error !== null)
        console.log(`Error (validateFundWalletBody): ${error}`);
    if (error !== null)
        return res.status(406).json({ status: 'error', message: error });
    const reference = v4();
    let { message, data } = await (0, paymentHelpers_1.performCreditWallet)(amount, username, purpose, `Ref: ${reference}`, summary, `tranxSumry: ${username} ${purpose} ${amount} on ${Date.now().toLocaleString} `);
    return res.status(201).json({ status: 'success', message: message, payload: { data } });
};
exports.fundUserWallet = fundUserWallet;
// todo:: check if wallet pin is correct
const debitUserWallet = async (req, res, next) => {
    const { username, amount, purpose, summary } = req.body;
    let error = await (0, paymentHelpers_1.validateFundWalletBody)(req.body);
    if (error !== null)
        console.log(`Error (validateFundWalletBody): ${error}`);
    if (error !== null)
        return res.status(406).json({ status: 'error', message: error });
    const reference = v4();
    let { message, data } = await (0, paymentHelpers_1.performDebitWallet)(amount, username, purpose, `Ref: ${reference}`, summary, `tranxSumry: ${username} ${purpose} ${amount} on ${Date.now().toLocaleString} `);
    return res.status(201).json({ status: 'success', message: message, payload: { data } });
};
exports.debitUserWallet = debitUserWallet;
const getUserTransactions = async (req, res) => {
    try {
        let { id } = req.params;
        let user = await (0, UserSchema_1.getMongoUserById)(id);
        if (!user)
            return res.json({ "status": "error", "message": "user not found" });
        let wallet = await (0, WalletSchema_1.getMongodbWalletByUsername)(user.username);
        if (!wallet)
            return res.json({ "status": "error", "message": "user wallet not found" });
        const transactions = await (0, TransactionSchema_1.getMongoTransactionsByUserId)(id);
        res.json({ 'statusCode': 200, "message": "transactions retrieved", payload: { transactions } });
    }
    catch (error) {
        console.log(`An error occured: ${error}`);
        res.json({ 'statusCode': 400, "message": "error occured", data: null });
    }
};
exports.getUserTransactions = getUserTransactions;
// todo:: check if wallet pin is correct
const transferFundsToUser = async (req, res) => {
    const { toUsername, fromUsername, amount, summary, purpose } = req.body;
    const session = await mongoose.startSession();
    session.startTransaction();
    const reference = v4();
    try {
        const transferResult = await Promise.all([
            (0, paymentHelpers_1.performDebitWallet)(amount, fromUsername, purpose, `Ref: ${reference}`, summary, `tranxSumry: ${fromUsername} ${purpose} ${amount} on ${Date.now()} `),
            (0, paymentHelpers_1.performCreditWallet)(amount, toUsername, 'deposit', `Ref: ${reference}`, summary, `tranxSumry: ${toUsername} ${purpose} ${amount} on ${Date.now().toLocaleString} `)
        ]);
        const failedTxns = transferResult.filter((result) => result.status !== true);
        if (failedTxns.length) {
            const errors = failedTxns.map((a) => a.message);
            await session.abortTransaction();
            return res.status(400).json({
                status: false,
                message: errors,
            });
        }
        await session.commitTransaction();
        session.endSession();
        return res.status(201).json({
            status: true,
            message: "Transfer successful",
        });
    }
    catch (error) {
        await session.abortTransaction();
        session.endSession();
        return res.status(500).json({
            status: false,
            message: `Unable to find perform transfer. Please try again. \n Error: ${error}`,
        });
    }
};
exports.transferFundsToUser = transferFundsToUser;
//# sourceMappingURL=paymentController.js.map