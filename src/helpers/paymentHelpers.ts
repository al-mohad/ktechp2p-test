import { Double } from "mongodb";
import mongoose from "mongoose";
import { createTransactionInMongdb } from "../models/TransactionSchema";
import { createNewWalletInMongdb, getMongodbWalletByUsername, updateMongoWalletByUsername } from "../models/WalletSchema";
export const validateGetUserWallet = async (body: any) => {
    const { username } = body;
    if (!username) return "Username is required"
    let wallet = await getMongodbWalletByUsername(username);
    if (!wallet) return "User wallet does not exist"
    return null
}
export const validateFundWalletBody = async (body: any) => {
    const { username, amount } = body;

    if (!username) return "Username is required"
    if (!amount) return "Amount is required"
    if (amount === 0 || amount === 0.0 || amount == null) return "Amount not acceptable"
    let wallet = await getMongodbWalletByUsername(username);
    if (!wallet) return "User wallet does not exist"
    return null
}
//

export const createWallet = async (username: string, uid: string) => {
    try {

        const walletExists = await getMongodbWalletByUsername(username);
        if (walletExists) return 'Wallet already exists';

        const result = await createNewWalletInMongdb({
            uid,
            username
        }
        );

        console.log(result)
        return 'Wallets created successfully'

    } catch (err) {
        return `Unable to create wallet. Please try again. \n Error: ${err}`

    }
};

export const performCreditWallet = async (
    amount: Double,
    username: string,
    purpose: string,
    reference: string,
    summary: string,
    trnxSummary: string,
) => {
    const wallet = await getMongodbWalletByUsername(username);
    if (!wallet) {
        return {
            status: false,
            statusCode: 404,
            message: `User ${username} doesn\'t exist`,
        };
    }
    const session = await mongoose.startSession();
    session.startTransaction();
    const updatedWallet = await updateMongoWalletByUsername(
        username,
        { $inc: { balance: amount } },
    );
    // BUG:: fix transaction not saving
    const transaction = await createTransactionInMongdb(
        {
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
        },
    );

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

export const performDebitWallet = async (
    amount: number,
    username: string,
    purpose: string,
    reference: string,
    summary: string,
    trnxSummary: string,
) => {
    const wallet = await getMongodbWalletByUsername(username);
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

    const updatedWallet = await updateMongoWalletByUsername(
        username,
        { $inc: { balance: -amount } },
    );
    const transaction = await createTransactionInMongdb(

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

    );

    console.log(`Debit successful`);
    return {
        status: true,
        statusCode: 201,
        message: "Debit successful",
        data: { updatedWallet, transaction },
    };
};