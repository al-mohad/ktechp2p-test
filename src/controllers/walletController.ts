import express from "express";
import { Double } from "mongodb";
import { createNewWalletInMongdb, getMongodbWalletByUsername } from "../models/WalletSchema";

const Wallets = require("../models/wallets");
const Transactions = require("../models/transactions");

const createWallet = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const { username, uid } = req.body;

        const walletExists = await getMongodbWalletByUsername(username);
        if (walletExists) {
            return res.status(409).json({
                status: false,
                message: 'Wallet already exists',
            })
        }

        const result = await createNewWalletInMongdb({
            uid,
            username
        }
        );
        console.log(result)
        return res.status(201).json({
            status: true,
            message: 'Wallets created successfully',
            data: result
        })
    } catch (err) {
        return res.status(500).json({
            status: true,
            message: `Unable to create wallet. Please try again. \n Error: ${err}`
        })
    }
}

const creditAccount = async (
    amount: Double,
    username: string,
    purpose: string,
    reference: string,
    summary: string,
    trnxSummary: string,
    session: string
) => {
    const wallet = await getMongodbWalletByUsername(username);
    if (!wallet) {
        return {
            status: false,
            statusCode: 404,
            message: `User ${username} doesn\'t exist`,
        };
    }

    const updatedWallet = await Wallets.findOneAndUpdate(
        { username },
        { $inc: { balance: amount } },
        { session }
    );

    const transaction = await Transactions.create(
        [
            {
                trnxType: "CR",
                purpose,
                amount,
                username,
                reference,
                balanceBefore: Number(wallet.balance),
                balanceAfter: Number(wallet.balance) + Number(amount),
                summary,
                trnxSummary,
            },
        ],
        { session }
    );

    console.log(`Credit successful`);
    return {
        status: true,
        statusCode: 201,
        message: "Credit successful",
        data: { updatedWallet, transaction },
    };
};

const debitAccount = async (
    amount: Double,
    username: string,
    purpose: string,
    reference: string,
    summary: string,
    trnxSummary: string,
    session: string
) => {
    const wallet = await Wallets.findOne({ username });
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

    const updatedWallet = await Wallets.findOneAndUpdate(
        { username },
        { $inc: { balance: -amount } },
        { session }
    );
    const transaction = await Transactions.create(
        [
            {
                trnxType: "DR",
                purpose,
                amount,
                username,
                reference,
                balanceBefore: Number(wallet.balance),
                balanceAfter: Number(wallet.balance) - Number(amount),
                summary,
                trnxSummary,
            },
        ],
        { session }
    );

    console.log(`Debit successful`);
    return {
        status: true,
        statusCode: 201,
        message: "Debit successful",
        data: { updatedWallet, transaction },
    };
};

module.exports = {
    createWallet,
    creditAccount,
    debitAccount,
};

